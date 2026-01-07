import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import React from "react";

export default async function RequestIdPage() {
  await requireVerifiedUser();

  return <div>RequestIdPage</div>;
}
