import UserMenu from "@/components/dashboard/user-menu";
import NotificationBellServer from "@/components/shared/notifications/notification-bell-server";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

const DashboardNav: React.FC<{
  email: string | null | undefined;
  name: string | null | undefined;
  role?: string | null | undefined;
  image?: string | null | undefined;
}> = ({ email, name, role, image }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/3">
      <Link href="/" className="flex items-center gap-2">
        <div className="inline-flex items-center justify-center border rounded-lg size-8 border-white/10 bg-white/3">
          <ShieldCheck className="size-4 text-gold" />
        </div>
        <span className="text-sm font-medium tracking-tight">
          Secure Escort
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <NotificationBellServer />

        <UserMenu name={name} email={email} role={role} image={image} />
      </div>
    </div>
  );
};

export default DashboardNav;
