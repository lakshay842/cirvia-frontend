"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import { eventService } from "@/services/event.service";
import type { RecentlyViewedEntry } from "@/types/saved-event.types";

export function useRecentlyViewedList() {
  const [entries, setEntries] = useState<RecentlyViewedEntry[]>([]);

  useEffect(() => {
    setEntries(getRecentlyViewed());
  }, []);

  return useQuery({
    queryKey: QUERY_KEYS.users.recentlyViewed(entries.map((e) => e.slug)),
    queryFn: async () => {
      const stored = getRecentlyViewed();
      const refreshed = await Promise.all(
        stored.map(async (entry) => {
          try {
            const res = await eventService.getBySlug(entry.slug);
            const event = res.data.event;
            const cover = event.media.find((m) => m.isCover) ?? event.media[0];
            return {
              slug: event.slug,
              title: event.title,
              coverImageUrl: cover?.url ?? entry.coverImageUrl,
              city: event.location?.city ?? entry.city,
              eventStart: event.eventStart,
              viewedAt: entry.viewedAt,
            } satisfies RecentlyViewedEntry;
          } catch {
            return entry;
          }
        }),
      );
      return refreshed;
    },
    enabled: entries.length > 0,
    staleTime: 60_000,
  });
}
