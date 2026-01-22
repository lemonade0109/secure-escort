"use client";

import React from "react";
import FormContainer from "@/components/shared/form/form-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignGuardAction } from "@/lib/actions/admin/assign-guard";
import { GuardOption } from "@/types";

export default function AssignGuardCard({
  requestId,
  guardOptions,
  defaultGuardId,
}: {
  requestId: string;
  guardOptions: GuardOption[];
  defaultGuardId?: string | null;
}) {
  const [guardId, setGuardId] = React.useState(defaultGuardId ?? "");

  const selected = guardOptions.find((g) => g.id === guardId);
  const isDisabled = !!selected?.disabled;

  // If defaultGuardId changes later (might never happen, but it's safer), keep state in sync:
  React.useEffect(() => {
    setGuardId(defaultGuardId ?? "");
  }, [defaultGuardId]);

  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Assign Guard</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <FormContainer action={assignGuardAction} className="space-y-3">
          <input type="hidden" name="requestId" value={requestId} />
          <input type="hidden" name="guardId" value={guardId} />

          <Select value={guardId} onValueChange={setGuardId}>
            <SelectTrigger className="text-white bg-white/3 border-white/10">
              <SelectValue placeholder="Select a guard…" />
            </SelectTrigger>

            <SelectContent>
              {guardOptions.length === 0 ? (
                // IMPORTANT: SelectItem value cannot be empty string
                <SelectItem value="__none__" disabled>
                  No active guards available
                </SelectItem>
              ) : (
                guardOptions.map((guard) => (
                  <SelectItem
                    key={guard.id}
                    value={guard.id}
                    disabled={guard.disabled}
                  >
                    {guard.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            className="w-full text-black bg-gold hover:bg-gold/90"
            disabled={!guardId || isDisabled}
          >
            Assign Guard
          </Button>
        </FormContainer>

        {defaultGuardId ? (
          <p className="text-xs text-white/60">
            Already assigned. Re-assigning will overwrite the current guard.
          </p>
        ) : (
          <p className="text-xs text-white/60">
            Assign a guard to activate tracking and progress updates.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
