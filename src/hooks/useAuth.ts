"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { QUERY_KEYS } from "@/constants/query-keys";
import { ROUTES } from "@/constants/routes";
import { getSafeRedirect } from "@/lib/redirect";
import type { FullUser } from "@/types/user.types";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      const { accessToken, refreshToken, user } = res.data;
      setAuth(user, accessToken, refreshToken);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.me });
      router.push(getSafeRedirect(searchParams.get("redirect")));
    },
  });
}

export function useLoginPhone() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: authService.loginPhone,
    onSuccess: (res) => {
      const { accessToken, refreshToken, user } = res.data;
      setAuth(user, accessToken, refreshToken);
      router.push(getSafeRedirect(searchParams.get("redirect")));
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      router.push(`${ROUTES.login}?registered=1`);
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(refreshToken ?? undefined),
    onSettled: () => {
      clearAuth();
      qc.clear();
      router.push(ROUTES.home);
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: (email: string) => authService.forgotPassword(email) });
}

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => router.push(`${ROUTES.login}?reset=1`),
  });
}

export function useVerifyEmail() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: async () => {
      const existing = useAuthStore.getState().user;
      if (existing) {
        useAuthStore.getState().setUser({ ...existing, emailVerified: true });
      }

      qc.setQueryData(QUERY_KEYS.users.me, (old: FullUser | undefined) =>
        old ? { ...old, emailVerified: true } : old,
      );
      await qc.invalidateQueries({ queryKey: QUERY_KEYS.users.me });

      if (useAuthStore.getState().isAuthenticated) {
        router.push(`${ROUTES.profile}?verified=1`);
      } else {
        router.push(`${ROUTES.login}?verified=1`);
      }
    },
  });
}

export function useSendPhoneOtp() {
  return useMutation({ mutationFn: (phone: string) => authService.sendPhoneOtp(phone) });
}

export function useVerifyPhoneOtp() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.verifyPhoneOtp,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.me });
      router.push(ROUTES.profile);
    },
  });
}

export function useSendEmailVerification() {
  return useMutation({
    mutationFn: () => authService.sendEmailVerification(),
    meta: { successMessage: "Verification email sent" },
  });
}

export function useRefreshAuth() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  return useMutation({
    mutationFn: async () => {
      if (!refreshToken) throw new Error("No refresh token");
      const res = await authService.refresh(refreshToken);
      setTokens(res.data.accessToken, res.data.refreshToken);
      return res.data;
    },
  });
}
