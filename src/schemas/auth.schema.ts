import { z } from "zod";

const email = z.string().trim().email("Invalid email address");
const phone = z.string().trim().min(10, "Invalid phone number").max(15, "Invalid phone number");
const password = z.string().min(8, "Password must be at least 8 characters");

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(50),
    lastName: z.string().trim().min(1, "Last name is required").max(50),
    email,
    phone,
    password,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { message: "You must accept the terms" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const loginPhoneSchema = z.object({
  phone,
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const sendPhoneOtpSchema = z.object({ phone });

export const verifyPhoneOtpSchema = z.object({
  phone,
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type LoginPhoneFormValues = z.infer<typeof loginPhoneSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type VerifyPhoneFormValues = z.infer<typeof verifyPhoneOtpSchema>;
