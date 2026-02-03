import { getMyNotificationAction } from "@/lib/actions/notifications/get-My-Notification";
import NotificationBellClient from "./notification-bell-client";

export default async function NotificationBellServer() {
  const { items, unreadCount } = await getMyNotificationAction();

  return <NotificationBellClient items={items} unreadCount={unreadCount} />;
}
