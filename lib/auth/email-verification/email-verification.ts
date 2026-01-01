"use server";

import { prisma } from "@/db/prisma";
import { expiresInMinutes, generateToken, hashToken } from "../token";

export const createEmailVerificationToken = async (userId: string) => {
  //Cleanup existing tokens for the user
  await prisma.emailVerificationToken.deleteMany({
    where: { userId },
  });

  const rawToken = generateToken();
  const token = hashToken(rawToken);
  const expiresAt = expiresInMinutes(30); // Token valid for 30 minutes

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return rawToken;
};
