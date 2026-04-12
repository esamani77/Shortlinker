import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;

  if (!token) {
    next();
  } else if (!token.startsWith("Bearer ")) {
    res.status(401).json({ error: "Invalid token" });
  } else {
    const userValue = token.split(" ")[1];
    const decoded = jwt.verify(userValue, process.env.JWT_SECRET as string);
    req.user = decoded;

    next();
  }
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
