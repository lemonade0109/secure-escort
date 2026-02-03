"use client";

import { Button } from "@/components/ui/button";
import { clearAllNotificationsAction } from "@/lib/actions/notifications/clear-all-notifications";
import React from "react";

interface ClearAllButtonProps {
  onClearAll: () => void;
}

const ClearAllButton: React.FC<ClearAllButtonProps> = ({ onClearAll }) => {
  const [pending, startTransition] = React.useTransition();

  const handleClearAll = () => {
    startTransition(async () => {
      onClearAll(); // Update UI immediately
      await clearAllNotificationsAction(); // Delete from DB
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className="h-7 px-2 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
      disabled={pending}
      onClick={handleClearAll}
    >
      {pending ? "..." : "Clear all"}
    </Button>
  );
};

export default ClearAllButton;
