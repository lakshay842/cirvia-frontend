"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/core/button";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatEventDate } from "@/lib/utils";
import type { NotificationFilter } from "@/types/notification.types";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: NotificationFilter }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "all" },
  { label: "Booking", value: "booking" },
  { label: "Security", value: "security" },
  { label: "Reviews", value: "review" },
];

export function NotificationInboxPage() {
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { data, isLoading, isError, refetch } = useNotifications({
    type: filter === "all" ? undefined : filter,
    unreadOnly: unreadOnly || undefined,
  });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="mt-1 text-muted-foreground">
              {data?.unreadCount ?? 0} unread · updates every 30s
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data?.unreadCount || markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="h-4 w-4" aria-hidden />
              Mark all read
            </Button>
            <LinkButton href={ROUTES.notificationPreferences} variant="ghost" size="sm">
              Preferences
            </LinkButton>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                if (f.label === "Unread") {
                  setUnreadOnly(true);
                  setFilter("all");
                } else {
                  setUnreadOnly(false);
                  setFilter(f.value);
                }
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                (f.label === "Unread" ? unreadOnly : filter === f.value && !unreadOnly)
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {isLoading && <EventGridSkeleton count={3} />}
          {isError && <ErrorState title="Could not load notifications" onRetry={() => refetch()} />}
          {!isLoading && !isError && data?.notifications.length === 0 && (
            <EmptyState
              title="Inbox empty"
              description="You're all caught up. New alerts will appear here."
            />
          )}
          <ul className="space-y-3">
            {data?.notifications.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "rounded-[20px] border p-4 transition-colors",
                  n.isRead
                    ? "border-border bg-surface/40"
                    : "border-primary/30 bg-primary/5",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <p className="font-medium text-foreground">{n.title}</p>
                      {!n.isRead && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatEventDate(n.createdAt)}</p>
                    {typeof n.data?.bookingId === "string" && (
                      <Link
                        href={ROUTES.booking(n.data.bookingId)}
                        className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                      >
                        View booking →
                      </Link>
                    )}
                    {typeof n.data?.eventSlug === "string" && (
                      <Link
                        href={ROUTES.event(n.data.eventSlug)}
                        className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                      >
                        View event →
                      </Link>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {!n.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Mark as read"
                        onClick={() => markRead.mutate(n.id)}
                      >
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete notification"
                      onClick={() => deleteNotification.mutate(n.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
