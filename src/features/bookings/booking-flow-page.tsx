"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useCreateBooking, useEventIdResolver } from "@/hooks/useBookings";
import { useEventDetail } from "@/hooks/useEvents";
import { registerEventId } from "@/lib/event-id-registry";
import { formatEventDate, formatPrice } from "@/lib/utils";
import { ApiClientError } from "@/types/api.types";

function BookingFlowContent({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: event, isLoading, isError } = useEventDetail(slug);
  const { eventId: fallbackEventId, isResolving } = useEventIdResolver(slug);
  const createBooking = useCreateBooking();
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState("");

  const resolvedEventId = event?.eventId ?? event?.id ?? fallbackEventId;

  useEffect(() => {
    if (resolvedEventId) {
      registerEventId(slug, resolvedEventId);
    }
  }, [slug, resolvedEventId]);

  if (isLoading || isResolving) {
    return (
      <Container className="py-8">
        <EventGridSkeleton count={1} />
      </Container>
    );
  }

  if (isError || !event) {
    return (
      <Container className="py-8">
        <ErrorState title="Event not found" />
      </Container>
    );
  }

  if (!resolvedEventId) {
    return (
      <Container className="max-w-lg py-8">
        <div className="rounded-[24px] border border-border bg-surface/50 p-6">
          <h1 className="text-xl font-semibold text-foreground">Booking unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We could not resolve the event identifier required to create a booking. Please return
            to the event page and try again.
          </p>
        </div>
      </Container>
    );
  }

  const spotsLeft = event.availability?.remaining ?? event.remainingCapacity;

  const total = event.price * quantity;

  return (
    <Container className="max-w-lg py-8">
      <h1 className="text-2xl font-bold text-foreground">Book your spot</h1>
      <p className="mt-1 text-muted-foreground">{event.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{formatEventDate(event.eventStart)}</p>

      {(createBooking.error as ApiClientError | null) && (
        <p className="mt-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {(createBooking.error as ApiClientError).message}
        </p>
      )}

      <div className="mt-8 space-y-6 rounded-[24px] border border-border bg-surface/50 p-6">
        <div>
          <Label>Tickets</Label>
          <div className="mt-2 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQuantity((q) => Math.min(spotsLeft, q + 1))}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{spotsLeft} spots left</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon">Coupon code (optional)</Label>
          <Input id="coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="SAVE10" />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-primary">{formatPrice(total, event.currency)}</span>
        </div>

        <Button
          variant="gradient"
          className="w-full"
          disabled={createBooking.isPending}
          onClick={async () => {
            registerEventId(slug, resolvedEventId);
            const res = await createBooking.mutateAsync({
              eventId: resolvedEventId,
              ticketQuantity: quantity,
              ...(coupon.trim() && { couponCode: coupon.trim() }),
            });
            const bookingId = res.data.bookingId;
            const needsPayment =
              res.data.status === "PENDING_PAYMENT" ||
              (event.price > 0 && res.data.status !== "CONFIRMED" && res.data.status !== "APPROVED");
            if (needsPayment) {
              router.push(ROUTES.bookingPayment(bookingId));
            } else {
              router.push(ROUTES.booking(bookingId));
            }
          }}
        >
          {createBooking.isPending ? "Creating booking…" : "Confirm booking"}
        </Button>
      </div>
    </Container>
  );
}

export function BookingFlowPage({ slug }: { slug: string }) {
  return (
    <div className="pt-20">
      <Suspense>
        <BookingFlowContent slug={slug} />
      </Suspense>
    </div>
  );
}
