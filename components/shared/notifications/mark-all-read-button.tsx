"use client";

import { Button } from "@/components/ui/button";
import { markAllReadAction } from "@/lib/actions/notifications/markAllRead";
import React from "react";

interface MarkAllReadButtonProps {
  onMarkAllRead: () => void;
}

const MarkAllReadButton: React.FC<MarkAllReadButtonProps> = ({
  onMarkAllRead,
}) => {
  const [pending, startTransition] = React.useTransition();

  const handleMarkAllRead = () => {
    startTransition(async () => {
      onMarkAllRead(); // Update UI immediately
      await markAllReadAction(); // Update DB in background
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className="h-7 px-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
      disabled={pending}
      onClick={handleMarkAllRead}
    >
      {pending ? "..." : "Mark all read"}
    </Button>
  );
};

export default MarkAllReadButton;
