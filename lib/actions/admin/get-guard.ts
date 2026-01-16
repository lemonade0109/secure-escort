"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export const getGuardAction = async () => {
  // Verify admin access
  const { session } = await requireVerifiedUser();
  const isAdminUser = isAdmin(session?.user?.email);
  if (!isAdminUser) {
    return {
      success: false,
      message: "Unauthorized: Admin access required.",
    };
  }

  const guards = await db.user.findMany({
    where: { role: "GUARD" },
    select: {
      id: true,
      name: true,
      email: true,
      guardProfile: {
        select: {
          active: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return guards
    .filter((guard) => guard.guardProfile?.active !== false)
    .map((guard) => ({
      id: guard.id,
      label: `${guard.name ?? "Guard"} (${guard.email})`,
    }));
};
