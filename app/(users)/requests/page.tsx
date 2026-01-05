import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import React from "react";

export default async function RequestPage() {
  await requireVerifiedUser();
  return <div>RequestPage</div>;
}
