import { DayOfWeek } from "@prisma/client";

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

export function overlaps(
  a: { day: string; startMin: number; endMin: number },
  b: { day: string; startMin: number; endMin: number },
) {
  if (a.day !== b.day) return false;
  return a.startMin < b.endMin && b.startMin < a.endMin;
}
