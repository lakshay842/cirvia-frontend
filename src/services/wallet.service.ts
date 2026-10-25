import { del, get, patch, post } from "@/lib/api";
import type {
  AddBankAccountPayload,
  BankAccount,
  WalletSummary,
  WalletTransaction,
  WithdrawalItem,
  WithdrawPayload,
} from "@/types/wallet.types";
import type { ApiMeta } from "@/types/api.types";

export const walletService = {
  getSummary: () => get<WalletSummary>("/wallet"),

  getTransactions: (params?: { page?: number; limit?: number }) =>
    get<{ transactions: WalletTransaction[]; meta?: ApiMeta }>(
      "/wallet/transactions",
      params as Record<string, unknown>,
    ),

  getWithdrawals: (params?: { page?: number; limit?: number }) =>
    get<{ withdrawals: WithdrawalItem[]; meta?: ApiMeta }>(
      "/wallet/withdrawals",
      params as Record<string, unknown>,
    ),

  withdraw: (body: WithdrawPayload) =>
    post<{ withdrawal: WithdrawalItem }>("/wallet/withdraw", body),

  listBankAccounts: () =>
    get<{ accounts: BankAccount[] }>("/wallet/bank-accounts"),

  addBankAccount: (body: AddBankAccountPayload) =>
    post<{ account: BankAccount }>("/wallet/bank-accounts", body),

  updateBankAccount: (id: string, body: Partial<AddBankAccountPayload>) =>
    patch<{ account: BankAccount }>(`/wallet/bank-accounts/${id}`, body),

  deleteBankAccount: (id: string) =>
    del<Record<string, never>>(`/wallet/bank-accounts/${id}`),
};
