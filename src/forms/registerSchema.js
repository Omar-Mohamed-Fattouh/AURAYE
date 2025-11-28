// registerSchema.js
import { z } from "zod";

/* ------------------------ STRONG PASSWORD VALIDATION ------------------------- */
export const strongPasswordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .refine((v) => v.length >= 8, {
    message: "Password must be 8 characters or more",
  })
  .refine((v) => /[A-Z]/.test(v), {
    message: "Must contain at least 1 uppercase letter",
  })
  .refine((v) => /[a-z]/.test(v), {
    message: "Must contain at least 1 lowercase letter",
  })
  .refine((v) => /[0-9]/.test(v), {
    message: "Must contain at least 1 number",
  })
  .refine((v) => /[^A-Za-z0-9]/.test(v), {
    message: "Must contain at least 1 special character (!@#$%^&*)",
  });

/* ------------------------ REGISTER SCHEMA ------------------------- */
export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    emailExists: z.boolean().optional(),   // ⬅ مهم!!
    password: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.emailExists !== true, {
    message: "Email already exists",
    path: ["email"],
  });

