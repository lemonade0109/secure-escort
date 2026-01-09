import { createRequestSchema } from "@/lib/validators";
import { NextRequest } from "next/server";
import z from "zod";

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

export interface DashboardStatsProps {
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export interface RecentRequestProps {
  id: string;
  type: "ESCORT" | "PERSONAL_SECURITY" | "DELIVERY";
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  pickup: string | null;
  dropoff: string | null;
  trackingCode: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
}

export type RequestTypeProps = "PERSONAL_SECURITY" | "ESCORT" | "DELIVERY";

export type ServiceCardProps = {
  icon: string;
  spanText: string;
  title: string;
  description: string;
  linkHref: string;
  btnText?: string | "Learn More";
  serviceCard: boolean;
};

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export type PageProps = {
  params: Promise<{ id: string }>;
};

export type RequestDetails = {
  time?: string | number | Date;
  [key: string]: unknown;
};
