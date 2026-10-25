"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatEventDate } from "@/lib/utils";

export function SavedEventsPage() {
  const { data: events, isLoading, isError, refetch } = useSavedEvents();

  return (
    <div className="pt-24 pb-16">
      <Container>
        <h1 className="text-3xl font-bold text-foreground">Saved events</h1>
        <p className="mt-2 text-muted-foreground">Events you have favorited on Cirvia.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Save/unsave actions require POST/DELETE /events/:eventId/save (not yet on backend). This page lists existing favorites only.
        </p>

        <div className="mt-8">
          {isLoading && <EventGridSkeleton count={3} />}
          {isError && <ErrorState title="Could not load saved events" onRetry={() => refetch()} />}
          {!isLoading && !isError && events?.length === 0 && (
            <EmptyState
              title="No saved events"
              description="When you save events, they will appear here."
            />
          )}
          <ul className="space-y-4">
            {events?.map((event) => (
              <li key={event.id}>
                <Link
                  href={ROUTES.event(event.slug)}
                  className="flex items-center gap-4 rounded-[24px] border border-border bg-surface/50 p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-foreground">{event.title}</h2>
                    <p className="text-sm text-muted-foreground">{formatEventDate(event.eventStart)}</p>
                    <p className="text-xs text-muted-foreground">Saved {formatEventDate(event.savedAt)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex gap-3">
          <LinkButton href={ROUTES.discover} variant="outline">
            Discover events
          </LinkButton>
          <LinkButton href={ROUTES.recentlyViewed} variant="ghost">
            Recently viewed
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
