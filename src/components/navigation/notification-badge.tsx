"use client";

import Link from "next/link";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function NotificationBadgeLink({ className }: { className?: string }) {
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  return (
    <Link
      href={ROUTES.notifications}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground",
        className,
      )}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
