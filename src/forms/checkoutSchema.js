import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(8, "Phone number too short"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  street: z.string().min(2, "Street is required"),
  paymentMethod: z.enum(["cod", "CreditCard"], "Select a payment method"),
});
