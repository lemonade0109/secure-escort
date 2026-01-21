import { db } from "@/db/db";

export const generateBadge = async (prefix = "B") => {
  for (let attempt = 0; attempt < 19; attempt++) {
    const candidate = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

    const exists = await db.guardProfile.findUnique({
      where: { badgeId: candidate },
      select: { id: true },
    });

    if (!exists) return candidate;
  }

  throw new Error(
    "Unable to generate a unique badge ID. Please try again later.",
  );
};
