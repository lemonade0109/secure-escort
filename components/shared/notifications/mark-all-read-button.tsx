"use client";

import { Button } from "@/components/ui/button";
import { markAllReadAction } from "@/lib/actions/notifications/markAllRead";
import React from "react";

const MarkAllReadButton = () => {
  const [pending, startTransition] = React.useTransition();
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className="h-7 px-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
      disabled={pending}
      onClick={() =>
        startTransition(async () => void (await markAllReadAction()))
      }
    >
      {pending ? "..." : "Mark all read"}
    </Button>
  );
};

export default MarkAllReadButton;
