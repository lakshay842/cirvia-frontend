import { get, patch, post } from "@/lib/api";
import type {
  CategoriesListData,
  CreateEventResponse,
  EventDetailData,
  EventSearchParams,
  EventsListData,
  HostEventsListData,
} from "@/types/event.types";

export const eventService = {
  getFeatured: (limit = 6) =>
    get<EventsListData>("/events/featured", { limit }),

  getTrending: (limit = 6) =>
    get<EventsListData>("/events/trending", { limit }),

  getList: (params?: EventSearchParams) =>
    get<EventsListData>("/events", params as Record<string, unknown>),

  search: (params?: EventSearchParams) =>
    get<EventsListData>("/events/search", params as Record<string, unknown>),

  getBySlug: (slug: string) =>
    get<EventDetailData>(`/events/${slug}`),

  getHostEvent: (eventId: string) =>
    get<EventDetailData>(`/events/${eventId}`),

  create: (body: Record<string, unknown>) =>
    post<CreateEventResponse>("/events", body),

  listHostEvents: (params?: { status?: string; page?: number; limit?: number }) =>
    get<HostEventsListData>("/hosts/events", params as Record<string, unknown>),

  update: (eventId: string, body: Record<string, unknown>) =>
    patch<{ event: CreateEventResponse["event"] }>(`/events/${eventId}`, body),

  publish: (eventId: string) =>
    patch<{ event: CreateEventResponse["event"] }>(`/events/${eventId}/publish`),

  unpublish: (eventId: string) =>
    patch<{ event: CreateEventResponse["event"] }>(`/events/${eventId}/unpublish`),

  archive: (eventId: string) =>
    patch<{ event: CreateEventResponse["event"] }>(`/events/${eventId}/archive`),
};

export const categoryService = {
  getAll: () => get<CategoriesListData>("/categories"),

  getBySlug: (slug: string) =>
    get<{ category: CategoriesListData["categories"][number] }>(`/categories/${slug}`),
};
