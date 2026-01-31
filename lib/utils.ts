import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Render error message from different error shapes
export function renderError(error: unknown): { message: string } {
  console.log(error);

  if (error instanceof Error) {
    return { message: error.message };
  }

  try {
    const maybe = error as { message?: unknown };
    if (maybe && typeof maybe.message === "string") {
      return { message: maybe.message };
    }
  } catch {
    // ignore
  }

  return { message: "An error occurred" };
}

// Normalize different error shapes into a plain string message
export function asStringMessage(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value) return "An error occurred";
  if (value instanceof Error) return value.message;
  try {
    const v = value as { message?: unknown };
    if (v && typeof v.message === "string") return v.message;
    return String(value);
  } catch {
    return "An error occurred";
  }
}

// Provide user-friendly error messages based on error types or codes
export function getFriendlyErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as Record<string, unknown>).code === "ECONNREFUSED"
  ) {
    return "Unable to connect. Please check your internet connection and try again.";
  }

  // MongoDB/Prisma connection errors
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string" &&
    (((error as Record<string, unknown>).message as string).includes(
      "server selection timeout",
    ) ||
      ((error as Record<string, unknown>).message as string).includes(
        "interrupted due to server monitor timeout",
      ))
  ) {
    return "Unable to connect to the database. Please check your internet connection and try again.";
  }

  // Fallback generic message
  return "Something went wrong. Please try again later.";
}

// helper func to generate tracking code
export function makeTrackingCode(prefix = "SE") {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${part}${time}`; // eg: SE-A1B2C3D4
}

// To Format ETA Range
export function formatEtaRange(
  etaFrom?: Date | string | null,
  etaTo?: Date | string | null,
  opts?: {
    prefix?: string; // "Estimated arrival"
    locale?: string; // default uses browser/server locale
    includeDateWhenDifferentDay?: boolean; // default true
  },
) {
  const prefix = opts?.prefix ?? "Estimated arrival";
  const includeDateWhenDifferentDay = opts?.includeDateWhenDifferentDay ?? true;

  if (!etaFrom || !etaTo) return `${prefix}: Not set yet`;

  const from = typeof etaFrom === "string" ? new Date(etaFrom) : etaFrom;
  const to = typeof etaTo === "string" ? new Date(etaTo) : etaTo;

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return `${prefix}: Not set yet`;
  }

  const locale = opts?.locale;

  const timeFmt = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  });

  const dayFmt = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  });

  const sameDay =
    from.getFullYear() === to.getFullYear() &&
    from.getMonth() === to.getMonth() &&
    from.getDate() === to.getDate();

  // Same day: "2:00 PM – 4:00 PM"
  if (sameDay) {
    return `${prefix}: ${timeFmt.format(from)} – ${timeFmt.format(to)}`;
  }

  // Different days: "Thu 2:00 PM – Fri 4:00 PM"
  if (includeDateWhenDifferentDay) {
    return `${prefix}: ${dayFmt.format(from)} ${timeFmt.format(from)} – ${dayFmt.format(to)} ${timeFmt.format(to)}`;
  }

  // If you don't want dates even when different day:
  return `${prefix}: ${timeFmt.format(from)} – ${timeFmt.format(to)}`;
}

// Format guard ETA message
export function formatGuardEta(etaFrom?: Date | string | null) {
  if (!etaFrom) return "Arrival time not set";

  const date = new Date(etaFrom);
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `You're expected to arrive by ${time}.`;
}
