import { BookingDetailPage } from "@/features/bookings/booking-detail-page";

export default async function Page({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return <BookingDetailPage bookingId={bookingId} />;
}
