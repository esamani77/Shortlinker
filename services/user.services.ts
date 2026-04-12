import { prisma } from "../lib/prisma";
import { CreateUserInput } from "../validations/users.validations";

const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const createUser = async (user: CreateUserInput & { salt: string }) => {
  return await prisma.user.create({
    data: user,
  });
};

const getUserUrls = async (userId: string) => {
  return await prisma.link.findMany({
    where: {
      userId,
    },
  });
};

export { getUserByEmail, createUser, getUserUrls };
