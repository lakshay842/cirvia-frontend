import { Suspense } from "react";
import { PaymentPage } from "@/features/payments/payment-page";

export default async function Page({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return (
    <Suspense>
      <PaymentPage bookingId={bookingId} />
    </Suspense>
  );
}
