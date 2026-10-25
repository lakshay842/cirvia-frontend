"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Coffee,
  Film,
  Gamepad2,
  Music,
  Network,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { EventCategory } from "@/types/event.types";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  networking: Network,
  "coffee-meetup": Coffee,
  "movie-night": Film,
  gaming: Gamepad2,
  workshops: Users,
  "music-session": Music,
  "community-meetups": Users,
};

function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Users;
}

interface CategoryCardProps {
  category: EventCategory;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const reduceMotion = useReducedMotion();
  const Icon = getCategoryIcon(category.slug);

  const content = (
    <Link
      href={ROUTES.category(category.slug)}
      className={cn(
        "group flex items-center gap-4 rounded-[24px] border border-border/60 bg-surface p-6 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(109,94,252,0.1)]",
        className,
      )}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-transform duration-300 group-hover:scale-105">
        <Icon className="h-7 w-7" aria-hidden />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );

  if (reduceMotion) return content;

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      {content}
    </motion.div>
  );
}
