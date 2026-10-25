"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { HostShell } from "@/components/host/host-shell";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { ROUTES } from "@/constants/routes";
import {
  useAddBankAccount,
  useBankAccounts,
  useRequestWithdrawal,
  useWalletSummary,
  useWithdrawals,
} from "@/hooks/useWallet";
import { formatCurrency, formatEventDate } from "@/lib/utils";
import { ApiClientError } from "@/types/api.types";

type BankField = "accountHolderName" | "bankName" | "accountNumber" | "ifscCode" | "upiId";

const BANK_FIELDS: {
  key: BankField;
  label: string;
  hint: string;
  required?: boolean;
  placeholder?: string;
}[] = [
  {
    key: "accountHolderName",
    label: "Account holder name",
    hint: "At least 2 characters",
    required: true,
    placeholder: "As on your bank passbook",
  },
  {
    key: "bankName",
    label: "Bank name",
    hint: "At least 2 characters",
    required: true,
    placeholder: "e.g. HDFC Bank",
  },
  {
    key: "accountNumber",
    label: "Account number",
    hint: "8–20 digits only",
    required: true,
    placeholder: "123456789012",
  },
  {
    key: "ifscCode",
    label: "IFSC code",
    hint: "11 characters, e.g. HDFC0001234",
    required: true,
    placeholder: "HDFC0001234",
  },
  {
    key: "upiId",
    label: "UPI ID (optional)",
    hint: "Optional",
    placeholder: "name@upi",
  },
];

function validateBankForm(form: Record<BankField, string>): Partial<Record<BankField, string>> {
  const errors: Partial<Record<BankField, string>> = {};

  if (form.accountHolderName.trim().length < 2) {
    errors.accountHolderName = "Account holder name must be at least 2 characters";
  }
  if (form.bankName.trim().length < 2) {
    errors.bankName = "Bank name must be at least 2 characters";
  }
  const account = form.accountNumber.replace(/\s/g, "");
  if (account.length < 8) {
    errors.accountNumber = "Account number must be at least 8 digits";
  } else if (account.length > 20) {
    errors.accountNumber = "Account number must be at most 20 digits";
  } else if (!/^[0-9]+$/.test(account)) {
    errors.accountNumber = "Account number must contain digits only";
  }
  const ifsc = form.ifscCode.trim().toUpperCase();
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
    errors.ifscCode = "IFSC must be 11 characters like HDFC0001234";
  }
  if (form.upiId.trim().length > 50) {
    errors.upiId = "UPI ID must be at most 50 characters";
  }

  return errors;
}

export function HostWithdrawPage() {
  const router = useRouter();
  const { data: wallet, isError, refetch } = useWalletSummary();
  const { data: accounts } = useBankAccounts();
  const { data: withdrawals } = useWithdrawals();
  const requestWithdrawal = useRequestWithdrawal();
  const addBankAccount = useAddBankAccount();

  const [amount, setAmount] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");
  const [showAddBank, setShowAddBank] = useState(false);
  const [bankForm, setBankForm] = useState<Record<BankField, string>>({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<BankField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const apiFieldErrors = useMemo(() => {
    const err = addBankAccount.error as ApiClientError | null;
    if (!err?.fieldErrors?.length) return {} as Partial<Record<BankField, string>>;
    const mapped: Partial<Record<BankField, string>> = {};
    for (const item of err.fieldErrors) {
      const key = item.field as BankField;
      if (key in bankForm) mapped[key] = item.message;
    }
    return mapped;
  }, [addBankAccount.error, bankForm]);

  const displayErrors = { ...apiFieldErrors, ...fieldErrors };

  if (!wallet && !isError) {
    return (
      <HostShell title="Withdraw">
        <EventGridSkeleton count={2} />
      </HostShell>
    );
  }

  if (isError || !wallet) {
    return (
      <HostShell title="Withdraw">
        <ErrorState title="Could not load wallet" onRetry={() => refetch()} />
      </HostShell>
    );
  }

  return (
    <HostShell title="Withdraw">
      <p
        className={
          wallet.pendingBalance > 0 && wallet.availableBalance <= 0
            ? "mb-2 text-sm text-muted-foreground"
            : "mb-6 text-sm text-muted-foreground"
        }
      >
        Available balance: {formatCurrency(wallet.availableBalance, wallet.currency)}
      </p>
      {wallet.pendingBalance > 0 && wallet.availableBalance <= 0 && (
        <p
          className="mb-6 rounded-[18px] border border-primary/25 bg-primary/5 p-3 text-sm text-muted-foreground"
          role="status"
        >
          You have {formatCurrency(wallet.pendingBalance, wallet.currency)} in Pending. It moves to
          Available after the event ends — only Available balance can be withdrawn.
        </p>
      )}

      {(requestWithdrawal.error as ApiClientError | null) && (
        <p className="mb-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {(requestWithdrawal.error as ApiClientError).message}
        </p>
      )}

      <div className="rounded-[24px] border border-border bg-surface/50 p-6">
        <h2 className="font-semibold text-foreground">Request withdrawal</h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({wallet.currency})</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankAccount">Bank account</Label>
            <select
              id="bankAccount"
              className="flex h-12 w-full rounded-[18px] border border-border bg-surface/50 px-4 text-sm"
              value={bankAccountId}
              onChange={(e) => setBankAccountId(e.target.value)}
            >
              <option value="">Select account</option>
              {accounts?.map((a) => (
                <option key={a.id} value={a.id} disabled={a.verificationStatus !== "APPROVED"}>
                  {a.bankName} · {a.accountNumberMasked}
                  {a.verificationStatus === "APPROVED"
                    ? " · Verified"
                    : a.verificationStatus === "REJECTED"
                      ? " · Rejected"
                      : " · Pending verification"}
                </option>
              ))}
            </select>
            {accounts?.some((a) => a.verificationStatus !== "APPROVED") && (
              <p className="text-xs text-muted-foreground">
                New bank accounts stay pending until Cirvia admin verifies them in Admin → Wallet.
              </p>
            )}
          </div>
          <Button
            variant="gradient"
            disabled={!amount || !bankAccountId || requestWithdrawal.isPending}
            onClick={async () => {
              try {
                await requestWithdrawal.mutateAsync({
                  amount: Number(amount),
                  bankAccountId,
                });
                setAmount("");
                router.push(ROUTES.hostWallet);
              } catch {
                // shown via requestWithdrawal.error
              }
            }}
          >
            Submit withdrawal
          </Button>
        </div>
      </div>

      <div className="mt-8 rounded-[24px] border border-border bg-surface/50 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Bank accounts</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddBank(!showAddBank);
              setFieldErrors({});
              setFormError(null);
              addBankAccount.reset();
            }}
          >
            {showAddBank ? "Cancel" : "Add account"}
          </Button>
        </div>

        {showAddBank && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {formError && (
              <p
                className="sm:col-span-2 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
                role="alert"
              >
                {formError}
              </p>
            )}
            {BANK_FIELDS.map((field) => (
              <div key={field.key} className="space-y-1">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required ? " *" : ""}
                </Label>
                <Input
                  id={field.key}
                  value={bankForm[field.key]}
                  placeholder={field.placeholder}
                  error={displayErrors[field.key]}
                  autoCapitalize={field.key === "ifscCode" ? "characters" : undefined}
                  onChange={(e) => {
                    const value =
                      field.key === "ifscCode" ? e.target.value.toUpperCase() : e.target.value;
                    setBankForm((f) => ({ ...f, [field.key]: value }));
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next[field.key];
                      return next;
                    });
                    setFormError(null);
                  }}
                />
                {!displayErrors[field.key] && (
                  <p className="text-xs text-muted-foreground">{field.hint}</p>
                )}
              </div>
            ))}
            <Button
              className="sm:col-span-2"
              variant="secondary"
              loading={addBankAccount.isPending}
              onClick={async () => {
                const localErrors = validateBankForm(bankForm);
                if (Object.keys(localErrors).length > 0) {
                  setFieldErrors(localErrors);
                  setFormError("Please fix the highlighted fields before saving.");
                  return;
                }

                setFieldErrors({});
                setFormError(null);

                try {
                  await addBankAccount.mutateAsync({
                    accountHolderName: bankForm.accountHolderName.trim(),
                    bankName: bankForm.bankName.trim(),
                    accountNumber: bankForm.accountNumber.replace(/\s/g, ""),
                    ifscCode: bankForm.ifscCode.trim().toUpperCase(),
                    ...(bankForm.upiId.trim() && { upiId: bankForm.upiId.trim() }),
                    isPrimary: !accounts?.length,
                  });
                  setBankForm({
                    accountHolderName: "",
                    bankName: "",
                    accountNumber: "",
                    ifscCode: "",
                    upiId: "",
                  });
                  setShowAddBank(false);
                } catch (err) {
                  const apiErr = err as ApiClientError;
                  setFormError(apiErr.message || "Could not save bank account.");
                }
              }}
            >
              Save bank account
            </Button>
          </div>
        )}

        <ul className="mt-4 space-y-3">
          {accounts?.map((a) => (
            <li key={a.id} className="rounded-[16px] border border-border px-4 py-3 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <p className="font-medium text-foreground">{a.accountHolderName}</p>
                    <p className="text-xs text-muted-foreground">{a.bankName}</p>
                  </div>
                  <dl className="grid gap-1.5 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-muted-foreground">Account number</dt>
                      <dd className="font-mono text-foreground tracking-wide">
                        {a.accountNumber ?? a.accountNumberMasked}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">IFSC</dt>
                      <dd className="font-mono text-foreground">{a.ifscCode}</dd>
                    </div>
                    {a.upiId && (
                      <div>
                        <dt className="text-xs text-muted-foreground">UPI</dt>
                        <dd className="text-foreground">{a.upiId}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs text-muted-foreground">Primary</dt>
                      <dd className="text-foreground">{a.isPrimary ? "Yes" : "No"}</dd>
                    </div>
                  </dl>
                </div>
                <span
                  className={
                    a.verificationStatus === "APPROVED"
                      ? "rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
                      : a.verificationStatus === "REJECTED"
                        ? "rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger"
                        : "rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning"
                  }
                >
                  {a.verificationStatus === "APPROVED"
                    ? "Verified"
                    : a.verificationStatus === "REJECTED"
                      ? "Rejected"
                      : "Pending verification"}
                </span>
              </div>
            </li>
          ))}
          {!accounts?.length && <p className="text-sm text-muted-foreground">No bank accounts added.</p>}
        </ul>
      </div>

      {withdrawals && withdrawals.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Withdrawal history</h2>
          <ul className="mt-4 space-y-2">
            {withdrawals.map((w) => (
              <li
                key={w.id}
                className="flex justify-between rounded-[16px] border border-border bg-surface/40 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{formatCurrency(w.amount, wallet.currency)}</p>
                  <p className="text-xs text-muted-foreground">{formatEventDate(w.requestedAt)}</p>
                </div>
                <span className="capitalize text-muted-foreground">{w.status.toLowerCase()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </HostShell>
  );
}
