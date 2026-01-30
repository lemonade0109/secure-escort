import { z } from "zod";

export function validateWithZodSchema<S extends z.ZodTypeAny>(
  schema: S,
  data: unknown,
): z.infer<S> {
  const results = schema.safeParse(data);

  if (!results.success) {
    const errors = results.error.issues.map((issue) => issue.message);
    throw new Error(errors.join(", "));
  }

  return results.data as z.infer<S>;
}

// Schema for signing up users
export const SignUpActionSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z
      .string()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
  });

// Schema for signin users in
export const userSignInSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  callbackUrl: z.string().optional(),
});

// Schema for forget password
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"),
});

// Schema for reset password
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
  });

// Schema to verify email
export const verifyEmailSchema = z.object({
  token: z.string().min(10, "Verification token is required"),
});

// Schema for service type
export const ServiceTypeSchema = z.object({
  type: z.enum(["PERSONAL_SECURITY", "ESCORT", "DELIVERY"]),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

// Schema for personal security request
const PersonalSecuritySchema = ServiceTypeSchema.extend({
  type: z.literal("PERSONAL_SECURITY"),
  location: z.string().min(3, "Location is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  durationHours: z.coerce.number().min(1, "Duration must be at least 1 hour"),
});

// Schema for escort service request
const EscortServiceSchema = ServiceTypeSchema.extend({
  type: z.literal("ESCORT"),
  pickup: z.string().min(3, "Pickup location is required"),
  dropoff: z.string().min(3, "Dropoff location is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  persons: z.coerce.number().min(1, "At least one person is required"),
});

// Schema for delivery service request
const DeliveryServiceSchema = ServiceTypeSchema.extend({
  type: z.literal("DELIVERY"),
  pickup: z.string().min(3, "Pickup location is required"),
  dropoff: z.string().min(3, "Dropoff location is required"),
  itemDescription: z.string().min(3, "Item description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  estimatedValue: z.coerce.number().min(1, "Estimated value is required"),
});

// Schema for creating a new request
export const createRequestSchema = z.discriminatedUnion("type", [
  PersonalSecuritySchema,
  EscortServiceSchema,
  DeliveryServiceSchema,
]);

// Schema for tracking request by tracking code
export const trackRequestSchema = z.object({
  trackingCode: z
    .string()
    .min(5, "Tracking code is required")
    .max(64, "Invalid tracking code"),
});

// Schema for assigning guard to a request
export const assignGuardSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  guardId: z.string().min(1, "Guard ID is required"),
});

export const StatusSchema = z.enum([
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const TypeSchema = z.enum(["PERSONAL_SECURITY", "ESCORT", "DELIVERY"]);

// Schema for updating request status
export const updateRequestStatusSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  status: StatusSchema,
});

// Schema for updating ETA
export const updateRequestETASchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  etaFrom: z.string().optional(),
  etaTo: z.string().optional(),
});

// Schema for making user a guard
export const makeGuardSchema = z.object({
  badgeId: z.string().min(1, "Badge ID is required").optional(),
  phone: z.string().min(7, "Phone number is required").optional(),
  active: z.coerce.boolean(),
  email: z
    .email("Invalid email address")
    .min(1, "Email is required")
    .optional(),
});

export const daysOfWeekSchema = z.enum([
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
]);

// Schema for creating guard availability
export const createGuardAvailabilitySchema = z.object({
  day: daysOfWeekSchema,
  startTime: z.string().min(4, "Start time is required"),
  endTime: z.string().min(4, "End time is required"),
  timezone: z.string().optional(),
});

// Schema for deleting guard availability
export const deleteGuardAvailabilitySchema = z.object({
  id: z.string().min(1, "Availability ID is required"),
});
