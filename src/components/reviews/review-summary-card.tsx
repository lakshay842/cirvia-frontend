import { RatingStars } from "@/components/reviews/rating-stars";

interface ReviewSummaryCardProps {
  rating: number;
  reviewCount: number;
  label?: string;
}

export function ReviewSummaryCard({ rating, reviewCount, label = "Overall rating" }: ReviewSummaryCardProps) {
  return (
    <div className="rounded-[20px] border border-border bg-surface/50 p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end gap-3">
        <span className="text-4xl font-bold text-foreground">{rating.toFixed(1)}</span>
        <RatingStars rating={rating} size="lg" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {reviewCount === 0
          ? "No individual reviews listed yet."
          : `Based on ${reviewCount} review${reviewCount === 1 ? "" : "s"}`}
      </p>
    </div>
  );
}
