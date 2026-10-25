import { get, patch } from "@/lib/api";
import type {
  AccountSettings,
  NotificationSettings,
  PrivacySettings,
  UserSettings,
} from "@/types/settings.types";

export const settingsService = {
  getAll: () => get<UserSettings>("/users/me/settings"),

  getPrivacy: () => get<{ privacy: PrivacySettings }>("/users/me/settings/privacy"),

  updatePrivacy: (body: Partial<PrivacySettings>) =>
    patch<{ privacy: PrivacySettings }>("/users/me/settings/privacy", body),

  getAccount: () => get<{ account: AccountSettings }>("/users/me/settings/account"),

  updateAccount: (body: Partial<AccountSettings>) =>
    patch<{ account: AccountSettings }>("/users/me/settings/account", body),

  getNotifications: () =>
    get<{ notifications: NotificationSettings }>("/users/me/settings/notifications"),

  updateNotifications: (body: Partial<NotificationSettings>) =>
    patch<{ notifications: NotificationSettings }>("/users/me/settings/notifications", body),
};
