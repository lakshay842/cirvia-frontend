"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <Container className="max-w-lg py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
        <CheckCircle2 className="h-8 w-8 text-success" aria-hidden />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-foreground">Payment successful</h1>
      <p className="mt-2 text-muted-foreground">Your booking is confirmed. See you at the event!</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {bookingId && (
          <>
            <LinkButton href={ROUTES.booking(bookingId)} variant="gradient">
              View booking
            </LinkButton>
            <LinkButton href={ROUTES.bookingTicket(bookingId)} variant="outline">
              View ticket
            </LinkButton>
          </>
        )}
        <LinkButton href={ROUTES.bookings} variant="ghost">
          All bookings
        </LinkButton>
      </div>
    </Container>
  );
}

export function PaymentSuccessPage() {
  return (
    <div className="pt-24">
      <Suspense>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
