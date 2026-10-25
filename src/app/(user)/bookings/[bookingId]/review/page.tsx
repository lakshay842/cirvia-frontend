import { LeaveReviewPage } from "@/features/reviews/leave-review-page";

export default async function Page({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return <LeaveReviewPage bookingId={bookingId} />;
}
