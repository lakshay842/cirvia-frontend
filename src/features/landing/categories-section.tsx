"use client";

import Link from "next/link";
import {
  Coffee,
  Dumbbell,
  Gamepad2,
  MoreHorizontal,
  Music,
  Network,
  PartyPopper,
  Sparkles,
  Trophy,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/animations/motion-section";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { CategoryGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Section, SectionHeader } from "@/components/layout/section";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";
import type { EventCategory } from "@/types/event.types";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  networking: Network,
  "coffee-meetup": Coffee,
  "movie-night": Music,
  gaming: Gamepad2,
  workshops: Sparkles,
  "music-session": Music,
  "community-meetups": Users,
  parties: PartyPopper,
  "wine-dine": Utensils,
  adventure: Trophy,
  sports: Dumbbell,
};

const ICON_COLORS = [
  "text-violet-500 bg-violet-500/10",
  "text-pink-500 bg-pink-500/10",
  "text-amber-500 bg-amber-500/10",
  "text-sky-500 bg-sky-500/10",
  "text-orange-500 bg-orange-500/10",
  "text-emerald-500 bg-emerald-500/10",
  "text-blue-500 bg-blue-500/10",
  "text-rose-500 bg-rose-500/10",
  "text-indigo-500 bg-indigo-500/10",
];

function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Users;
}

function CategoryTile({
  category,
  index,
  active,
}: {
  category: EventCategory;
  index: number;
  active?: boolean;
}) {
  const Icon = getCategoryIcon(category.slug);
  const tone = ICON_COLORS[index % ICON_COLORS.length];

  return (
    <Link
      href={ROUTES.category(category.slug)}
      className={cn(
        "group flex flex-col items-center gap-3 rounded-[20px] border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(109,94,252,0.12)]",
        active
          ? "border-primary/20 bg-primary/10 shadow-[0_8px_24px_rgba(109,94,252,0.12)]"
          : "border-border/60 bg-surface shadow-[0_4px_16px_rgba(15,23,42,0.04)]",
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
          active ? "bg-primary/15 text-primary" : tone,
        )}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <span
        className={cn(
          "text-sm font-medium",
          active ? "text-primary" : "text-foreground",
        )}
      >
        {category.name}
      </span>
    </Link>
  );
}

export function CategoriesSection() {
  const { data, isLoading, isError, refetch } = useCategories();
  const categories = data?.slice(0, 9) ?? [];

  return (
    <Section id="categories">
      <SectionHeader title="What do you want to explore?" />

      {isLoading && <CategoryGridSkeleton count={8} />}

      {isError && (
        <ErrorState title="Couldn't load categories" onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState
          title="No categories available"
          description="Categories will appear once they're configured in the platform."
        />
      )}

      {!isLoading && !isError && categories.length > 0 && (
        <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
          <StaggerItem>
            <Link
              href={ROUTES.discover}
              className="group flex flex-col items-center gap-3 rounded-[20px] border border-primary/20 bg-primary/10 p-4 text-center shadow-[0_8px_24px_rgba(109,94,252,0.12)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Sparkles className="h-6 w-6" aria-hidden />
              </div>
              <span className="text-sm font-medium text-primary">All Events</span>
            </Link>
          </StaggerItem>

          {categories.map((category, index) => (
            <StaggerItem key={category.id}>
              <CategoryTile category={category} index={index} />
            </StaggerItem>
          ))}

          {categories.length < 9 && (
            <StaggerItem>
              <Link
                href={ROUTES.discover}
                className="group flex flex-col items-center gap-3 rounded-[20px] border border-border/60 bg-surface p-4 text-center shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(109,94,252,0.12)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <MoreHorizontal className="h-6 w-6" aria-hidden />
                </div>
                <span className="text-sm font-medium text-foreground">More</span>
              </Link>
            </StaggerItem>
          )}
        </StaggerGrid>
      )}
    </Section>
  );
}
