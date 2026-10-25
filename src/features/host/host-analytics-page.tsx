"use client";

import { HostShell } from "@/components/host/host-shell";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { useHostAnalytics } from "@/hooks/useHost";
import { formatCurrency } from "@/lib/utils";

export function HostAnalyticsPage() {
  const { data: analytics, isLoading, isError, refetch } = useHostAnalytics();

  if (isLoading) {
    return (
      <HostShell title="Analytics">
        <EventGridSkeleton count={2} />
      </HostShell>
    );
  }

  if (isError || !analytics) {
    return (
      <HostShell title="Analytics">
        <ErrorState title="Could not load analytics" onRetry={() => refetch()} />
      </HostShell>
    );
  }

  const stats = [
    { label: "Total events", value: analytics.totalEvents },
    { label: "Completed events", value: analytics.completedEvents },
    { label: "Upcoming events", value: analytics.upcomingEvents },
    { label: "Total guests", value: analytics.totalGuests },
    { label: "Followers", value: analytics.followers },
    { label: "Total reviews", value: analytics.totalReviews },
    { label: "Avg. rating", value: analytics.averageRating.toFixed(1) },
    { label: "Response rate", value: `${analytics.responseRate}%` },
    { label: "Cancellation rate", value: `${analytics.cancellationRate}%` },
    { label: "Attendance", value: analytics.attendance },
    { label: "Earnings", value: formatCurrency(analytics.earnings) },
    { label: "Revenue (placeholder)", value: formatCurrency(analytics.revenuePlaceholder) },
  ];

  return (
    <HostShell title="Analytics">
      <p className="mb-6 text-sm text-muted-foreground">
        Performance overview from your host profile and analytics records.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[20px] border border-border bg-surface/50 p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </HostShell>
  );
}
