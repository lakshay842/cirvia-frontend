"use client";

import Link from "next/link";
import { useState } from "react";
import { LinkButton } from "@/components/core/link-button";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useBookings } from "@/hooks/useBookings";
import { formatEventDate, formatPrice } from "@/lib/utils";
import type { BookingFilter } from "@/types/booking.types";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: BookingFilter }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Pending", value: "pending" },
  { label: "Past", value: "past" },
  { label: "Cancelled", value: "cancelled" },
];

export function BookingsListPage() {
  const [filter, setFilter] = useState<BookingFilter>("upcoming");
  const { data: bookings, isLoading, isError, refetch } = useBookings(filter);

  return (
    <div className="pt-24 pb-16">
      <Container>
        <h1 className="text-3xl font-bold text-foreground">My bookings</h1>
        <p className="mt-2 text-muted-foreground">Manage your event reservations and tickets.</p>

        <div className="mt-6 flex flex-wrap gap-2">
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

        <div className="mt-8">
          {isLoading && <EventGridSkeleton count={3} />}
          {isError && <ErrorState title="Could not load bookings" onRetry={() => refetch()} />}
          {!isLoading && !isError && bookings?.length === 0 && (
            <>
              <EmptyState
                title="No bookings yet"
                description="Discover events and book your first gathering."
              />
              <div className="mt-4 flex justify-center">
                <LinkButton href={ROUTES.discover}>Browse events</LinkButton>
              </div>
            </>
          )}
          <ul className="space-y-4">
            {bookings?.map((booking) => (
              <li key={booking.bookingId}>
                <Link
                  href={ROUTES.booking(booking.bookingId)}
                  className="block rounded-[24px] border border-border bg-surface/50 p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-foreground">{booking.event.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatEventDate(booking.event.eventStart)}
                        {booking.event.city ? ` · ${booking.event.city}` : ""}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">Ref: {booking.bookingReference}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <BookingStatusBadge status={booking.status} />
                      <span className="font-semibold text-primary">
                        {formatPrice(booking.ticketPrice, booking.currency)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
