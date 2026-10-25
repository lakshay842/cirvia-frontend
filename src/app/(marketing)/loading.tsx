import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Section, SectionHeader } from "@/components/layout/section";
import { Skeleton } from "@/components/core/skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Skeleton className="mx-auto h-8 w-48 rounded-full" />
          <Skeleton className="mx-auto mt-8 h-16 w-full max-w-2xl" />
          <Skeleton className="mx-auto mt-4 h-6 w-full max-w-xl" />
          <div className="mt-10 flex justify-center gap-4">
            <Skeleton className="h-14 w-36 rounded-[18px]" />
            <Skeleton className="h-14 w-40 rounded-[18px]" />
          </div>
        </div>
      </div>
      <Section>
        <SectionHeader title="Loading events..." description="" />
        <EventGridSkeleton count={3} />
      </Section>
    </div>
  );
}
