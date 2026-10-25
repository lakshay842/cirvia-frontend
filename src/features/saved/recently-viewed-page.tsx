"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useRecentlyViewedList } from "@/hooks/useRecentlyViewed";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatEventDate } from "@/lib/utils";

export function RecentlyViewedPage() {
  const { data: events, isLoading, isError, refetch } = useRecentlyViewedList();

  return (
    <div className="pt-24 pb-16">
      <Container>
        <h1 className="text-3xl font-bold text-foreground">Recently viewed</h1>
        <p className="mt-2 text-muted-foreground">
          Events you browsed on this device. No server API exists yet — stored locally in your browser.
        </p>

        <div className="mt-8">
          {isLoading && <EventGridSkeleton count={3} />}
          {isError && <ErrorState title="Could not refresh events" onRetry={() => refetch()} />}
          {!isLoading && !isError && (!events || events.length === 0) && (
            <EmptyState
              title="Nothing viewed yet"
              description="Browse events on Discover and they will show up here."
            />
          )}
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events?.map((event) => (
              <li key={event.slug}>
                <Link
                  href={ROUTES.event(event.slug)}
                  className="block overflow-hidden rounded-[24px] border border-border bg-surface/50 transition-colors hover:border-primary/40"
                >
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20">
                    {event.coverImageUrl ? (
                      <Image src={event.coverImageUrl} alt={event.title} fill className="object-cover" sizes="33vw" />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold text-foreground line-clamp-2">{event.title}</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {formatEventDate(event.eventStart)}
                    </p>
                    {event.city && <p className="text-xs text-muted-foreground">{event.city}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <LinkButton href={ROUTES.savedEvents} variant="ghost" className="mt-8">
          View saved events
        </LinkButton>
      </Container>
    </div>
  );
}
