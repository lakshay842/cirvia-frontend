import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { settingsService } from "@/services/settings.service";
import type { AccountSettings, NotificationSettings, PrivacySettings } from "@/types/settings.types";
import { useAuthStore } from "@/stores/auth-store";

export function useSettings() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.settings.all,
    queryFn: async () => settingsService.getAll().then((r) => r.data),
    enabled: isAuthenticated,
  });
}

export function useNotificationSettings() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.settings.notifications,
    queryFn: async () => {
      const res = await settingsService.getNotifications();
      return res.data.notifications;
    },
    enabled: isAuthenticated,
  });
}

export function useUpdateNotificationSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<NotificationSettings>) => settingsService.updateNotifications(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.settings.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.settings.notifications });
    },
  });
}

export function useUpdatePrivacySettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<PrivacySettings>) => settingsService.updatePrivacy(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.settings.all }),
  });
}

export function useUpdateAccountSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<AccountSettings>) => settingsService.updateAccount(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.settings.all }),
  });
}
