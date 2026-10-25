import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { walletService } from "@/services/wallet.service";
import type { AddBankAccountPayload, WithdrawPayload } from "@/types/wallet.types";
import { useAuthStore } from "@/stores/auth-store";

function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useAuthStore.persist;
    if (!persist) {
      setHydrated(true);
      return;
    }
    if (persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}

export function useWalletSummary() {
  const hydrated = useAuthHydrated();
  const isHost = useAuthStore((s) => s.hasRole("HOST"));

  return useQuery({
    queryKey: QUERY_KEYS.wallet.summary,
    queryFn: async () => walletService.getSummary().then((r) => r.data),
    enabled: hydrated && isHost,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useWalletTransactions() {
  const hydrated = useAuthHydrated();
  const isHost = useAuthStore((s) => s.hasRole("HOST"));

  return useQuery({
    queryKey: QUERY_KEYS.wallet.transactions(),
    queryFn: async () => {
      const res = await walletService.getTransactions({ limit: 20 });
      return res.data.transactions;
    },
    enabled: hydrated && isHost,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useWithdrawals() {
  const hydrated = useAuthHydrated();
  const isHost = useAuthStore((s) => s.hasRole("HOST"));

  return useQuery({
    queryKey: QUERY_KEYS.wallet.withdrawals(),
    queryFn: async () => {
      const res = await walletService.getWithdrawals({ limit: 20 });
      return res.data.withdrawals;
    },
    enabled: hydrated && isHost,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useBankAccounts() {
  const hydrated = useAuthHydrated();
  const isHost = useAuthStore((s) => s.hasRole("HOST"));

  return useQuery({
    queryKey: QUERY_KEYS.wallet.bankAccounts,
    queryFn: async () => {
      const res = await walletService.listBankAccounts();
      return res.data.accounts;
    },
    enabled: hydrated && isHost,
  });
}

export function useRequestWithdrawal() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: WithdrawPayload) => walletService.withdraw(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.wallet.summary });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.wallet.withdrawals() });
    },
  });
}

export function useAddBankAccount() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: AddBankAccountPayload) => walletService.addBankAccount(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.wallet.bankAccounts });
    },
  });
}
