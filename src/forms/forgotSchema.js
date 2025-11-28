import { z } from "zod";

// ----------------------- FORGOT PASSWORD VALIDATION SCHEMA -----------------------
export const forgotSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
});
