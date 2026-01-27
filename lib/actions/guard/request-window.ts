"use server";

import { dateToDayOfWeekEnum, hhmToMinutes } from "@/lib/scheduling/time";

export const getRequestWindowAction = async (
  details: Record<string, unknown>,
) => {
  const dateStr = details["date"] as string;
  if (!dateStr) {
    throw new Error("Date is required");
  }

  const dateObj = new Date(dateStr);
  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("Invalid date format");
  }

  const day = dateToDayOfWeekEnum(dateObj);

  //Start minute
  let startMin = 0;
  if (details.time) {
    const m = hhmToMinutes(String(details.time));
    if (m === null) return null;
    startMin = m;
  }

  // end minute
  let endMin = startMin + 60;
  if (details?.durationHours) {
    const dur = hhmToMinutes(String(details.durationHours));
    if (!Number.isFinite(dur) || dur <= 0) {
      throw new Error("Invalid duration format");
    }
    endMin = startMin + Math.round(dur * 60);
  }

  return {
    day,
    startMin,
    endMin,
    date: dateObj,
  };
};
