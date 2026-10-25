import type { Metadata } from "next";
import { EventDetailPage } from "@/features/events/event-detail-page";
import { buildPageMetadata } from "@/lib/seo";
import { fetchEventBySlug } from "@/lib/server-api";
import { ROUTES } from "@/constants/routes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event) {
    return buildPageMetadata({
      title: "Event not found",
      path: ROUTES.event(slug),
      noIndex: true,
    });
  }

  const cover = event.media.find((m) => m.isCover) ?? event.media[0];

  return buildPageMetadata({
    title: event.title,
    description: event.shortDescription ?? event.description.slice(0, 160),
    path: ROUTES.event(slug),
    image: cover?.url ?? undefined,
  });
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  return <EventDetailPage slug={slug} />;
}
