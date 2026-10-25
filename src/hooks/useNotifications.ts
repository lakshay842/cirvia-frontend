import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { notificationService } from "@/services/notification.service";
import { useAuthStore } from "@/stores/auth-store";
import type { NotificationFilter } from "@/types/notification.types";
import type { NotificationSettings } from "@/types/settings.types";

const BADGE_POLL_MS = 30_000;

export function useNotifications(params?: { type?: NotificationFilter; unreadOnly?: boolean }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.notifications.list(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await notificationService.list({ limit: 50, ...params });
      return res.data;
    },
    enabled: isAuthenticated,
  });
}

export function useUnreadNotificationCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.notifications.unreadCount,
    queryFn: async () => {
      const res = await notificationService.list({ limit: 1, unreadOnly: true });
      return res.data.unreadCount;
    },
    enabled: isAuthenticated,
    refetchInterval: BADGE_POLL_MS,
    staleTime: 10_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.delete(notificationId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
    },
  });
}

export function useNotificationPreferences() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.notifications.preferences,
    queryFn: async () => notificationService.getPreferences().then((r) => r.data),
    enabled: isAuthenticated,
  });
}

export function useUpdateNotificationPreferences() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<NotificationSettings>) =>
      notificationService.updatePreferences(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.preferences });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.settings.all });
    },
  });
}
