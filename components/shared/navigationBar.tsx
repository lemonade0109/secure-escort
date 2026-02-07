import React from "react";
import NotificationBellServer from "./notifications/notification-bell-server";
import UserMenu from "../dashboard/user-menu";
import { getProfileAction } from "@/lib/actions/profile/get-profile";

const NavigationBar: React.FC<{
  role?: string;
}> = async ({ role }) => {
  const data = await getProfileAction();
  return (
    <div className="flex items-center gap-2">
      <NotificationBellServer />
      <UserMenu
        name={data?.name || ""}
        email={data?.email || ""}
        role={role}
        image={data?.image || ""}
      />
    </div>
  );
};

export default NavigationBar;
