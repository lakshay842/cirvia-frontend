import { getRegisteredEventId, registerEventIds } from "@/lib/event-id-registry";
import { bookingService, hostBookingService } from "@/services/booking.service";

export async function buildEventIdMapFromBookings(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};

  try {
    const userRes = await bookingService.list({ status: "all", limit: 100 });
    for (const b of userRes.data.bookings) {
      map[b.event.slug] = b.event.eventId;
    }
  } catch {
    // ignore
  }

  try {
    const hostRes = await hostBookingService.list({ limit: 100 });
    for (const b of hostRes.data.bookings) {
      map[b.event.slug] = b.event.eventId;
    }
  } catch {
    // ignore
  }

  registerEventIds(Object.entries(map).map(([slug, eventId]) => ({ slug, eventId })));
  return map;
}

export function resolveHostEventId(slug: string, map: Record<string, string>): string | null {
  return map[slug] ?? getRegisteredEventId(slug);
}
