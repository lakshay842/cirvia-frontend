"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const reason = searchParams.get("reason");

  return (
    <Container className="max-w-lg py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/15">
        <XCircle className="h-8 w-8 text-danger" aria-hidden />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-foreground">Payment failed</h1>
      <p className="mt-2 text-muted-foreground">
        {reason ?? "We could not process your payment. Please try again."}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {bookingId && (
          <LinkButton href={`${ROUTES.bookingPayment(bookingId)}?retry=1`} variant="gradient">
            Try again
          </LinkButton>
        )}
        <LinkButton href={ROUTES.bookings} variant="outline">
          My bookings
        </LinkButton>
      </div>
    </Container>
  );
}

export function PaymentFailedPage() {
  return (
    <div className="pt-24">
      <Suspense>
        <PaymentFailedContent />
      </Suspense>
    </div>
  );
}
