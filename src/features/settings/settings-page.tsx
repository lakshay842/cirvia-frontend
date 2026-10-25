"use client";

import Link from "next/link";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useSettings, useUpdateAccountSettings, useUpdatePrivacySettings } from "@/hooks/useSettings";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { Label } from "@/components/core/label";
import { ApiClientError } from "@/types/api.types";

export function SettingsPage() {
  const { data: settings, isLoading, isError, refetch } = useSettings();
  const updatePrivacy = useUpdatePrivacySettings();
  const updateAccount = useUpdateAccountSettings();

  if (isLoading) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <EventGridSkeleton count={2} />
        </Container>
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="pt-24">
        <Container className="py-8">
          <ErrorState title="Could not load settings" onRetry={() => refetch()} />
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account and privacy preferences.</p>

        <div className="mt-8 space-y-8">
          <section className="rounded-[24px] border border-border bg-surface/50 p-6">
            <h2 className="font-semibold text-foreground">Account</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label>Language</Label>
                <span className="text-sm text-muted-foreground">{settings.account.language}</span>
              </div>
              <div className="flex items-center justify-between">
                <Label>Timezone</Label>
                <span className="text-sm text-muted-foreground">{settings.account.timezone}</span>
              </div>
              <label className="flex items-center justify-between gap-4">
                <span className="text-sm">Marketing emails</span>
                <input
                  type="checkbox"
                  checked={settings.account.marketingOptIn}
                  onChange={(e) => updateAccount.mutate({ marketingOptIn: e.target.checked })}
                />
              </label>
            </div>
          </section>

          <section className="rounded-[24px] border border-border bg-surface/50 p-6">
            <h2 className="font-semibold text-foreground">Privacy</h2>
            <div className="mt-4 space-y-3">
              {(
                [
                  ["showEmail", "Show email"],
                  ["showPhone", "Show phone"],
                  ["showTrustScore", "Show trust score"],
                  ["showActivityFeed", "Show activity feed"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between gap-4">
                  <span className="text-sm">{label}</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy[key]}
                    onChange={(e) => updatePrivacy.mutate({ [key]: e.target.checked })}
                  />
                </label>
              ))}
            </div>
            {(updatePrivacy.error as ApiClientError | null) && (
              <p className="mt-3 text-sm text-danger">{(updatePrivacy.error as ApiClientError).message}</p>
            )}
          </section>

          <Link
            href={ROUTES.notificationPreferences}
            className="block rounded-[24px] border border-border bg-surface/50 p-6 transition-colors hover:border-primary/40"
          >
            <h2 className="font-semibold text-foreground">Notification preferences</h2>
            <p className="mt-1 text-sm text-muted-foreground">Email, push, SMS, and booking alerts</p>
          </Link>

          <Link
            href={ROUTES.savedEvents}
            className="block rounded-[24px] border border-border bg-surface/50 p-6 transition-colors hover:border-primary/40"
          >
            <h2 className="font-semibold text-foreground">Saved events</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your favorited gatherings</p>
          </Link>
        </div>

        <LinkButton href={ROUTES.profile} variant="ghost" className="mt-8">
          Back to profile
        </LinkButton>
      </Container>
    </div>
  );
}
