import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-success/15 text-success",
  APPROVED: "bg-success/15 text-success",
  PENDING_PAYMENT: "bg-warning/15 text-warning",
  PENDING: "bg-warning/15 text-warning",
  REQUESTED: "bg-warning/15 text-warning",
  CANCELLED: "bg-danger/15 text-danger",
  REJECTED: "bg-danger/15 text-danger",
  EXPIRED: "bg-muted text-muted-foreground",
  COMPLETED: "bg-primary/15 text-primary",
  REFUNDED: "bg-muted text-muted-foreground",
};

export function BookingStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        STATUS_STYLES[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}
