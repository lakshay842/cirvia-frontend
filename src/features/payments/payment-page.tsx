"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/core/button";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { useBookingDetails } from "@/hooks/useBookings";
import { useCreatePaymentOrder, useVerifyPayment } from "@/hooks/usePayments";
import { formatCurrency } from "@/lib/utils";
import { ApiClientError } from "@/types/api.types";
import type { PaymentOrder } from "@/types/payment.types";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export function PaymentPage({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: booking, isLoading } = useBookingDetails(bookingId);
  const createOrder = useCreatePaymentOrder();
  const verifyPayment = useVerifyPayment();
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const orderRequested = useRef(false);

  useEffect(() => {
    if (!booking || booking.status !== "PENDING_PAYMENT") return;
    if (order || orderRequested.current) return;

    orderRequested.current = true;
    void createOrder
      .mutateAsync(bookingId)
      .then((res) => setOrder(res.data))
      .catch((err: ApiClientError) => setError(err.message));
  }, [booking, bookingId, createOrder, order]);

  if (isLoading || (!order && !error)) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <EventGridSkeleton count={1} />
        </Container>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <ErrorState title="Booking not found" />
        </Container>
      </div>
    );
  }

  if (booking.status !== "PENDING_PAYMENT") {
    return (
      <div className="pt-24">
        <Container className="max-w-lg py-8">
          <p className="text-muted-foreground">This booking does not require payment.</p>
          <Button className="mt-4" onClick={() => router.push(ROUTES.booking(bookingId))}>
            View booking
          </Button>
        </Container>
      </div>
    );
  }

  const isMock = order?.orderId.startsWith("order_mock_");

  async function handleMockPay() {
    if (!order?.paymentId) return;
    try {
      await verifyPayment.mutateAsync({
        orderId: order.orderId,
        paymentId: order.paymentId,
        signature: "mock_signature_dev",
      });
      router.push(`${ROUTES.paymentSuccess}?bookingId=${bookingId}&paymentId=${order.paymentId}`);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Payment failed";
      router.push(`${ROUTES.paymentFailed}?bookingId=${bookingId}&reason=${encodeURIComponent(msg)}`);
    }
  }

  async function handleRazorpayPay() {
    if (!order?.paymentId || !SITE.razorpayKey || !booking) {
      setError("Razorpay is not configured. Use mock payment in development.");
      return;
    }

    try {
      await loadRazorpayScript();
      const rzp = new window.Razorpay!({
        key: SITE.razorpayKey,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: SITE.name,
        description: booking.event.title,
        order_id: order.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verifyPayment.mutateAsync({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            router.push(`${ROUTES.paymentSuccess}?bookingId=${bookingId}&paymentId=${order.paymentId}`);
          } catch (err) {
            const msg = err instanceof ApiClientError ? err.message : "Verification failed";
            router.push(`${ROUTES.paymentFailed}?bookingId=${bookingId}&reason=${encodeURIComponent(msg)}`);
          }
        },
        prefill: {},
        theme: { color: "#7c3aed" },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open payment");
    }
  }

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-lg">
        <h1 className="text-3xl font-bold text-foreground">Complete payment</h1>
        <p className="mt-2 text-muted-foreground">{booking.event.title}</p>

        {error && (
          <p className="mt-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        {order && (
          <div className="mt-8 rounded-[24px] border border-border bg-surface/50 p-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-primary">{formatCurrency(order.amount, order.currency)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Gateway</span>
              <span className="capitalize">{order.gateway}</span>
            </div>
            {order.paymentReference && (
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-xs">{order.paymentReference}</span>
              </div>
            )}

            <Button
              variant="gradient"
              className="mt-6 w-full"
              loading={verifyPayment.isPending}
              onClick={isMock ? handleMockPay : handleRazorpayPay}
            >
              {isMock ? "Complete test payment" : "Pay with Razorpay"}
            </Button>

            {isMock && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Development mode: mock gateway accepts test signatures.
              </p>
            )}
          </div>
        )}

        {searchParams.get("retry") && (
          <p className="mt-4 text-sm text-warning">Previous payment attempt failed. Please try again.</p>
        )}
      </Container>
    </div>
  );
}
