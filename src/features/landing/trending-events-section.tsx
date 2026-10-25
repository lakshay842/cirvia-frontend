"use client";

import { TrendingUp } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/animations/motion-section";
import { EventCard } from "@/components/cards/event-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Section, SectionHeader } from "@/components/layout/section";
import { useTrendingEvents } from "@/hooks/useEvents";

export function TrendingEventsSection() {
  const { data, isLoading, isError, refetch } = useTrendingEvents(6);

  return (
    <Section id="trending">
      <SectionHeader
        eyebrow={
          <span className="inline-flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4" aria-hidden />
            Popular right now
          </span>
        }
        title="Trending Events"
        description="The gatherings everyone&apos;s talking about this week."
      />

      {isLoading && <EventGridSkeleton count={6} />}

      {isError && (
        <ErrorState
          title="Couldn't load trending events"
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState
          title="No trending events yet"
          description="Be the first to discover what's happening in your city."
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((event) => (
            <StaggerItem key={event.slug}>
              <EventCard event={event} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </Section>
  );
}
