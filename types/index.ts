import {
  createRequestSchema,
  makeGuardSchema,
  StatusSchema,
  TypeSchema,
} from "@/lib/validators";

import { NextRequest } from "next/server";
import z from "zod";

export type actionFunction<T> = (
  prevState: T,
  formData: FormData,
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
  type: RequestType;
  status: Status;
  createdAt: Date;
  pickup: string | null;
  dropoff: string | null;
  trackingCode: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
}

export type ServiceCardProps = {
  icon: string;
  spanText: string;
  title: string;
  description: string;
  linkHref: string;
  btnText?: string | "Learn More";
  serviceCard: boolean;
};

export type Status = z.infer<typeof StatusSchema>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type RequestType = z.infer<typeof TypeSchema>;

export type PageProps = {
  params: Promise<{ id: string }>;
};

export type RequestDetailsProps = {
  time?: string | number | Date;
  [key: string]: unknown;
};

export type RequestListsProps = {
  requests: {
    id: string;
    trackingCode: string;
    type: RequestType;
    status: Status;
    createdAt: Date;
    details: RequestDetailsProps;
  }[];
};

export type BackButtonProps = {
  fallbackHref: string;
  label?: string;
  className?: string;
};

export type AdminRequestsQuery = {
  page?: number;
  limit?: number;
  status?: Status | "ALL";
  type?: RequestType | "ALL";
  q?: string; //tracking code search
};

export type AnyObj = Record<string, unknown>;

export type AdminTableRowProps = {
  id: string;
  type: RequestType;
  status: Status;
  createdAt: Date;
  trackingCode: string;
  details: RequestDetailsProps;
  user: {
    name: string | null;
    email: string;
  };
};

export type GuardProfileProps = z.infer<typeof makeGuardSchema> & {
  id: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
  createdAt: Date;
};
