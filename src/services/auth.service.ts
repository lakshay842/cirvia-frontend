import { post } from "@/lib/api";
import type { LoginResponse, RefreshResponse } from "@/types/auth.types";

export const authService = {
  register: (body: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    acceptTerms: true;
  }) => post<Record<string, never>>("/auth/register", body),

  login: (body: { email: string; password: string; rememberMe?: boolean }) =>
    post<LoginResponse>("/auth/login", body),

  loginPhone: (body: { phone: string; otp: string }) =>
    post<LoginResponse>("/auth/login-phone", body),

  refresh: (refreshToken: string) =>
    post<RefreshResponse>("/auth/refresh", { refreshToken }),

  logout: (refreshToken?: string) =>
    post<Record<string, never>>("/auth/logout", refreshToken ? { refreshToken } : {}),

  forgotPassword: (email: string) =>
    post<Record<string, never>>("/auth/forgot-password", { email }),

  resetPassword: (body: { token: string; password: string; confirmPassword: string }) =>
    post<Record<string, never>>("/auth/reset-password", body),

  verifyEmail: (token: string) =>
    post<Record<string, never>>("/auth/verify-email", { token }),

  sendEmailVerification: () =>
    post<Record<string, never>>("/auth/send-email-verification"),

  sendPhoneOtp: (phone: string) =>
    post<Record<string, never>>("/auth/send-phone-otp", { phone }),

  verifyPhoneOtp: (body: { phone: string; otp: string }) =>
    post<Record<string, never>>("/auth/verify-phone-otp", body),
};
