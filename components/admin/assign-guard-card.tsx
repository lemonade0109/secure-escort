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

type GuardOption = {
  id: string;
  label: string; // e.g. "Ayo (B-102) • Active"
};

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
  console.log(guardOptions, requestId, defaultGuardId);

  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Assign Guard</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <FormContainer action={assignGuardAction} className="space-y-3">
          {() => (
            <>
              <input type="hidden" name="requestId" value={requestId} />
              <input type="hidden" name="guardId" value={guardId} />

              <Select value={guardId} onValueChange={setGuardId}>
                <SelectTrigger className="text-white bg-white/3 border-white/10">
                  <SelectValue placeholder="Select a guard…" />
                </SelectTrigger>
                <SelectContent>
                  {guardOptions.map((guard) => (
                    <SelectItem key={guard.id} value={guard.id}>
                      {guard.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="submit"
                className="w-full text-black bg-gold hover:bg-gold/90"
                disabled={!guardId}
              >
                Assign Guard
              </Button>
            </>
          )}
        </FormContainer>

        {defaultGuardId ? (
          <p className="text-xs text-white/60">
            Already assigned. Re-assigning will overwrite the current guard
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
