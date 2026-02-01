import { getMyNotificationAction } from "@/lib/actions/notifications/get-My-Notification";
import NotificationBell from "./notification-bell";

export default async function NotificationBellServer() {
  const { items, unreadCount } = await getMyNotificationAction();

  return <NotificationBell items={items} unreadCount={unreadCount} />;
}
