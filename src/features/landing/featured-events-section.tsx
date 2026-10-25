"use client";

import { ArrowRight } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/animations/motion-section";
import { EventCard } from "@/components/cards/event-card";
import { LinkButton } from "@/components/core/link-button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Section, SectionHeader } from "@/components/layout/section";
import { ROUTES } from "@/constants/routes";
import { useFeaturedEvents } from "@/hooks/useEvents";

export function FeaturedEventsSection() {
  const { data, isLoading, isError, refetch } = useFeaturedEvents(6);

  return (
    <Section id="featured">
      <SectionHeader
        title="Featured Events"
        description="Hand-picked gatherings from verified hosts in your community."
      />

      {isLoading && <EventGridSkeleton count={6} />}

      {isError && (
        <ErrorState
          title="Couldn't load featured events"
          message="Make sure the backend API is running and try again."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState
          title="No featured events yet"
          description="New curated experiences are on the way. Check back soon."
          actionLabel="Browse all events"
          onAction={() => window.location.assign(ROUTES.discover)}
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <>
          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((event) => (
              <StaggerItem key={event.slug}>
                <EventCard event={event} />
              </StaggerItem>
            ))}
          </StaggerGrid>
          <div className="mt-10 text-center">
            <LinkButton href={ROUTES.discover} variant="outline">
              View all events
              <ArrowRight className="h-4 w-4" aria-hidden />
            </LinkButton>
          </div>
        </>
      )}
    </Section>
  );
}
