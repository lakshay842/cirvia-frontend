"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Calendar, MapPin, Users } from "lucide-react";
import { LinkButton } from "@/components/core/link-button";
import { RatingStars } from "@/components/reviews/rating-stars";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useEventDetail } from "@/hooks/useEvents";
import { useAuthStore } from "@/stores/auth-store";
import { addRecentlyViewed } from "@/lib/recently-viewed";
import { formatEventDate, formatPrice } from "@/lib/utils";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

export function EventDetailPage({ slug }: { slug: string }) {
  const { data: event, isLoading, isError, refetch } = useEventDetail(slug);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!event) return;
    const cover = event.media.find((m) => m.isCover) ?? event.media[0];
    addRecentlyViewed({
      slug: event.slug,
      title: event.title,
      coverImageUrl: cover?.url ?? null,
      city: event.location?.city ?? null,
      eventStart: event.eventStart,
    });
  }, [event]);

  if (isLoading) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <EventGridSkeleton count={1} />
        </Container>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <ErrorState title="Event not found" onRetry={() => refetch()} />
        </Container>
      </div>
    );
  }

  const cover = event.media.find((m) => m.isCover) ?? event.media[0];

  return (
    <div className="pt-20">
      <div className="relative aspect-[21/9] max-h-[480px] w-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        {cover?.url ? (
          <Image
            src={cover.url}
            alt={event.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      </div>

      <Container className="py-10">
        {(event.isPreview || event.status === "DRAFT") && (
          <p className="mb-6 rounded-[18px] border border-warning/30 bg-warning/10 p-4 text-sm text-warning" role="status">
            Preview only — publish this event to make it visible on Discover.
          </p>
        )}
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {event.category.name}
              </span>
              {event.isFeatured && (
                <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">Featured</span>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">{event.title}</h1>
            {event.shortDescription && (
              <p className="mt-3 text-lg text-muted-foreground">{event.shortDescription}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden />
                <time dateTime={event.eventStart}>{formatEventDate(event.eventStart)}</time>
              </span>
              {event.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden />
                  {event.location.city}, {event.location.state}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" aria-hidden />
                {event.remainingCapacity} spots left
              </span>
            </div>
            <div className="prose prose-invert mt-8 max-w-none">
              <h2 className="text-xl font-semibold text-foreground">About this event</h2>
              <p className="mt-3 whitespace-pre-wrap text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
            {event.rules.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-foreground">Event rules</h2>
                <ul className="mt-3 space-y-2">
                  {event.rules.map((rule) => (
                    <li key={rule.id} className="rounded-[18px] border border-border bg-surface/40 p-4">
                      <p className="font-medium text-foreground">{rule.title}</p>
                      {rule.description && <p className="mt-1 text-sm text-muted-foreground">{rule.description}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-[24px] border border-border bg-surface p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] lg:sticky lg:top-24">
            <p className="text-3xl font-bold text-primary">{formatPrice(event.price, event.currency)}</p>
            <Link
              href={ROUTES.host(event.host.slug)}
              className="mt-4 flex items-center gap-3 rounded-[18px] border border-border p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {event.host.displayName.charAt(0)}
              </div>
              <div>
                <p className="flex items-center gap-1 font-medium text-foreground">
                  {event.host.displayName}
                  {event.host.isVerified && <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified" />}
                </p>
                {event.host.hostRating != null && (
                  <RatingStars rating={event.host.hostRating} size="sm" className="mt-0.5" />
                )}
                <p className="text-xs text-muted-foreground">View host profile</p>
              </div>
            </Link>
            {event.isPreview || event.status === "DRAFT" ? (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Publish this event to enable booking.
              </p>
            ) : isAuthenticated ? (
              <LinkButton href={ROUTES.bookEvent(slug)} variant="gradient" className="mt-6 w-full">
                Book now
              </LinkButton>
            ) : (
              <LinkButton href={ROUTES.login} variant="gradient" className="mt-6 w-full">
                Sign in to join
              </LinkButton>
            )}
            {!event.isPreview && event.status !== "DRAFT" && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {isAuthenticated ? "Reserve your spot in a few steps" : "Booking available after sign in"}
              </p>
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
}
