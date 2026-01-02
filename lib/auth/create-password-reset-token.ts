import { prisma } from "@/db/prisma";
import { expiresInMinutes, generateToken, hashToken } from "./token";

export const createPasswordResetToken = async (userId: string) => {
  // Delete existing tokens for the user
  await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });

  // Generate a unique token
  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);

  // Store the token in the database
  await prisma.passwordResetToken.create({
    data: {
      token: hashedToken,
      userId,
      expiresAt: expiresInMinutes(60), // Token valid for 60 minutes
    },
  });

  return rawToken;
};
