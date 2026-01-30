"use server";

import {
  dateToDayOfWeekEnum,
  durationToMinutes,
  hhmToMinutes,
  parseDateOnlyToUTC,
} from "@/lib/scheduling/time";

export const getRequestWindowAction = async (
  details: Record<string, unknown>,
) => {
  const dateStr = details["date"] as string;
  if (!dateStr) {
    throw new Error("Date is required");
  }

  // parse date-only safely
  const dateObj = parseDateOnlyToUTC(dateStr);

  // compute day from UTC
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
    const dur = durationToMinutes(String(details.durationHours));
    if (!Number.isFinite(dur) || dur <= 0) {
      throw new Error("Invalid duration format");
    }
    endMin = startMin + dur;
  }

  return {
    day,
    startMin,
    endMin,
    date: dateObj,
  };
};
