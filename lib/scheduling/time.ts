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
  const map = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return map[date.getDay()];
}

export function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
) {
  return aStart < bEnd && bStart < aEnd;
}
