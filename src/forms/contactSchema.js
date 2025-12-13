import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(20, "Name must be at most 20 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(10, "Subject must be at least 10 characters").max(30, "Subject must be at most 30 characters"),
  message: z.string().min(25, "Message must be at least 25 characters").max(500, "Message must be at most 500 characters"),
});
