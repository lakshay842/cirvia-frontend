import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiMeta } from "@/types/api.types";
import { QUERY_KEYS } from "@/constants/query-keys";
import { eventService } from "@/services/event.service";
import { useAuthStore } from "@/stores/auth-store";
import type { EventSearchParams } from "@/types/event.types";

export function useFeaturedEvents(limit = 6) {
  return useQuery({
    queryKey: QUERY_KEYS.events.featured(limit),
    queryFn: async () => {
      const response = await eventService.getFeatured(limit);
      return response.data.items;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useTrendingEvents(limit = 6) {
  return useQuery({
    queryKey: QUERY_KEYS.events.trending(limit),
    queryFn: async () => {
      const response = await eventService.getTrending(limit);
      return response.data.items;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useEvents(params?: EventSearchParams) {
  return useQuery({
    queryKey: QUERY_KEYS.events.list(params as Record<string, unknown>),
    queryFn: async () => {
      const response = await eventService.getList(params);
      return { items: response.data.items, meta: response.meta };
    },
    staleTime: 60 * 1000,
  });
}

export function useSearchEvents(params?: EventSearchParams) {
  const hasKeyword = Boolean(params?.keyword || params?.search);
  return useQuery({
    queryKey: QUERY_KEYS.events.search(params as Record<string, unknown>),
    queryFn: async () => {
      const response = await eventService.search(params);
      return { items: response.data.items, meta: response.meta };
    },
    enabled: hasKeyword || Boolean(params?.city) || Boolean(params?.category),
    staleTime: 60 * 1000,
  });
}

const PAGE_SIZE = 12;

function getNextPage(meta: ApiMeta, itemCount: number, limit: number, currentPage: number) {
  if (meta.hasNextPage === false) return undefined;
  if (meta.hasNextPage) return currentPage + 1;
  if (meta.totalPages && meta.page && meta.page < meta.totalPages) return meta.page + 1;
  if (itemCount < limit) return undefined;
  return currentPage + 1;
}

export function useInfiniteEvents(params?: Omit<EventSearchParams, "page">) {
  const limit = params?.limit ?? PAGE_SIZE;
  const base = { ...params, limit };

  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.events.list(base as Record<string, unknown>), "infinite"],
    queryFn: async ({ pageParam }) => {
      const response = await eventService.getList({ ...base, page: pageParam });
      return { items: response.data.items, meta: response.meta, page: pageParam };
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      getNextPage(last.meta, last.items.length, limit, last.page),
    staleTime: 60 * 1000,
  });
}

export function useInfiniteSearchEvents(params?: Omit<EventSearchParams, "page">) {
  const limit = params?.limit ?? PAGE_SIZE;
  const base = { ...params, limit };
  const hasKeyword = Boolean(params?.keyword || params?.search);
  const enabled =
    hasKeyword || Boolean(params?.city) || Boolean(params?.category) || Boolean(params?.priceType);

  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.events.search(base as Record<string, unknown>), "infinite"],
    queryFn: async ({ pageParam }) => {
      const response = await eventService.search({ ...base, page: pageParam });
      return { items: response.data.items, meta: response.meta, page: pageParam };
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      getNextPage(last.meta, last.items.length, limit, last.page),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useEventDetail(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.events.detail(slug),
    queryFn: async () => {
      const response = await eventService.getBySlug(slug);
      return response.data.event;
    },
    enabled: Boolean(slug),
  });
}

export function useHostEventDetail(eventId: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.events.hostDetail(eventId),
    queryFn: async () => {
      const response = await eventService.getHostEvent(eventId);
      return response.data.event;
    },
    enabled: Boolean(eventId) && isAuthenticated,
  });
}

export function useCreateEvent() {
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => eventService.create(body),
  });
}

export function useHostEvents(status?: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.events.hostList({ status }),
    queryFn: async () => {
      const res = await eventService.listHostEvents({ status, limit: 50 });
      return res.data.items;
    },
    enabled: isAuthenticated,
  });
}

export function useUpdateEvent(eventId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: Record<string, unknown>) => eventService.update(eventId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.hostList() });
    },
  });
}

export function usePublishEvent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.publish(eventId),
    onSuccess: (_data, eventId) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.hostList() });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.hostDetail(eventId) });
    },
  });
}

export function useUnpublishEvent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.unpublish(eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.events.hostList() }),
  });
}

export function useArchiveEvent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.archive(eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.events.hostList() }),
  });
}
