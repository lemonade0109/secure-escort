"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import FormContainer from "../shared/form/form-container";
import { assignGuardAction } from "@/lib/actions/admin/assign-guard";
import { Button } from "../ui/button";

const AssignGuardCard: React.FC<{
  requestId: string;
  guards: { id: string; label: string }[];
  currentGuardId?: string | null;
}> = ({ requestId, guards, currentGuardId }) => {
  const [guardId, setGuardId] = React.useState<string>(currentGuardId || "");
  console.log(requestId, guards, currentGuardId);
  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Assign Guard</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Select value={guardId} onValueChange={setGuardId}>
          <SelectTrigger className="text-white border-white/10 bg-white/3">
            <SelectValue placeholder="Select a guard" />
          </SelectTrigger>

          <SelectContent>
            {guards.map((guard) => (
              <SelectItem key={guard.id} value={guard.id}>
                {guard.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <FormContainer
          action={async (Prev, fd) => {
            const gid = fd.get("guard") as string;
            return await assignGuardAction(requestId, gid);
          }}
          className="w-full"
        >
          {(state) => (
            <>
              <input type="hidden" name="guardId" value={guardId} />
              <Button
                type="submit"
                className="w-full text-black bg-gold hover:bg-gold/90"
                disabled={!guardId}
              >
                Assign Guard
              </Button>

              {state?.success === false ? (
                <p className="text-xs text-center text-destructive">
                  {String(state.message)}
                </p>
              ) : null}
            </>
          )}
        </FormContainer>

        {currentGuardId ? (
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
};

export default AssignGuardCard;
