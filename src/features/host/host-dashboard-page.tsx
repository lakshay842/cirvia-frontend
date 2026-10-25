"use client";

import { useState } from "react";
import { LinkButton } from "@/components/core/link-button";
import { Button } from "@/components/core/button";
import { HostShell } from "@/components/host/host-shell";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { ROUTES } from "@/constants/routes";
import { useHostBookings, useApproveHostBooking, useRejectHostBooking } from "@/hooks/useHostBookings";
import { useHostDashboard } from "@/hooks/useHost";
import { useWalletSummary } from "@/hooks/useWallet";
import { formatCurrency, formatEventDate } from "@/lib/utils";

export function HostDashboardPage() {
  const { data: dashboard, isLoading, isError, refetch } = useHostDashboard();
  const { data: wallet } = useWalletSummary();
  const { data: pendingBookings } = useHostBookings("pending");
  const approveBooking = useApproveHostBooking();
  const rejectBooking = useRejectHostBooking();
  const [rejectId, setRejectId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <HostShell title="Dashboard">
        <EventGridSkeleton count={2} />
      </HostShell>
    );
  }

  if (isError || !dashboard) {
    return (
      <HostShell title="Dashboard">
        <ErrorState title="Could not load dashboard" onRetry={() => refetch()} />
      </HostShell>
    );
  }

  const { statistics } = dashboard;

  return (
    <HostShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total events", value: statistics.totalEvents },
          { label: "Upcoming", value: statistics.upcomingEvents },
          { label: "Total guests", value: statistics.totalGuests },
          { label: "Avg. rating", value: statistics.averageRating.toFixed(1) },
          { label: "Reviews", value: statistics.totalReviews },
          { label: "Response rate", value: `${statistics.responseRate}%` },
          {
            label: "Revenue (placeholder)",
            value: formatCurrency(statistics.revenuePlaceholder),
          },
          {
            label: "Available balance",
            value: wallet ? formatCurrency(wallet.availableBalance, wallet.currency) : "—",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[20px] border border-border bg-surface/50 p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {pendingBookings && pendingBookings.length > 0 && (
        <div className="mt-8 rounded-[24px] border border-warning/30 bg-warning/5 p-6">
          <h2 className="font-semibold text-foreground">
            Pending booking requests ({pendingBookings.length})
          </h2>
          <ul className="mt-4 space-y-3">
            {pendingBookings.map((b) => (
              <li
                key={b.bookingId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-border bg-background/50 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{b.event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.guestsCount} guest{b.guestsCount !== 1 ? "s" : ""} · {b.bookingReference}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <BookingStatusBadge status={b.status} />
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={approveBooking.isPending}
                    onClick={() => approveBooking.mutate(b.bookingId)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRejectId(rejectId === b.bookingId ? null : b.bookingId)}
                  >
                    Reject
                  </Button>
                </div>
                {rejectId === b.bookingId && (
                  <div className="w-full pt-2">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        void rejectBooking.mutateAsync({
                          bookingId: b.bookingId,
                          reason: "Host declined this booking request",
                        });
                        setRejectId(null);
                      }}
                    >
                      Confirm reject
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {dashboard.pendingTasks.length > 0 && (
        <div className="mt-8 rounded-[24px] border border-border bg-surface/50 p-6">
          <h2 className="font-semibold text-foreground">Pending tasks</h2>
          <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
            {dashboard.pendingTasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton href={ROUTES.hostBookings} variant="gradient">
          View bookings
        </LinkButton>
        <LinkButton href={ROUTES.hostEvents} variant="outline">
          Manage events
        </LinkButton>
        <LinkButton href={ROUTES.hostWallet} variant="outline">
          Wallet & history
        </LinkButton>
        <LinkButton href={ROUTES.hostWithdraw} variant="outline">
          Withdrawal requests
        </LinkButton>
      </div>

      {dashboard.recentActivity.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">Recent activity</h2>
          <ul className="mt-4 space-y-2">
            {dashboard.recentActivity.map((item) => (
              <li key={item.id} className="rounded-[16px] border border-border bg-surface/40 px-4 py-3 text-sm">
                <span className="font-medium capitalize">
                  {item.activityType.replace(/_/g, " ").toLowerCase()}
                </span>
                <span className="ml-2 text-muted-foreground">{formatEventDate(item.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </HostShell>
  );
}
