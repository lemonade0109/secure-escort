"use server";

import { auth } from "@/auth";
import { db } from "@/db/db";
import { redirect } from "next/navigation";

export async function requireVerifiedUser() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  });

  if (!user?.emailVerified) {
    redirect(`/check-email?email=${encodeURIComponent(email)}`);
  }

  return { session };
}
