"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/animations/motion-section";
import { EventCard } from "@/components/cards/event-card";
import { CategoryCard } from "@/components/cards/category-card";
import { Input } from "@/components/core/input";
import { Button } from "@/components/core/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Section, SectionHeader } from "@/components/layout/section";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteEvents, useInfiniteSearchEvents } from "@/hooks/useEvents";
import { useIntersection } from "@/hooks/useIntersection";
import type { EventSearchParams } from "@/types/event.types";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "trending", label: "Trending" },
  { value: "rating", label: "Highest rated" },
  { value: "price_asc", label: "Lowest price" },
  { value: "price_desc", label: "Highest price" },
] as const;

const FILTER_PANEL_ID = "discover-filters-panel";

export function DiscoverPage({ initialCategory }: { initialCategory?: string }) {
  const [filters, setFilters] = useState<EventSearchParams>({
    category: initialCategory,
    sort: "newest",
    limit: 12,
  });
  const [keyword, setKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(Boolean(initialCategory));
  const debouncedKeyword = useDebounce(keyword.trim(), 400);
  const debouncedCity = useDebounce(filters.city?.trim() ?? "", 400);

  const isSearching = Boolean(debouncedKeyword);
  const searchParams = useMemo(
    () =>
      isSearching
        ? {
            ...filters,
            city: debouncedCity || undefined,
            keyword: debouncedKeyword,
            search: debouncedKeyword,
          }
        : undefined,
    [isSearching, filters, debouncedKeyword, debouncedCity],
  );

  const listParams = useMemo(
    () => (isSearching ? undefined : { ...filters, city: debouncedCity || undefined }),
    [isSearching, filters, debouncedCity],
  );

  const listQuery = useInfiniteEvents(listParams);
  const searchQuery = useInfiniteSearchEvents(searchParams);
  const activeQuery = isSearching ? searchQuery : listQuery;

  const { data: categories } = useCategories();
  const events = activeQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;
  const isFetchingNext = activeQuery.isFetchingNextPage;
  const hasNextPage = activeQuery.hasNextPage;

  const { ref: sentinelRef, isIntersecting } = useIntersection({
    rootMargin: "200px",
    threshold: 0,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNext) {
      void activeQuery.fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNext, activeQuery]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (debouncedCity) count += 1;
    if (filters.category) count += 1;
    if (filters.priceType) count += 1;
    if (filters.verifiedHost) count += 1;
    if (filters.sort && filters.sort !== "newest") count += 1;
    return count;
  }, [debouncedCity, filters]);

  const clearFilters = useCallback(() => {
    setFilters({ sort: "newest", limit: 12 });
    setKeyword("");
  }, []);

  return (
    <div className="pt-24">
      <Section className="pb-8">
        <SectionHeader
          align="left"
          eyebrow="Explore"
          title="Discover events"
          description="Find verified gatherings that match your interests."
          className="mb-8"
        />

        <form
          className="flex flex-col gap-4 lg:flex-row"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              className="pl-12"
              placeholder="Search events, keywords..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label="Search events"
              type="search"
              autoComplete="off"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls={FILTER_PANEL_ID}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button type="button" variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4" aria-hidden />
              Clear
            </Button>
          )}
        </form>

        {showFilters && (
          <div
            id={FILTER_PANEL_ID}
            className="mt-4 grid gap-4 rounded-[24px] border border-border bg-surface/50 p-4 sm:grid-cols-2 lg:grid-cols-4"
            role="region"
            aria-label="Event filters"
          >
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-city">
                City
              </label>
              <Input
                id="filter-city"
                placeholder="Mumbai"
                value={filters.city ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value || undefined }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-category">
                Category
              </label>
              <select
                id="filter-category"
                className="flex h-12 w-full rounded-[18px] border border-border bg-surface/50 px-4 text-sm"
                value={filters.category ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, category: e.target.value || undefined }))
                }
              >
                <option value="">All categories</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-price">
                Price
              </label>
              <select
                id="filter-price"
                className="flex h-12 w-full rounded-[18px] border border-border bg-surface/50 px-4 text-sm"
                value={filters.priceType ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    priceType: (e.target.value || undefined) as EventSearchParams["priceType"],
                  }))
                }
              >
                <option value="">Any price</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-sort">
                Sort
              </label>
              <select
                id="filter-sort"
                className="flex h-12 w-full rounded-[18px] border border-border bg-surface/50 px-4 text-sm"
                value={filters.sort ?? "newest"}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    sort: e.target.value as EventSearchParams["sort"],
                  }))
                }
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2">
              <input
                type="checkbox"
                checked={filters.verifiedHost ?? false}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, verifiedHost: e.target.checked || undefined }))
                }
              />
              Verified hosts only
            </label>
          </div>
        )}
      </Section>

      {!initialCategory && categories && categories.length > 0 && (
        <Section className="py-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">Browse by category</h2>
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((cat) => (
              <StaggerItem key={cat.id}>
                <CategoryCard category={cat} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Section>
      )}

      <Section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            {initialCategory
              ? `Events in ${initialCategory}`
              : isSearching
                ? "Search results"
                : "All events"}
          </h2>
          {!isLoading && !isError && events.length > 0 && (
            <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
              {events.length} event{events.length === 1 ? "" : "s"} shown
              {hasNextPage ? " — scroll for more" : ""}
            </p>
          )}
        </div>

        {isLoading && (
          <div aria-busy="true" aria-live="polite">
            <span className="sr-only">Loading events</span>
            <EventGridSkeleton count={6} />
          </div>
        )}
        {isError && <ErrorState onRetry={() => activeQuery.refetch()} />}
        {!isLoading && !isError && events.length === 0 && (
          <EmptyState
            title="No events found"
            description="Try adjusting your filters or search terms."
            actionLabel={activeFilterCount > 0 || keyword ? "Clear filters" : undefined}
            onAction={activeFilterCount > 0 || keyword ? clearFilters : undefined}
          />
        )}
        {!isLoading && !isError && events.length > 0 && (
          <>
            <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <StaggerItem key={`${event.slug}-${event.id}`}>
                  <EventCard event={event} />
                </StaggerItem>
              ))}
            </StaggerGrid>
            <div ref={sentinelRef} className="flex justify-center py-8" aria-hidden={!isFetchingNext}>
              {isFetchingNext && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
                  <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden />
                  Loading more events…
                </div>
              )}
            </div>
          </>
        )}
      </Section>
    </div>
  );
}
