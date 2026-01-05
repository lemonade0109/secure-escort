import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import React from "react";

export default async function ProfilePage() {
  await requireVerifiedUser();
  return <div>ProfilePage</div>;
}
