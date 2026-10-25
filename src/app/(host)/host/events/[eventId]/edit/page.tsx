import { EditEventPage } from "@/features/host/edit-event-page";

export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <EditEventPage eventId={eventId} />;
}
