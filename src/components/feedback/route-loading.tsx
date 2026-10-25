import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Container } from "@/components/layout/container";

export function RouteLoading({ label = "Loading page" }: { label?: string }) {
  return (
    <div className="pt-24" aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      <Container className="py-8">
        <EventGridSkeleton count={6} />
      </Container>
    </div>
  );
}
