import { z } from "zod";

export function validateWithZodSchema<S extends z.ZodTypeAny>(
  schema: S,
  data: unknown
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
        "Password must contain at least one special character"
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
