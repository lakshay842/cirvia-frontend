"use client";

import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/hooks/useNotifications";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Label } from "@/components/core/label";
import { ApiClientError } from "@/types/api.types";
import type { NotificationSettings } from "@/types/settings.types";

const TOGGLES: { key: keyof NotificationSettings; label: string; description: string }[] = [
  { key: "email", label: "Email", description: "Booking updates and account notices" },
  { key: "push", label: "Push", description: "Device alerts when enabled" },
  { key: "sms", label: "SMS", description: "Text messages for urgent updates" },
  { key: "booking", label: "Booking", description: "Confirmations, reminders, and changes" },
  { key: "review", label: "Reviews", description: "When someone leaves feedback" },
  { key: "security", label: "Security", description: "Login and verification alerts" },
  { key: "marketing", label: "Marketing", description: "News and promotional content" },
];

export function NotificationPreferencesPage() {
  const { data: notifications, isLoading, isError, refetch } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();

  if (isLoading) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <EventGridSkeleton count={2} />
        </Container>
      </div>
    );
  }

  if (isError || !notifications) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <ErrorState title="Could not load preferences" onRetry={() => refetch()} />
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">Notification preferences</h1>
        <p className="mt-2 text-muted-foreground">Control how Cirvia reaches you.</p>

        {(update.error as ApiClientError | null) && (
          <p className="mt-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
            {(update.error as ApiClientError).message}
          </p>
        )}

        <ul className="mt-8 space-y-3">
          {TOGGLES.map(({ key, label, description }) => (
            <li
              key={key}
              className="flex items-center justify-between gap-4 rounded-[20px] border border-border bg-surface/50 p-4"
            >
              <div>
                <Label>{label}</Label>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(e) => update.mutate({ [key]: e.target.checked })}
                aria-label={`Toggle ${label}`}
              />
            </li>
          ))}
        </ul>

        <LinkButton href={ROUTES.notifications} variant="ghost" className="mt-8">
          Back to inbox
        </LinkButton>
      </Container>
    </div>
  );
}
