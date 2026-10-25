"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, XCircle } from "lucide-react";
import { Button } from "@/components/core/button";
import { LinkButton } from "@/components/core/link-button";
import { Textarea } from "@/components/core/textarea";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import {
  useBookingDetails,
  useBookingStatus,
  useBookingTimeline,
  useCancelBooking,
} from "@/hooks/useBookings";
import { formatEventDate, formatPrice } from "@/lib/utils";
import { ApiClientError } from "@/types/api.types";

const CANCELLABLE = ["REQUESTED", "PENDING", "PENDING_PAYMENT", "CONFIRMED", "APPROVED"];

export function BookingDetailPage({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const { data: booking, isLoading, isError, refetch } = useBookingDetails(bookingId);
  const { data: status } = useBookingStatus(bookingId, booking?.status === "PENDING_PAYMENT");
  const { data: timeline } = useBookingTimeline(bookingId);
  const cancelBooking = useCancelBooking();
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState("");

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
          <ErrorState title="Booking not found" onRetry={() => refetch()} />
        </Container>
      </div>
    );
  }

  const canCancel = CANCELLABLE.includes(booking.status);
  const needsPayment = booking.status === "PENDING_PAYMENT";
  const canShowTicket = booking.status === "CONFIRMED" || booking.status === "APPROVED";

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{booking.event.title}</h1>
            <p className="mt-2 text-muted-foreground">{formatEventDate(booking.event.eventStart)}</p>
            <p className="mt-1 text-sm text-muted-foreground">Reference: {booking.bookingReference}</p>
          </div>
          <BookingStatusBadge status={status?.status ?? booking.status} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[20px] border border-border bg-surface/50 p-4">
            <p className="text-xs text-muted-foreground">Guests</p>
            <p className="text-lg font-semibold">{booking.guestsCount}</p>
          </div>
          <div className="rounded-[20px] border border-border bg-surface/50 p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold text-primary">
              {formatPrice(booking.ticketPrice, booking.currency)}
            </p>
          </div>
          <div className="rounded-[20px] border border-border bg-surface/50 p-4">
            <p className="text-xs text-muted-foreground">Payment</p>
            <p className="text-lg font-semibold capitalize">{booking.paymentStatus.toLowerCase()}</p>
          </div>
          <div className="rounded-[20px] border border-border bg-surface/50 p-4">
            <p className="text-xs text-muted-foreground">Host</p>
            <p className="text-lg font-semibold">{booking.host.displayName}</p>
          </div>
        </div>

        {booking.expiresAt && needsPayment && (
          <p className="mt-4 text-sm text-warning">
            Payment due before {formatEventDate(booking.expiresAt)}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {needsPayment && (
            <LinkButton href={ROUTES.bookingPayment(bookingId)} variant="gradient">
              Pay now
            </LinkButton>
          )}
          {canShowTicket && (
            <LinkButton href={ROUTES.bookingTicket(bookingId)} variant="outline">
              <QrCode className="h-4 w-4" aria-hidden />
              View ticket
            </LinkButton>
          )}
          {(booking.status === "COMPLETED" || booking.status === "CONFIRMED") && (
            <LinkButton href={ROUTES.bookingReview(bookingId)} variant="outline">
              Leave review
            </LinkButton>
          )}
          <LinkButton href={ROUTES.event(booking.event.slug)} variant="ghost">
            View event
          </LinkButton>
          {canCancel && (
            <Button variant="outline" onClick={() => setShowCancel(true)}>
              <XCircle className="h-4 w-4" aria-hidden />
              Cancel booking
            </Button>
          )}
        </div>

        {showCancel && (
          <div className="mt-6 rounded-[24px] border border-danger/30 bg-danger/5 p-6">
            <h2 className="font-semibold text-foreground">Cancel booking</h2>
            {(cancelBooking.error as ApiClientError | null) && (
              <p className="mt-2 text-sm text-danger">{(cancelBooking.error as ApiClientError).message}</p>
            )}
            <Textarea
              className="mt-3"
              placeholder="Reason for cancellation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
            <div className="mt-4 flex gap-3">
              <Button
                variant="danger"
                disabled={!reason.trim() || cancelBooking.isPending}
                onClick={async () => {
                  await cancelBooking.mutateAsync({ bookingId, reason: reason.trim() });
                  setShowCancel(false);
                  router.refresh();
                }}
              >
                Confirm cancel
              </Button>
              <Button variant="ghost" onClick={() => setShowCancel(false)}>
                Keep booking
              </Button>
            </div>
          </div>
        )}

        {timeline && timeline.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
            <ol className="mt-4 space-y-3">
              {timeline.map((item) => (
                <li key={item.id} className="rounded-[16px] border border-border bg-surface/40 px-4 py-3 text-sm">
                  <span className="font-medium capitalize">{item.action.replace(/_/g, " ").toLowerCase()}</span>
                  <span className="ml-2 text-muted-foreground">{formatEventDate(item.createdAt)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Container>
    </div>
  );
}
