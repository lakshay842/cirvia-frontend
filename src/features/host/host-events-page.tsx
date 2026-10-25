"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LinkButton } from "@/components/core/link-button";
import { Button } from "@/components/core/button";
import { HostShell } from "@/components/host/host-shell";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { ROUTES } from "@/constants/routes";
import { useArchiveEvent, useHostEvents, usePublishEvent, useUnpublishEvent } from "@/hooks/useEvents";
import { buildEventIdMapFromBookings, resolveHostEventId } from "@/hooks/useHostEventIds";
import { registerEventId } from "@/lib/event-id-registry";
import { formatEventDate, formatPrice } from "@/lib/utils";

export function HostEventsPage() {
  const [status, setStatus] = useState<string | undefined>();
  const { data: events, isLoading, isError, refetch } = useHostEvents(status);
  const publishEvent = usePublishEvent();
  const unpublishEvent = useUnpublishEvent();
  const archiveEvent = useArchiveEvent();
  const [idMap, setIdMap] = useState<Record<string, string>>({});

  useEffect(() => {
    void buildEventIdMapFromBookings().then(setIdMap);
  }, [events]);

  return (
    <HostShell title="My events">
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { label: "All", value: undefined },
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
          { label: "Completed", value: "completed" },
        ].map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setStatus(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              status === f.value ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && <EventGridSkeleton count={3} />}
      {isError && <ErrorState title="Could not load events" onRetry={() => refetch()} />}
      {!isLoading && !isError && events?.length === 0 && (
        <EmptyState
          title="No events yet"
          description="Create your first event to start hosting."
          actionLabel="Create event"
          onAction={() => window.location.assign(ROUTES.createEvent)}
        />
      )}

      <ul className="space-y-4">
        {events?.map((event) => {
          const eventId = resolveHostEventId(event.slug, idMap);
          return (
            <li
              key={event.slug}
              className="rounded-[24px] border border-border bg-surface/50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-foreground">{event.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{formatEventDate(event.eventStart)}</p>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">Status: {event.status.toLowerCase()}</p>
                </div>
                <span className="font-semibold text-primary">{formatPrice(event.price, event.currency)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["PUBLISHED", "BOOKING_OPEN", "BOOKING_CLOSED"].includes(event.status) ? (
                  <LinkButton href={ROUTES.event(event.slug)} variant="ghost" size="sm">
                    View public
                  </LinkButton>
                ) : (
                  <LinkButton href={ROUTES.event(event.slug)} variant="ghost" size="sm">
                    Preview
                  </LinkButton>
                )}
                {eventId ? (
                  <>
                    <LinkButton
                      href={ROUTES.hostEventEdit(eventId)}
                      variant="outline"
                      size="sm"
                      onClick={() => registerEventId(event.slug, eventId)}
                    >
                      Edit
                    </LinkButton>
                    {event.status === "DRAFT" || event.status === "PENDING_REVIEW" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        loading={publishEvent.isPending}
                        onClick={() => publishEvent.mutate(eventId)}
                      >
                        Publish
                      </Button>
                    ) : null}
                    {event.status === "PUBLISHED" || event.status === "BOOKING_OPEN" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        loading={unpublishEvent.isPending}
                        onClick={() => unpublishEvent.mutate(eventId)}
                      >
                        Unpublish
                      </Button>
                    ) : null}
                    {(event.status === "COMPLETED" || event.status === "CANCELLED") && (
                      <Button
                        size="sm"
                        variant="outline"
                        loading={archiveEvent.isPending}
                        onClick={() => archiveEvent.mutate(eventId)}
                      >
                        Archive
                      </Button>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Manage actions require event ID (available after create or from bookings).
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <Link href={ROUTES.createEvent} className="mt-6 inline-block text-sm text-primary hover:underline">
        + Create new event
      </Link>
    </HostShell>
  );
}
