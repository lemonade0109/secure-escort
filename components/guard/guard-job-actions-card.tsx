"use client";

import { RequestStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormContainer from "../shared/form/form-container";
import { guardUpdateJobStatusAction } from "@/lib/actions/guard/update-job-status";
import { Button } from "../ui/button";

export const GuardJobActionsCard: React.FC<{
  requestId: string;
  currentStatus: RequestStatus;
}> = ({ requestId, currentStatus }) => {
  const next =
    currentStatus === "ASSIGNED"
      ? ("IN_PROGRESS" as const)
      : currentStatus === "IN_PROGRESS"
        ? ("COMPLETED" as const)
        : null;

  const label =
    next === "IN_PROGRESS"
      ? "Start Job"
      : next === "COMPLETED"
        ? "Mark Completed"
        : "No actions available";

  return (
    <Card className="text-white border-white/10 bg-white/3 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Job Actions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <FormContainer
          action={guardUpdateJobStatusAction}
          className="space-y-4"
        >
          {() => (
            <>
              <input type="hidden" name="requestId" value={requestId} />
              <input type="hidden" name="nextStatus" value={next || ""} />

              <Button
                type="submit"
                className="w-full text-black bg-gold hover:bg-gold/90"
                disabled={!next}
              >
                {label}
              </Button>
            </>
          )}
        </FormContainer>

        <p className="text-xs text-white">
          Guards can only move progress forward (Assigned → In Progress →
          Completed).
        </p>
      </CardContent>
    </Card>
  );
};
