import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { fullUserToAuthUser } from "@/lib/auth-user";
import { hostService } from "@/services/host.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";
import { useRefreshAuth } from "@/hooks/useAuth";

export function useHostProfile(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.hosts.detail(slug),
    queryFn: async () => {
      const res = await hostService.getBySlug(slug);
      return res.data.host;
    },
    enabled: Boolean(slug),
  });
}

export function useMyHostProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.hosts.me,
    queryFn: async () => {
      const res = await hostService.getMe();
      return res.data.host;
    },
    enabled: isAuthenticated,
  });
}

export function useBecomeHost() {
  const qc = useQueryClient();
  const refreshAuth = useRefreshAuth();

  return useMutation({
    mutationFn: (body: Record<string, unknown>) => hostService.apply(body),
    onSuccess: async () => {
      await refreshAuth.mutateAsync();
      const res = await userService.getMe();
      const existing = useAuthStore.getState().user;
      if (existing) {
        useAuthStore.getState().setUser(fullUserToAuthUser(res.data.user, existing));
      }
      qc.invalidateQueries({ queryKey: QUERY_KEYS.hosts.me });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.me });
    },
  });
}

export function useHostDashboard() {
  const isHost = useAuthStore((s) => s.hasRole("HOST"));

  return useQuery({
    queryKey: QUERY_KEYS.hosts.dashboard,
    queryFn: async () => {
      const res = await hostService.getDashboard();
      return res.data.dashboard;
    },
    enabled: isHost,
  });
}

export function useHostAnalytics() {
  const isHost = useAuthStore((s) => s.hasRole("HOST"));

  return useQuery({
    queryKey: QUERY_KEYS.hosts.analytics,
    queryFn: async () => {
      const res = await hostService.getAnalytics();
      return res.data.analytics;
    },
    enabled: isHost,
  });
}
