import { del, get, patch } from "@/lib/api";
import type { AppNotification, NotificationFilter, NotificationsListData } from "@/types/notification.types";
import type { NotificationSettings } from "@/types/settings.types";

export const notificationService = {
  list: (params?: { page?: number; limit?: number; type?: NotificationFilter; unreadOnly?: boolean }) =>
    get<NotificationsListData>("/notifications", params as Record<string, unknown>),

  getById: (notificationId: string) =>
    get<AppNotification>(`/notifications/${notificationId}`),

  markAsRead: (notificationId: string) =>
    patch<AppNotification>(`/notifications/${notificationId}/read`),

  markAllAsRead: () =>
    patch<{ markedCount: number }>("/notifications/read-all"),

  delete: (notificationId: string) =>
    del<Record<string, never>>(`/notifications/${notificationId}`),

  getPreferences: () =>
    get<NotificationSettings>("/notifications/preferences"),

  updatePreferences: (body: Partial<NotificationSettings>) =>
    patch<NotificationSettings>("/notifications/preferences", body),
};
