"use client";

import { RequestStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormContainer from "../shared/form/form-container";
import { guardUpdateJobStatusAction } from "@/lib/actions/guard/update-job-status";
import { Button } from "../ui/button";
import { formatGuardEta } from "@/lib/utils";
import React from "react";
import { useLiveTracking } from "./use-live-tracking";

export const GuardJobActionsCard: React.FC<{
  requestId: string;
  currentStatus: RequestStatus;
  etaFrom: Date | null;
}> = ({ requestId, currentStatus, etaFrom }) => {
  const [status, setStatus] = React.useState<RequestStatus>(currentStatus);

  React.useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const { isRunning, start, stop } = useLiveTracking({
    requestId,
    intervalMs: 15000,
  });

  React.useEffect(() => {
    if (status === "IN_PROGRESS" && !isRunning) start();
    if (status !== "IN_PROGRESS" && isRunning) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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

  const submittedNextRef = React.useRef<RequestStatus | null>(null);
  const [formState, setFormState] = React.useState<{
    success?: boolean;
  } | null>(null);

  React.useEffect(() => {
    if (!formState?.success) return;
    const submittedNext = submittedNextRef.current;
    if (!submittedNext) return;
    setStatus(submittedNext);

    if (submittedNext === "IN_PROGRESS") start();
    if (submittedNext === "COMPLETED") stop();

    // clear so it doesn't re-run on re-render
    submittedNextRef.current = null;
  }, [formState?.success, start, stop]);

  return (
    <Card className="text-white border-white/10 bg-white/3 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-medium ">Job Actions</CardTitle>
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      </CardHeader>

      <CardContent className="space-y-3">
        <>
          {currentStatus === "COMPLETED" ? (
            <p className="text-sm text-white/80">
              This job has been completed.
            </p>
          ) : (
            <p className="text-sm text-white/60">{formatGuardEta(etaFrom)}</p>
          )}

          {/* Tracking status indicator */}
          <div className="rounded-xl border border-white/10 bg-white/3 p-3">
            <p className="text-xs tracking-widest uppercase text-white/50">
              Live Tracking
            </p>
            <p className="mt-1 text-sm text-white/80">
              {status === "IN_PROGRESS"
                ? isRunning
                  ? "Active (sending locations)"
                  : "Starting..."
                : "Inactive"}
            </p>
          </div>

          <FormContainer
            action={guardUpdateJobStatusAction}
            className=""
            onStateChange={setFormState}
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

          <p className="text-xs text-white/60">
            Guards can only move progress forward (Assigned → In Progress →
            Completed).
          </p>
        </>
      </CardContent>
    </Card>
  );
};
