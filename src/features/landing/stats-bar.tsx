"use client";

import {
  BadgeCheck,
  CalendarDays,
  Users,
  type LucideIcon,
} from "lucide-react";
import { CountUp } from "@/components/animations/count-up";
import { Container } from "@/components/layout/container";
import { BRAND_STATS } from "@/constants/site";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  "badge-check": BadgeCheck,
  calendar: CalendarDays,
};

const TONE_STYLES: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function StatsBar() {
  return (
    <section className="border-y border-border/60 bg-surface">
      <Container className="py-8 sm:py-10">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {BRAND_STATS.map((stat) => {
            const Icon = ICON_MAP[stat.icon] ?? Users;
            return (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-4 sm:justify-start lg:justify-center"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                    TONE_STYLES[stat.color] ?? TONE_STYLES.primary,
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
