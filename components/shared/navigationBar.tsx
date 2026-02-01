import React from "react";
import NotificationBellServer from "./notifications/notification-bell-server";
import UserMenu from "../dashboard/user-menu";

const NavigationBar: React.FC<{
  userName: string;
  userEmail: string;
  role?: string;
}> = ({ userName, userEmail, role }) => {
  return (
    <div className="flex items-center gap-2">
      <NotificationBellServer />
      <UserMenu name={userName} email={userEmail} role={role} />
    </div>
  );
};

export default NavigationBar;
