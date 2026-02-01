"use client";
import React from "react";
import FormContainer from "../shared/form/form-container";
import { createGuardAvailabilityBlockAction } from "@/lib/actions/guard/create-availability";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { minutesToHHMM } from "@/lib/scheduling/time";
import { deleteGuardAvailabilityBlockAction } from "@/lib/actions/guard/delete-availability";

type AvailabilityCardProps = {
  data: {
    guard: {
      id: string;
      active: boolean;
    };
    blocks: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      guardId: string;
      day: string;
      startMin: number;
      endMin: number;
      timezone: string | null;
    }[];
  };
};

const DAYS = [
  { value: "MON", label: "Mon" },
  { value: "TUE", label: "Tue" },
  { value: "WED", label: "Wed" },
  { value: "THU", label: "Thu" },
  { value: "FRI", label: "Fri" },
  { value: "SAT", label: "Sat" },
  { value: "SUN", label: "Sun" },
] as const;

const AvailabilityCard: React.FC<AvailabilityCardProps> = ({ data }) => {
  const [day, setDay] = React.useState<(typeof DAYS)[number]["value"]>("MON");
  return (
    <div className="space-y-4">
      {!data ? (
        <div className="p-4 text-sm border rounded-xl border-white/10 bg-white/3 text-white/80">
          No guard profile found (or you&apos;re not signed in)
        </div>
      ) : (
        <>
          <FormContainer
            action={createGuardAvailabilityBlockAction}
            className="space-y-4"
          >
            {() => (
              <>
                <div className="grid gap-3 mt-4 sm:grid-cols-4">
                  <div className="sm:col-span-1">
                    <p className="mb-2 text-xs text-white/60">Day</p>
                    <Select
                      value={day}
                      onValueChange={(v) =>
                        setDay(v as (typeof DAYS)[number]["value"])
                      }
                    >
                      <SelectTrigger className="text-white bg-white/3 border-white/10">
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>

                      <SelectContent>
                        {DAYS.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="day" value={day} />
                  </div>

                  <div className="sm:col-span-1">
                    <p className="mb-2 ml-1 text-xs text-white/60">Start</p>
                    <Input
                      type="time"
                      name="startTime"
                      className="text-white bg-white/3 border-white/10"
                      defaultValue="09:00"
                      required
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <p className="mb-2 ml-1 text-xs text-white/60">End</p>
                    <Input
                      type="time"
                      name="endTime"
                      className="text-white bg-white/3 border-white/10"
                      defaultValue="17:00"
                      required
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <p className="mb-2 text-xs text-white/60">Timezone</p>
                    <Input
                      name="timezone"
                      placeholder="Africa/Lagos"
                      className="text-white bg-white/3 border-white/10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="text-black bg-gold hover:bg-gold/90"
                >
                  Add availability
                </Button>
              </>
            )}
          </FormContainer>

          {/* Existing blocks */}
          <div className="space-y-3">
            <p className="text-xs tracking-widest uppercase text-white/50">
              Your blocks
            </p>

            {data.blocks.length === 0 ? (
              <div className="p-4 text-sm border rounded-xl border-white/10 bg-white/3 text-white/80">
                No blocks yet. Add one above.
              </div>
            ) : (
              data.blocks.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 p-4 border sm:flex-row sm:items-center sm:justify-between rounded-xl border-white/10 bg-white/3"
                >
                  <div className="text-sm">
                    <span className="font-medium">{b.day}</span>
                    <span className="text-white/60">
                      {" "}
                      • {minutesToHHMM(b.startMin)} – {minutesToHHMM(b.endMin)}
                    </span>
                    {b.timezone ? (
                      <span className="text-white/50"> • {b.timezone}</span>
                    ) : null}
                  </div>

                  <FormContainer
                    action={deleteGuardAvailabilityBlockAction}
                    className="p-0 m-0"
                  >
                    {() => (
                      <>
                        <input type="hidden" name="id" value={b.id} />
                        <Button
                          type="submit"
                          variant="outline"
                          className="text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6"
                        >
                          Remove
                        </Button>
                      </>
                    )}
                  </FormContainer>
                </div>
              ))
            )}
          </div>

          <p className="text-xs text-white/60">
            Admin assignment will only work if the request time falls inside an
            availability block and you’re not busy.
          </p>
        </>
      )}
    </div>
  );
};

export default AvailabilityCard;
