"use client";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import React from "react";
import MarkAllReadButton from "./mark-all-read-button";
import MarkReadButton from "./mark-read-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Notification } from "@prisma/client";

type NotificationItem = Omit<Notification, "createdAt" | "readAt"> & {
  createdAt: Date | string;
  readAt: Date | string | null;
};

interface NotificationBellProps {
  items: NotificationItem[];
  unreadCount: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  items: initialItems,
  unreadCount: initialUnreadCount,
}) => {
  const [items, setItems] = React.useState<NotificationItem[]>(initialItems);
  const [unreadCount, setUnreadCount] = React.useState(initialUnreadCount);

  React.useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!isMounted) return;
        setItems(data.items || []);
        setUnreadCount(data.unreadCount || 0);
      } catch {
        // ignore polling errors
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const computedUnreadCount = items.filter((notification) => !notification.readAt)
    .length;
  const badgeCount = unreadCount > 0 ? unreadCount : computedUnreadCount;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/3 text-white/80 hover:bg-white/6"
        >
          <Bell className="size-4" />
          {badgeCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex min-w-4.5 justify-center items-center rounded-full bg-gold px-1.5 text-[10px] font-semibold text-black">
              {badgeCount > 9 ? "9+" : badgeCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 border-white/10 bg-[#070a12] text-white"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-sm">Notifications</span>
          <MarkAllReadButton />
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        {items.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-white/60">
            No notifications yet
          </div>
        ) : (
          <div className="max-h-80 overflow-x-hidden">
            {items.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 py-3 focus:bg-white/5"
                asChild
              >
                <div className="w-full flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white/90 truncate">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-xs text-white/60 line-clamp-2">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-[10px] text-white/40">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {!notification.readAt && (
                      <span className="mt-1 size-2 rounded-full bg-gold" />
                    )}
                    <MarkReadButton notificationId={notification.id} />

                    {notification.href && (
                      <div className="">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-7 border-white/15 bg-white/3 text-white hover:text-white/80 hover:bg-white/6"
                        >
                          <Link href={notification.href}>Open</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
