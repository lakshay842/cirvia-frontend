"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Heart,
  MapPin,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { HERO_TRUST_ITEMS, SITE } from "@/constants/site";
import { useFeaturedEvents } from "@/hooks/useEvents";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";
import { formatEventDate } from "@/lib/utils";
import type { EventListItem } from "@/types/event.types";

const TRUST_ICONS = {
  "badge-check": BadgeCheck,
  shield: Shield,
  heart: Heart,
} as const;

const FLOATING_AVATARS = [
  { initials: "A", color: "from-violet-400 to-indigo-500", top: "8%", left: "18%" },
  { initials: "R", color: "from-fuchsia-400 to-purple-500", top: "2%", left: "48%" },
  { initials: "M", color: "from-sky-400 to-blue-500", top: "18%", left: "72%" },
  { initials: "S", color: "from-emerald-400 to-teal-500", top: "52%", left: "8%" },
  { initials: "K", color: "from-amber-400 to-orange-500", top: "68%", left: "78%" },
  { initials: "P", color: "from-rose-400 to-pink-500", top: "42%", left: "88%" },
] as const;

const FALLBACK_EVENTS: Array<{
  title: string;
  city: string;
  dateLabel: string;
  attendees: number;
  gradient: string;
}> = [
  {
    title: "Rooftop Social Mixer",
    city: "Mumbai, India",
    dateLabel: "Fri, 24 May • 7:00 PM",
    attendees: 24,
    gradient: "from-violet-500/80 to-indigo-600/80",
  },
  {
    title: "Wine & Chill Night",
    city: "Delhi",
    dateLabel: "Sat, 25 May • 8:00 PM",
    attendees: 18,
    gradient: "from-fuchsia-500/70 to-rose-500/70",
  },
  {
    title: "Board Games Night",
    city: "Bangalore",
    dateLabel: "Sun, 26 May • 6:30 PM",
    attendees: 12,
    gradient: "from-sky-500/70 to-blue-600/70",
  },
];

function TrustIcon({ name }: { name: keyof typeof TRUST_ICONS }) {
  const Icon = TRUST_ICONS[name];
  return <Icon className="h-3.5 w-3.5" aria-hidden />;
}

function AttendeeStack({ count }: { count: number }) {
  return (
    <div className="flex items-center -space-x-2">
      {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
        <div
          key={i}
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white"
        >
          {String.fromCharCode(65 + i)}
        </div>
      ))}
      {count > 4 && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-muted text-[10px] font-semibold text-muted-foreground">
          +{count - 4}
        </div>
      )}
    </div>
  );
}

function FeaturedHeroCard({ event }: { event: EventListItem }) {
  return (
    <Link
      href={ROUTES.event(event.slug)}
      className="group block overflow-hidden rounded-[24px] border border-border/60 bg-surface shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_16px_48px_rgba(109,94,252,0.15)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 420px"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        ) : null}
      </div>
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            <time dateTime={event.eventStart}>{formatEventDate(event.eventStart)}</time>
          </span>
          {event.city && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {event.city}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <AttendeeStack count={Math.min(event.capacity || 12, 24)} />
          <span className="rounded-[14px] bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}

function SideEventCard({ event }: { event: EventListItem }) {
  return (
    <Link
      href={ROUTES.event(event.slug)}
      className="flex items-center gap-3 rounded-[20px] border border-border/60 bg-surface p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-0.5"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-bold text-primary">
            {event.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="truncate text-sm font-semibold text-foreground">{event.title}</h4>
          {event.host.isVerified && (
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {formatEventDate(event.eventStart)}
        </p>
        {event.city && (
          <p className="truncate text-xs text-muted-foreground">{event.city}</p>
        )}
      </div>
    </Link>
  );
}

function FallbackHeroVisual() {
  const [featured, ...rest] = FALLBACK_EVENTS;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[24px] border border-border/60 bg-surface shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <div className={`relative aspect-[16/10] bg-gradient-to-br ${featured.gradient}`}>
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-4">
            <Users className="h-8 w-8 text-white/80" aria-hidden />
          </div>
        </div>
        <div className="space-y-3 p-4">
          <h3 className="text-lg font-bold text-foreground">{featured.title}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              {featured.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {featured.city}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <AttendeeStack count={featured.attendees} />
            <Link
              href={ROUTES.discover}
              className="rounded-[14px] bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 hidden space-y-3 lg:absolute lg:right-0 lg:top-8 lg:mt-0 lg:w-[220px] lg:translate-x-[42%] lg:space-y-3 xl:w-[240px]">
        {rest.map((event) => (
          <div
            key={event.title}
            className="flex items-center gap-3 rounded-[20px] border border-border/60 bg-surface p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${event.gradient} text-white`}
            >
              <Users className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-1">
                <h4 className="truncate text-sm font-semibold text-foreground">{event.title}</h4>
                <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{event.dateLabel}</p>
              <p className="truncate text-xs text-muted-foreground">{event.city}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroVisual() {
  const { data } = useFeaturedEvents(3);
  const events = data ?? [];

  if (events.length === 0) {
    return <FallbackHeroVisual />;
  }

  const [featured, ...side] = events;

  return (
    <div className="relative">
      <FeaturedHeroCard event={featured} />
      {side.length > 0 && (
        <div className="mt-4 space-y-3 lg:absolute lg:right-0 lg:top-8 lg:mt-0 lg:w-[220px] lg:translate-x-[42%] xl:w-[240px]">
          {side.map((event) => (
            <SideEventCard key={event.slug} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-hero-glow/80 via-background to-background pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />

      <Container className="relative z-10 py-14 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-16">
          <div className="max-w-xl">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" aria-hidden />
                Premium Verified Social Discovery
              </span>
            </motion.div>

            <motion.h1
              className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.08]"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            >
              Find Your People.
              <br />
              Build Real{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Connections.
              </span>
            </motion.h1>

            <motion.p
              className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
            >
              {SITE.description}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
            >
              <LinkButton href={ROUTES.register} variant="gradient" size="lg">
                Join Now
                <ArrowRight className="h-5 w-5" aria-hidden />
              </LinkButton>
              <LinkButton href={ROUTES.discover} variant="outline" size="lg">
                <Calendar className="h-5 w-5" aria-hidden />
                Explore Events
              </LinkButton>
            </motion.div>

            <motion.ul
              className="mt-8 flex flex-wrap gap-x-5 gap-y-3"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32, ease: "easeOut" }}
            >
              {HERO_TRUST_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <TrustIcon name={item.icon} />
                  </span>
                  {item.label}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-md lg:max-w-none lg:pr-28 xl:pr-32"
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {!reduceMotion &&
              FLOATING_AVATARS.map((avatar, i) => (
                <motion.div
                  key={avatar.initials}
                  className={`absolute z-20 hidden h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${avatar.color} text-sm font-bold text-white shadow-lg ring-4 ring-white lg:flex`}
                  style={{ top: avatar.top, left: avatar.left }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3.5 + i * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  aria-hidden
                >
                  {avatar.initials}
                </motion.div>
              ))}

            <HeroVisual />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
