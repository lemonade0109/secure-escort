"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormContainer from "../shared/form/form-container";
import { createCheckPointPingAction } from "@/lib/actions/tracking/create-checkpoint-ping";
import { Button } from "../ui/button";

const QUICK_CHECKPOINTS = [
  "Guard started",
  "Arrived at pickup",
  "On the way",
  "Arrived at dropoff",
  "Arrived at location",
] as const;

const GuardCheckpointCard: React.FC<{ requestId: string }> = ({
  requestId,
}) => {
  const [label, setLabel] = React.useState<string>(QUICK_CHECKPOINTS[0]);
  const [note, setNote] = React.useState<string>("");

  return (
    <Card className="text-white border-white/10 bg-white/3 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Live Updates</CardTitle>
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      </CardHeader>

      <CardContent className="space-y-3">
        <FormContainer
          action={createCheckPointPingAction}
          className="space-y-3"
        >
          {() => (
            <>
              <input type="hidden" name="requestId" value={requestId} />
              <input type="hidden" name="label" value={label} />
              <input type="hidden" name="note" value={note} />

              <div className="grid grid-cols-2 gap-2">
                {QUICK_CHECKPOINTS.map((cp) => (
                  <Button
                    key={cp}
                    type="button"
                    variant={label === cp ? "default" : "outline"}
                    className={
                      label === cp
                        ? "bg-gold text-black hover:bg-gold/90"
                        : "border-white/15 bg-white/3 text-white hover:bg-white/6 hover:text-white/90"
                    }
                    onClick={() => setLabel(cp)}
                  >
                    {cp}
                  </Button>
                ))}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Optional note (e.g. traffic, delay, etc.)"
                className="w-full px-3 py-2 text-sm text-white border rounded-md border-white/10 bg-white/3 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/40"
              />

              <Button
                type="submit"
                className="w-full mt-2 text-black bg-gold hover:bg-gold/90"
              >
                Send Update
              </Button>
            </>
          )}
        </FormContainer>

        <p className="text-xs text-white/60">
          These updates show on the user&apos;s tracking page and request
          timeline.
        </p>
      </CardContent>
    </Card>
  );
};

export default GuardCheckpointCard;
