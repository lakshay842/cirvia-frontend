"use client";

import { MessageSquare } from "lucide-react";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useBookingDetails } from "@/hooks/useBookings";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";

const ELIGIBLE_STATUSES = ["COMPLETED", "APPROVED", "CONFIRMED"];

export function LeaveReviewPage({ bookingId }: { bookingId: string }) {
  const { data: booking, isLoading, isError } = useBookingDetails(bookingId);

  if (isLoading) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <EventGridSkeleton count={1} />
        </Container>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <ErrorState title="Booking not found" />
        </Container>
      </div>
    );
  }

  const eligible = ELIGIBLE_STATUSES.includes(booking.status);

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-lg">
        <div className="rounded-[24px] border border-border bg-surface/50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-7 w-7 text-primary" aria-hidden />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Leave a review</h1>
          <p className="mt-2 text-muted-foreground">{booking.event.title}</p>

          {!eligible ? (
            <p className="mt-6 text-sm text-warning">
              Reviews are available after your event is completed. Current status: {booking.status.replace(/_/g, " ").toLowerCase()}.
            </p>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              The reviews API (<code className="text-xs">POST /reviews/event</code>) is not deployed on the backend yet.
              Your booking is eligible — review submission will be enabled when the module ships.
            </p>
          )}

          <LinkButton href={ROUTES.booking(bookingId)} variant="outline" className="mt-8">
            Back to booking
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
