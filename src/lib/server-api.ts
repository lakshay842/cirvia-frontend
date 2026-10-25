import { SITE } from "@/constants/site";
import type { EventDetail } from "@/types/event.types";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export async function fetchEventBySlug(slug: string): Promise<EventDetail | null> {
  try {
    const res = await fetch(`${SITE.apiUrl}/events/${encodeURIComponent(slug)}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<{ event: EventDetail }>;
    return json.data?.event ?? null;
  } catch {
    return null;
  }
}
