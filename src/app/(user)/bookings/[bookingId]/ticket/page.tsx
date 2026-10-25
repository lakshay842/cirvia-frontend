import { QrTicketPage } from "@/features/bookings/qr-ticket-page";

export default async function Page({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return <QrTicketPage bookingId={bookingId} />;
}
