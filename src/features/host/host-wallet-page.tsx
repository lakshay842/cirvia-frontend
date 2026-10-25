"use client";

import { useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { LinkButton } from "@/components/core/link-button";
import { HostShell } from "@/components/host/host-shell";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { ROUTES } from "@/constants/routes";
import { useWalletSummary, useWalletTransactions, useWithdrawals } from "@/hooks/useWallet";
import { formatCurrency, formatEventDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "overview" | "transactions" | "withdrawals";

export function HostWalletPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { data: wallet, isError, isFetching, refetch } = useWalletSummary();
  const {
    data: transactions,
    isError: txError,
    isFetching: fetchingTx,
    refetch: refetchTx,
  } = useWalletTransactions();
  const {
    data: withdrawals,
    isError: wdError,
    isFetching: fetchingWd,
    refetch: refetchWd,
  } = useWithdrawals();

  // Still loading / auth hydrating — never treat as failure.
  if (!wallet && !isError) {
    return (
      <HostShell title="Wallet">
        <EventGridSkeleton count={2} />
      </HostShell>
    );
  }

  if (isError && !wallet) {
    return (
      <HostShell title="Wallet">
        <ErrorState title="Could not load wallet" onRetry={() => refetch()} />
      </HostShell>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "transactions", label: "History" },
    { id: "withdrawals", label: "Withdrawals" },
  ];

  const hasPending = !!wallet && wallet.pendingBalance > 0;

  return (
    <HostShell title="Wallet">
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.id ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && wallet && (
        <>
          <div
            className={cn(
              "mb-6 flex items-start gap-3 rounded-[24px] border p-5",
              hasPending
                ? "border-primary/25 bg-primary/5"
                : "border-border bg-surface/50",
            )}
            role="status"
          >
            <Info
              className={cn(
                "mt-0.5 h-5 w-5 shrink-0",
                hasPending ? "text-primary" : "text-muted-foreground",
              )}
              aria-hidden
            />
            <div>
              <p className="font-semibold text-foreground">How your balance works</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Guest payments first go to <span className="font-medium text-foreground">Pending</span>.
                After the event ends, that amount moves to{" "}
                <span className="font-medium text-foreground">Available</span>, which you can withdraw.
              </p>
              {hasPending && (
                <p className="mt-2 text-sm text-foreground">
                  You currently have {formatCurrency(wallet.pendingBalance, wallet.currency)} pending.
                  It will become available once the related event ends.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Available", value: formatCurrency(wallet.availableBalance, wallet.currency) },
              { label: "Pending", value: formatCurrency(wallet.pendingBalance, wallet.currency) },
              { label: "Lifetime earnings", value: formatCurrency(wallet.lifetimeEarnings, wallet.currency) },
              { label: "Total withdrawn", value: formatCurrency(wallet.lifetimeWithdrawals, wallet.currency) },
            ].map((item) => (
              <div key={item.label} className="rounded-[20px] border border-border bg-surface/50 p-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
          {isFetching && (
            <p className="mt-2 text-xs text-muted-foreground">Updating…</p>
          )}
          <LinkButton href={ROUTES.hostWithdraw} variant="gradient" className="mt-6">
            Request withdrawal
          </LinkButton>
        </>
      )}

      {tab === "transactions" && (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Wallet history</h2>
          {!transactions && !txError ? (
            <EventGridSkeleton count={2} />
          ) : txError && !transactions ? (
            <ErrorState title="Could not load history" onRetry={() => refetchTx()} />
          ) : !transactions?.length ? (
            <p className="mt-4 text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between rounded-[16px] border border-border bg-surface/40 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium capitalize">{tx.type.toLowerCase().replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground">{formatEventDate(tx.createdAt)}</p>
                    {tx.description && <p className="text-xs text-muted-foreground">{tx.description}</p>}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">
                      {formatCurrency(tx.amount, wallet?.currency ?? "INR")}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Bal: {formatCurrency(tx.balanceAfter, wallet?.currency ?? "INR")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {fetchingTx && transactions ? (
            <p className="mt-2 text-xs text-muted-foreground">Updating…</p>
          ) : null}
        </div>
      )}

      {tab === "withdrawals" && (
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Withdrawal requests</h2>
            <Link href={ROUTES.hostWithdraw} className="text-sm text-primary hover:underline">
              New request →
            </Link>
          </div>
          {!withdrawals && !wdError ? (
            <EventGridSkeleton count={2} />
          ) : wdError && !withdrawals ? (
            <ErrorState title="Could not load withdrawals" onRetry={() => refetchWd()} />
          ) : !withdrawals?.length ? (
            <p className="mt-4 text-sm text-muted-foreground">No withdrawal requests yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {withdrawals.map((w) => (
                <li
                  key={w.id}
                  className="flex items-center justify-between rounded-[16px] border border-border bg-surface/40 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">
                      {formatCurrency(w.amount, wallet?.currency ?? "INR")}
                    </p>
                    <p className="text-xs text-muted-foreground">Requested {formatEventDate(w.requestedAt)}</p>
                    {w.transactionReference && (
                      <p className="font-mono text-xs text-muted-foreground">{w.transactionReference}</p>
                    )}
                  </div>
                  <span className="capitalize text-muted-foreground">{w.status.toLowerCase()}</span>
                </li>
              ))}
            </ul>
          )}
          {fetchingWd && withdrawals ? (
            <p className="mt-2 text-xs text-muted-foreground">Updating…</p>
          ) : null}
        </div>
      )}
    </HostShell>
  );
}
