"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { verificationService } from "@/services/verification.service";
import { useAuthStore } from "@/stores/auth-store";
import type { SubmitVerificationPayload, VerificationStatus } from "@/types/verification.types";

const RESUBMITTABLE: VerificationStatus[] = ["REJECTED", "EXPIRED", "CANCELLED"];
const IN_REVIEW: VerificationStatus[] = ["PENDING", "UNDER_REVIEW", "RESUBMITTED"];

export function useVerificationStatus() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.verification.status,
    queryFn: async () => {
      const res = await verificationService.getStatus();
      return res.data.verification ?? null;
    },
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

export function useVerificationDetails(hasVerification: boolean) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.verification.details,
    queryFn: async () => {
      const res = await verificationService.getCurrentDetails();
      return res.data.verification;
    },
    enabled: isAuthenticated && hasVerification,
    staleTime: 30_000,
  });
}

export function useSubmitVerification() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitVerificationPayload) => verificationService.submit(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.verification.status });
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.verification.details });
    },
  });
}

export function useResubmitVerification() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitVerificationPayload) => verificationService.resubmit(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.verification.status });
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.verification.details });
    },
  });
}

export function canResubmitKyc(status: VerificationStatus | undefined): boolean {
  return status !== undefined && RESUBMITTABLE.includes(status);
}

export function isKycInReview(status: VerificationStatus | undefined): boolean {
  return status !== undefined && IN_REVIEW.includes(status);
}

export function isKycApproved(status: VerificationStatus | undefined): boolean {
  return status === "APPROVED";
}
