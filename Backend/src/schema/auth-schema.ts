import { z } from "zod";

const emailValidation = z.email({ error: "Invalid email address" }).trim();

export const registerSchema = z.object({
  email: emailValidation,
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long"),
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must not exceed 100 length"),
});

export const loginSchema = z.object({
  email: emailValidation,
});
