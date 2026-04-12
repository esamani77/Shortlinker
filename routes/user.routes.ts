import { Router } from "express";
import { prisma } from "../lib/prisma";

import { validateBody } from "../middlewares/validations.middlewares";
import {
  createUserSchema,
  loginUserSchema,
} from "../validations/users.validations";
import {
  getUserByEmail,
  createUser,
  getUserUrls,
} from "../services/user.services";
import { createHash } from "../lib/encription";

import jwt from "jsonwebtoken";

const router = Router();

router.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.status(200).json({ users: allUsers });
});

router.post("/signup", validateBody(createUserSchema), async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const { salt, hash } = createHash(password);

  const newUser = await createUser({ email, password: hash, salt, name });

  return res.status(201).json({ user: newUser });
});

router.post("/login", validateBody(loginUserSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const { hash: hashedPassword } = createHash(password, user.salt);

  if (hashedPassword !== user.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return res.status(200).json({ token });
});

router.get("/urls", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const urls = await getUserUrls(req.user.id);
  return res.status(200).json({ urls });
});

export default router;
