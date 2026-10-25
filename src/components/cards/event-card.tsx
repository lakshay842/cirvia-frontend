"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Calendar, MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";
import { cn, formatEventDate, formatPrice } from "@/lib/utils";
import type { EventListItem } from "@/types/event.types";

interface EventCardProps {
  event: EventListItem;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const reduceMotion = useReducedMotion();

  const content = (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border/60 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(109,94,252,0.12)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            className="object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 33vw"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl font-bold text-primary/30">
              {event.category.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {event.category.name}
          </span>
          {event.isFeatured && (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {event.host.displayName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-sm font-medium text-foreground">
              {event.host.displayName}
              {event.host.isVerified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified host" />
              )}
            </p>
          </div>
          <span className="text-sm font-semibold text-primary">
            {formatPrice(event.price, event.currency)}
          </span>
        </div>

        <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        {event.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {event.shortDescription}
          </p>
        )}

        <div className="mt-auto space-y-2 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" aria-hidden />
            <time dateTime={event.eventStart}>{formatEventDate(event.eventStart)}</time>
          </div>
          {event.city && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              <span>{event.city}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex h-12 w-full items-center justify-center rounded-[18px] border border-border bg-surface text-sm font-semibold text-foreground transition-all group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/25">
          View Details
        </div>
      </div>
    </article>
  );

  if (reduceMotion) {
    return (
      <Link href={ROUTES.event(event.slug)} className="block h-full">
        {content}
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={ROUTES.event(event.slug)} className="block h-full">
        {content}
      </Link>
    </motion.div>
  );
}
