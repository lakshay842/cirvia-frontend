import { get, patch, postForm } from "@/lib/api";
import type { SavedEventsListData } from "@/types/saved-event.types";
import type { FullUser } from "@/types/user.types";

export const userService = {
  getMe: () => get<{ user: FullUser }>("/users/me"),

  updateProfile: (body: Record<string, unknown>) =>
    patch<{ user: FullUser }>("/users/profile", body),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return postForm<{ profileImage: string }>("/users/avatar", form);
  },

  getSavedEvents: (params?: { page?: number; limit?: number }) =>
    get<SavedEventsListData>("/users/me/saved-events", params as Record<string, unknown>),
};
