export interface WalletSummary {
  walletId: string;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  lifetimeWithdrawals: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string | null;
  description: string | null;
  paymentId: string | null;
  createdAt: string;
}

export interface WithdrawalItem {
  id: string;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt: string | null;
  transactionReference: string | null;
}

export interface BankAccount {
  id: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  accountNumberMasked: string;
  ifscCode: string;
  upiId: string | null;
  isPrimary: boolean;
  verificationStatus: string;
}

export interface WithdrawPayload {
  amount: number;
  bankAccountId: string;
}

export interface AddBankAccountPayload {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
  isPrimary?: boolean;
}
