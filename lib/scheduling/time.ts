import { DayOfWeek } from "@prisma/client";

export function parseDateOnlyToUTC(dateStr: string) {
  // dateStr: "YYYY-MM-DD"
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) throw new Error("Invalid date format");

  // Use 12:00 UTC to avoid any timezone day-shift issues
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

export function durationToMinutes(duration: string | number): number {
  if (typeof duration === "number") {
    // Handle numeric duration (assumed to be hours)
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error(`Invalid duration: ${duration}`);
    }
    return Math.round(duration * 60);
  }

  // Handle string duration in "HH:MM" format
  const trimmed = String(duration).trim();
  if (!trimmed.includes(":")) {
    // If no colon, try parsing as hours
    const hours = parseFloat(trimmed);
    if (!Number.isFinite(hours) || hours <= 0) {
      throw new Error(`Invalid duration format: "${duration}"`);
    }
    return Math.round(hours * 60);
  }

  // Parse "HH:MM" format
  return hhmToMinutes(trimmed);
}

export function hhmToMinutes(hhm: string) {
  const [hoursStr, minutesStr] = hhm.split(":").map(Number);
  if (Number.isNaN(hoursStr) || Number.isNaN(minutesStr)) {
    throw new Error("Invalid time format");
  }
  return hoursStr * 60 + minutesStr;
}

export function minutesToHHMM(minutes: number) {
  const hrs = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hrs}:${mins}`;
}

export function dateToDayOfWeekEnum(date: Date) {
  const day = date.getDay();

  const map: DayOfWeek[] = [
    DayOfWeek.SUN,
    DayOfWeek.MON,
    DayOfWeek.TUE,
    DayOfWeek.WED,
    DayOfWeek.THU,
    DayOfWeek.FRI,
    DayOfWeek.SAT,
  ];

  return map[day];
}

export function dateToDayOfWeekEnumUTC(date: Date): DayOfWeek {
  const idx = date.getUTCDay(); // 0=SUN ... 6=SAT
  const map: DayOfWeek[] = [
    DayOfWeek.SUN,
    DayOfWeek.MON,
    DayOfWeek.TUE,
    DayOfWeek.WED,
    DayOfWeek.THU,
    DayOfWeek.FRI,
    DayOfWeek.SAT,
  ];
  return map[idx];
}

export function overlaps(
  a: { day: string; startMin: number; endMin: number },
  b: { day: string; startMin: number; endMin: number },
) {
  if (a.day !== b.day) return false;
  return a.startMin < b.endMin && b.startMin < a.endMin;
}
