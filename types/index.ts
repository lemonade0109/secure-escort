import { NextRequest } from "next/server";

export type actionFunction<T> = (
  prevState: T,
  formData: FormData
) => T | Promise<T>;

export type FormContainerProps = {
  action: actionFunction<FormActionState>;
  children: React.ReactNode | ((data: FormActionState) => React.ReactNode);
  className?: string;
  onReset?: () => void;
};

export type FormActionState = {
  message?: string;
  redirectTo?: string;
  success?: boolean;
};

export type GlowBackgroundProps = {
  intensity: "soft" | "medium" | "strong";
};

export type User = {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  passwordHash?: string;
  emailVerified?: string | Date | null;
};

export type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  id?: string;
  emailVerified?: string | Date | null;
};

export interface AuthRequest extends NextRequest {
  auth: {
    user:
      | { email?: string; role: string; emailVerified?: string | Date | null }
      | null
      | undefined;
  };
}
