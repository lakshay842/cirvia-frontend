import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("motion-safe:animate-pulse rounded-[18px] bg-muted/40", className)}
      aria-hidden
      {...props}
    />
  );
}

export { Skeleton };
