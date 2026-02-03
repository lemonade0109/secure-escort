"use client";
import { Button } from "@/components/ui/button";
import { markNotificationReadAction } from "@/lib/actions/notifications/mark-Notification-Read";
import React from "react";

interface MarkReadButtonProps {
  notificationId: string;
  onMarkRead: (notificationId: string) => void;
}

const MarkReadButton: React.FC<MarkReadButtonProps> = ({
  notificationId,
  onMarkRead,
}) => {
  const [pending, startTransition] = React.useTransition();

  const handleMarkRead = () => {
    startTransition(async () => {
      onMarkRead(notificationId); // Update UI immediately
      await markNotificationReadAction(notificationId); // Update DB in background
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className="h-7 px-2 text-xs text-white/70 hover:text-white hover:bg-white/5"
      disabled={pending}
      onClick={handleMarkRead}
    >
      {pending ? "..." : "Read"}
    </Button>
  );
};

export default MarkReadButton;
