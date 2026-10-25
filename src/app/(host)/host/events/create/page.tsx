import type { Metadata } from "next";
import { CreateEventPage } from "@/features/host/create-event-page";

export const metadata: Metadata = { title: "Create Event" };

export default function CreateEventRoutePage() {
  return <CreateEventPage />;
}
