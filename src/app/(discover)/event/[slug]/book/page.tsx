import { BookingFlowPage } from "@/features/bookings/booking-flow-page";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BookingFlowPage slug={slug} />;
}
