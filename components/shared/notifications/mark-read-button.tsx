"use client";
import { Button } from "@/components/ui/button";
import { markNotificationReadAction } from "@/lib/actions/notifications/mark-Notification-Read";
import React from "react";

const MarkReadButton: React.FC<{ notificationId: string }> = ({
  notificationId,
}) => {
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className="h-7 px-2 text-xs text-white/70 hover:text-white hover:bg-white/5"
      disabled={pending}
      onClick={() =>
        startTransition(
          async () => void (await markNotificationReadAction(notificationId)),
        )
      }
    >
      {pending ? "..." : "Read"}
    </Button>
  );
};

export default MarkReadButton;
