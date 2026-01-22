"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormContainer from "../shared/form/form-container";
import { toggleGuardActiveAction } from "@/lib/actions/admin/toogle-guard-active";
import { Button } from "../ui/button";

const MakeGuardActive: React.FC<{ active: boolean; guardId: string }> = ({
  active,
  guardId,
}) => {
  const [next, setNext] = React.useState(active);

  React.useEffect(() => {
    setNext(active);
  }, [active]);
  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Availability</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <FormContainer action={toggleGuardActiveAction} className="space-y-4">
          {() => (
            <>
              <input type="hidden" name="guardId" value={guardId} />
              <input type="hidden" name="active" value={String(!next)} />
              <div className="p-4 border rounded-xl border-white/10 bg-white/3">
                <p className="text-xs tracking-widest uppercase text-white/50">
                  Current
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {next ? "Active(Assignable)" : "Inactive(Not assignable)"}
                </p>
              </div>

              <Button
                type="submit"
                className={
                  next
                    ? "w-full border border-white/15 bg-white/3 p-4"
                    : "w-full bg-gold text-black hover:bg-gold/90"
                }
                onClick={() => setNext((v) => !v)}
              >
                {next ? "Deactivate Guard" : "Activate Guard"}
              </Button>

              <p className="text-xs text-white/60">
                Inactive guards won&apos;t appear in &quot;Assign Guard&quot;.
              </p>
            </>
          )}
        </FormContainer>
      </CardContent>
    </Card>
  );
};

export default MakeGuardActive;
