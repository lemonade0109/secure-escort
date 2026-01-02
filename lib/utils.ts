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
      "server selection timeout"
    ) ||
      ((error as Record<string, unknown>).message as string).includes(
        "interrupted due to server monitor timeout"
      ))
  ) {
    return "Unable to connect to the database. Please check your internet connection and try again.";
  }

  // Fallback generic message
  return "Something went wrong. Please try again later.";
}
