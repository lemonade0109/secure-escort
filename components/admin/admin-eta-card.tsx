"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormContainer from "@/components/shared/form/form-container";
import { Button } from "@/components/ui/button";
import { updateRequestsEtaAction } from "@/lib/actions/admin/update-requests-eta";

function toDatetimeLocalValue(date?: Date | string | null) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export default function AdminEtaCard({
  requestId,
  etaFrom,
  etaTo,
}: {
  requestId: string;
  etaFrom?: Date | string | null;
  etaTo?: Date | string | null;
}) {
  const [from, setFrom] = React.useState(toDatetimeLocalValue(etaFrom));
  const [to, setTo] = React.useState(toDatetimeLocalValue(etaTo));

  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">ETA</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <FormContainer action={updateRequestsEtaAction} className="space-y-3">
          {(state) => (
            <>
              <input type="hidden" name="requestId" value={requestId} />
              <input type="hidden" name="etaFrom" value={from} />
              <input type="hidden" name="etaTo" value={to} />

              <div className="grid gap-3">
                <div>
                  <label className="text-xs tracking-widest uppercase text-white/50">
                    ETA From
                  </label>
                  <input
                    type="datetime-local"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full px-3 py-2 mt-2 text-sm text-white border rounded-md outline-none border-white/10 bg-white/3 focus:border-gold/60"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-widest uppercase text-white/50">
                    ETA To
                  </label>
                  <input
                    type="datetime-local"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full px-3 py-2 mt-2 text-sm text-white border rounded-md outline-none border-white/10 bg-white/3 focus:border-gold/60"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Button
                  type="submit"
                  className="w-full text-black bg-gold hover:bg-gold/90"
                >
                  Save ETA
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-white border-white/15 bg-white/3 hover:bg-white/6 hover:text-white/80"
                  onClick={() => {
                    setFrom("");
                    setTo("");
                  }}
                >
                  Clear ETA
                </Button>
              </div>

              {state?.success === false && state.message ? (
                <p className="text-xs text-destructive">
                  {String(state.message)}
                </p>
              ) : (
                <p className="text-xs text-white/60">
                  Visible to users on tracking once assigned/in progress.
                </p>
              )}
            </>
          )}
        </FormContainer>

        <p className="text-xs text-white/60">
          This ETA will show on tracking and request progress once assigned/in
          progress.
        </p>
      </CardContent>
    </Card>
  );
}
