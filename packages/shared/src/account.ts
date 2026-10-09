import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .email()
  .transform((email) => email.toLowerCase());

export const signUpSchema = z.object({
  email: emailSchema,
  password: z.string().min(12).max(128),
  displayName: z.string().trim().min(1).max(80),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
