"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormContainer from "../shared/form/form-container";
import { updateRequestStatusAction } from "@/lib/actions/admin/update-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

type StatusValue = (typeof STATUS_OPTIONS)[number]["value"];

export const AdminUpdateStatusCard = ({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: StatusValue;
}) => {
  const [status, setStatus] = React.useState<StatusValue>(currentStatus);

  // keep local state in sync if the page re-renders with a new status
  React.useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Update Status</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <FormContainer action={updateRequestStatusAction} className="space-y-3">
          <input type="hidden" name="requestId" value={requestId} />
          <input type="hidden" name="status" value={status} />

          <Select
            value={status}
            onValueChange={(v) => setStatus(v as StatusValue)}
          >
            <SelectTrigger className="text-white bg-white/3 border-white/10">
              <SelectValue placeholder="Select status…" />
            </SelectTrigger>

            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            disabled={status === currentStatus}
            className="w-full text-white border border-white/15 bg-white/3 hover:bg-white/6 hover:text-white/90"
          >
            Update Status
          </Button>
        </FormContainer>

        <p className="text-xs text-white/60">
          Status updates will reflect on tracking and timelines.
        </p>
      </CardContent>
    </Card>
  );
};
