"use client";

import FormContainer from "@/components/shared/form/form-container";
import FormInput from "@/components/shared/form/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateRequestAction } from "@/lib/actions/requests/create-request";
import { RequestTypeProps } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";
import { success } from "zod";

function labelForType(type: RequestTypeProps) {
  switch (type) {
    case "PERSONAL_SECURITY":
      return "Personal Security";
    case "ESCORT":
      return "Escort Service";
    case "DELIVERY":
      return "Valuable Deliveries";
    default:
      return "";
  }
}

export default function NewRequestForm(props: { type: RequestTypeProps }) {
  return (
    <Card className="border-white/10 bg-white/4 text-white backdrop-blur-xl overflow-hidden">
      <div className="border-b border-white/10 bg-white/3 px-6 py-4">
        <p className="text-xs uppercase tracking-widest text-white/50">
          Create Request
        </p>
        <h1 className="mt-1 text-xl sm:text-2xl font-semibold">
          {labelForType(props.type)}
        </h1>
        <p className="mt-1 text-sm text-white/70">
          Fill in the details below. You&apos;ll receive a tracking code after
          submission.
        </p>
      </div>

      <CardContent className="p-6">
        <FormContainer action={CreateRequestAction} className="space-y-5">
          {(data) => {
            const result = data as {
              success: boolean;
              message?: unknown;
              redirectTo?: string;
            };

            return (
              <>
                <input type="hidden" name="type" value={props.type} />

                {props.type === "PERSONAL_SECURITY" ? (
                  <>
                    <FormInput
                      name="location"
                      type="text"
                      label="Location"
                      placeholder="e.g. Eko Hotel, Victoria Island"
                      className="text-xs"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormInput
                        name="date"
                        type="date"
                        label="Date"
                        className="text-xs"
                      />

                      <FormInput
                        name="durationHours"
                        type="number"
                        label="Duration (hours)"
                        className="text-xs"
                        placeholder="e.g. 4"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <FormInput
                      name="pickup"
                      type="text"
                      label="Pickup Location"
                      placeholder="e.g. Ikeja Mall"
                      className="text-xs"
                    />
                    <FormInput
                      name="dropoff"
                      type="text"
                      label="Destination"
                      placeholder="e.g. Lekki Phase 1"
                      className="text-xs"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormInput
                        name="date"
                        type="date"
                        label="Date"
                        className="text-xs"
                      />

                      <FormInput
                        name="time"
                        type="time"
                        label="Time"
                        className="text-xs"
                      />
                    </div>

                    {props.type === "ESCORT" ? (
                      <FormInput
                        name="persons"
                        type="number"
                        label="Number of Persons"
                        className="text-xs"
                        placeholder="e.g. 2"
                      />
                    ) : (
                      <>
                        <FormInput
                          name="itemDescription"
                          type="text"
                          label="Item Description"
                          placeholder="e.g. Documents, electronics, cash package"
                          className="text-xs"
                        />
                        <FormInput
                          name="estimatedValue"
                          type="number"
                          label="Estimated Value (₦)"
                          placeholder="e.g. 50000"
                          className="text-xs"
                        />
                      </>
                    )}
                  </>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm text-white/80 ">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="w-full rounded-md border border-white/10 bg-white/3 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-gold/60"
                    placeholder="Additional details or instructions"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full mt-2 bg-gold hover:bg-gold/90 text-black"
                >
                  {result?.success ? "Request Created!" : "Create Request"}
                </Button>

                {/* Error message */}
                {result?.success === false && (
                  <div className="text-center text-destructive text-sm sm:text-base">
                    {String(result.message)}
                  </div>
                )}

                <div className="pt-2 text-xs text-white text-center">
                  By submitting, you agree to share request details for guard
                  assignment and tracking purposes.
                </div>
              </>
            );
          }}
        </FormContainer>
      </CardContent>
    </Card>
  );
}
