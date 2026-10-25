import { get, post } from "@/lib/api";
import type { HostAnalytics, HostDashboard, HostPrivateProfile, HostPublicProfile } from "@/types/host.types";

export const hostService = {
  getBySlug: (slug: string) =>
    get<{ host: HostPublicProfile }>(`/hosts/${slug}`),

  getMe: () => get<{ host: HostPrivateProfile }>("/hosts/me"),

  apply: (body: Record<string, unknown>) =>
    post<{ host: HostPrivateProfile }>("/hosts/apply", body),

  getDashboard: () => get<{ dashboard: HostDashboard }>("/hosts/dashboard"),

  getAnalytics: () => get<{ analytics: HostAnalytics }>("/hosts/me/analytics"),

  getEventAnalytics: (eventId: string) =>
    get<{ analytics: Record<string, number> }>(`/hosts/events/${eventId}/analytics`),
};
