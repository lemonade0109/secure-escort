import crypto from "crypto";

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function expiresInMinutes(mins: number) {
  return new Date(Date.now() + mins * 60 * 1000);
}
