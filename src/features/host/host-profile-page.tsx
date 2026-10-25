"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { ReviewSummaryCard } from "@/components/reviews/review-summary-card";
import { RatingStars } from "@/components/reviews/rating-stars";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/core/skeleton";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useHostProfile } from "@/hooks/useHost";

export function HostProfilePage({ slug }: { slug: string }) {
  const { data: host, isLoading, isError, refetch } = useHostProfile(slug);

  if (isLoading) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <Skeleton className="h-48 w-full rounded-[24px]" />
        </Container>
      </div>
    );
  }

  if (isError || !host) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <ErrorState title="Host not found" onRetry={() => refetch()} />
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="relative h-48 bg-gradient-to-br from-primary/30 to-accent/20 sm:h-64">
        {host.coverImageUrl && (
          <Image src={host.coverImageUrl} alt="" fill className="object-cover" sizes="100vw" />
        )}
      </div>
      <Container className="relative -mt-16 pb-16">
        {(host.isPreview || !host.isVerified) && (
          <p className="mb-6 rounded-[18px] border border-warning/30 bg-warning/10 p-4 text-sm text-warning" role="status">
            {host.isPreview
              ? "Preview only — your host profile is pending verification and is not public yet."
              : "This host profile is not verified yet."}
          </p>
        )}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative h-28 w-28 overflow-hidden rounded-[24px] border-4 border-background bg-surface shadow-xl">
            {host.profileImageUrl ? (
              <Image src={host.profileImageUrl} alt={host.displayName} fill className="object-cover" sizes="112px" />
            ) : (
              <div className="flex h-full items-center justify-center text-3xl font-bold text-primary">
                {host.displayName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground">
              {host.displayName}
              {host.isVerified && <BadgeCheck className="h-6 w-6 text-primary" aria-label="Verified host" />}
            </h1>
            {host.occupation && <p className="text-muted-foreground">{host.occupation}</p>}
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <RatingStars rating={host.hostRating} showValue reviewCount={host.totalReviews} />
              <span>{host.completedEvents} events hosted</span>
              {host.trustScore != null && <span>Trust score: {host.trustScore}</span>}
            </div>
          </div>
        </div>

        {host.bio && (
          <p className="mt-8 max-w-2xl text-muted-foreground leading-relaxed">{host.bio}</p>
        )}

        <div className="mt-8 max-w-sm">
          <ReviewSummaryCard rating={host.hostRating} reviewCount={host.totalReviews} />
        </div>

        {host.languages.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-foreground">Languages</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {host.languages.map((lang) => (
                <span key={lang} className="rounded-full bg-surface px-3 py-1 text-xs text-muted-foreground">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {host.interests.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-foreground">Interests</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {host.interests.map((interest) => (
                <span key={interest} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {host.galleryUrls.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">Gallery</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {host.galleryUrls.map((url, i) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-[18px]">
                  <Image src={url} alt={`Gallery image ${i + 1}`} fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href={ROUTES.discover} className="text-sm font-medium text-primary hover:underline">
            ← Browse all events
          </Link>
        </div>
      </Container>
    </div>
  );
}
