import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const tokenSchema = z.object({
  token: z.jwt(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TokenInput = z.infer<typeof tokenSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
