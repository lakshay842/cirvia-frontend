"use client";

import { Ticket } from "lucide-react";
import { LinkButton } from "@/components/core/link-button";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useBookingDetails, useBookingQr } from "@/hooks/useBookings";
import { formatEventDate } from "@/lib/utils";

export function QrTicketPage({ bookingId }: { bookingId: string }) {
  const { data: booking, isLoading: loadingBooking } = useBookingDetails(bookingId);
  const { data: qr, isLoading: loadingQr, isError, refetch } = useBookingQr(bookingId);

  if (loadingBooking || loadingQr) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <EventGridSkeleton count={1} />
        </Container>
      </div>
    );
  }

  if (isError || !booking || !qr) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <ErrorState title="Ticket unavailable" onRetry={() => refetch()} />
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-md">
        <div className="rounded-[28px] border border-border bg-surface/60 p-8 text-center backdrop-blur-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Ticket className="h-8 w-8 text-primary" aria-hidden />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">{booking.event.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{formatEventDate(booking.event.eventStart)}</p>
          <div className="mt-4 flex justify-center">
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="mt-6 font-mono text-sm text-muted-foreground">{booking.bookingReference}</p>

          <div className="mt-8 flex min-h-[180px] items-center justify-center rounded-[20px] border border-dashed border-border bg-background/50 p-6">
            {qr.qrCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr.qrCode} alt="Event ticket QR code" className="h-40 w-40" />
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">QR not generated yet</p>
                <p className="mt-2 text-xs text-muted-foreground">{qr.note}</p>
              </div>
            )}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Show this ticket at the venue. Booking ID: {bookingId.slice(0, 8)}…
          </p>

          <LinkButton href={ROUTES.booking(bookingId)} variant="outline" className="mt-6 w-full">
            Back to booking
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
