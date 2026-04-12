import { prisma } from "../lib/prisma";
import { CreateUrlType } from "../validations/url.validations";
import { CreateUserInput } from "../validations/users.validations";

const getUrlByShortUrl = async (shortUrl: string) => {
  return await prisma.link.findUnique({
    where: {
      shortUrl,
    },
  });
};

const createUrl = async (
  url: CreateUrlType & { userId: string; shortUrl: string },
) => {
  return await prisma.link.create({
    data: {
      url: url.url,
      shortUrl: url.shortUrl,
      userId: url.userId,
    },
  });
};

const deleteUrl = async (shortUrl: string, userId: string) => {
  return await prisma.link.delete({
    where: {
      shortUrl,
      userId,
    },
  });
};

export { getUrlByShortUrl, createUrl, deleteUrl };
