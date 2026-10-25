"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function RatingStars({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  reviewCount,
  className,
}: RatingStarsProps) {
  const clamped = Math.min(max, Math.max(0, rating));

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Rating ${clamped} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = clamped >= i + 1;
        const partial = !filled && clamped > i && clamped < i + 1;
        return (
          <Star
            key={i}
            className={cn(
              SIZES[size],
              filled || partial ? "fill-warning text-warning" : "text-muted-foreground/40",
            )}
            aria-hidden
          />
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground">
          {clamped.toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
}
