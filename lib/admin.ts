// Admin helper utilities
// Checks if a user is an admin based on email addresses configured in environment variables

// Get list of admin emails from environment variable
export function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
  return adminEmailsEnv
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

export function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

//Check if a user session is an admin
export function isAdmin(userEmail?: string | null): boolean {
  if (!userEmail) return false;
  return isAdminEmail(userEmail);
}

export function isAdminClient(email?: string | null): boolean {
  if (!email) return false;
  const adminEmails =
    typeof window !== "undefined" && process.env.NEXT_PUBLIC_ADMIN_EMAILS
      ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map((e) =>
          e.trim().toLowerCase()
        )
      : [];
  return adminEmails.includes(email.toLowerCase());
}
