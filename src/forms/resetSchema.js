import { z } from "zod";

export const createResetSchema = (previousPassword = "") =>
  z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password is too long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        .refine((val) => val !== previousPassword, {
          message: "New password cannot be the same as your previous password",
        }),
      confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
