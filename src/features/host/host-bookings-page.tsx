"use client";

import { useState } from "react";
import { BadgeCheck, Mail, Phone, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/core/button";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { HostShell } from "@/components/host/host-shell";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import {
  useApproveHostBooking,
  useHostBookings,
  useRejectHostBooking,
} from "@/hooks/useHostBookings";
import { formatEventDate, formatPrice, cn } from "@/lib/utils";
import type { HostBookingSummary } from "@/types/booking.types";

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Rejected", value: "rejected" },
];

function guestName(booking: HostBookingSummary) {
  const { firstName, lastName, email } = booking.guest;
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  return name || email;
}

function GuestVerificationBadges({ guest }: { guest: HostBookingSummary["guest"] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
          guest.emailVerified
            ? "bg-success/10 text-success"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Mail className="h-3 w-3" aria-hidden />
        Email {guest.emailVerified ? "verified" : "unverified"}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
          guest.phoneVerified
            ? "bg-success/10 text-success"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Phone className="h-3 w-3" aria-hidden />
        Phone {guest.phoneVerified ? "verified" : "unverified"}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
          guest.isVerifiedHost
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        {guest.isVerifiedHost ? (
          <BadgeCheck className="h-3 w-3" aria-hidden />
        ) : (
          <ShieldAlert className="h-3 w-3" aria-hidden />
        )}
        {guest.isVerifiedHost ? "Verified host" : "Not a verified host"}
      </span>
    </div>
  );
}

export function HostBookingsPage() {
  const [filter, setFilter] = useState("all");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const { data: bookings, isLoading, isError, isFetching, refetch } = useHostBookings(
    filter === "all" ? undefined : filter,
  );
  const approveBooking = useApproveHostBooking();
  const rejectBooking = useRejectHostBooking();

  return (
    <HostShell title="Bookings">
      <p className="mb-6 text-sm text-muted-foreground">
        See who booked your events, verification status, and manage pending requests.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!bookings && !isError ? (
        <EventGridSkeleton count={3} />
      ) : isError && !bookings ? (
        <ErrorState title="Could not load bookings" onRetry={() => refetch()} />
      ) : !bookings?.length ? (
        <EmptyState
          title="No bookings yet"
          description="When guests book your events, they’ll show up here."
        />
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => {
            const canManage = booking.status === "REQUESTED" || booking.status === "PENDING";
            return (
              <li
                key={booking.bookingId}
                className="rounded-[20px] border border-border bg-surface/50 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-foreground">{guestName(booking)}</h2>
                      {booking.guest.isVerifiedHost && (
                        <ShieldCheck className="h-4 w-4 text-primary" aria-label="Verified host" />
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{booking.guest.email}</p>
                    <p className="mt-2 text-sm text-foreground">
                      {booking.event.title}
                      <span className="text-muted-foreground">
                        {" "}
                        · {formatEventDate(booking.event.eventStart)}
                        {booking.event.city ? ` · ${booking.event.city}` : ""}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {booking.guestsCount} guest{booking.guestsCount !== 1 ? "s" : ""} · Ref:{" "}
                      {booking.bookingReference}
                    </p>
                    <GuestVerificationBadges guest={booking.guest} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <BookingStatusBadge status={booking.status} />
                    <span className="font-semibold text-primary">
                      {formatPrice(booking.ticketPrice, booking.currency)}
                    </span>
                    {canManage && (
                      <div className="mt-1 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={approveBooking.isPending}
                          onClick={() => approveBooking.mutate(booking.bookingId)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setRejectId(rejectId === booking.bookingId ? null : booking.bookingId)
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {rejectId === booking.bookingId && (
                  <div className="mt-3 border-t border-border pt-3">
                    <Button
                      size="sm"
                      variant="danger"
                      loading={rejectBooking.isPending}
                      onClick={() => {
                        void rejectBooking.mutateAsync({
                          bookingId: booking.bookingId,
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
            );
          })}
        </ul>
      )}

      {isFetching && bookings ? (
        <p className="mt-3 text-xs text-muted-foreground">Updating…</p>
      ) : null}
    </HostShell>
  );
}
