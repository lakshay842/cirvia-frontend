"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BadgeCheck, FileSearch, LogOut, Mail, Phone, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { Textarea } from "@/components/core/textarea";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/core/skeleton";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useLogout, useSendEmailVerification } from "@/hooks/useAuth";
import { useMyHostProfile } from "@/hooks/useHost";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { isKycApproved, useVerificationStatus } from "@/hooks/useVerification";
import { updateProfileSchema, type UpdateProfileFormValues } from "@/schemas/profile.schema";
import { ApiClientError } from "@/types/api.types";

function ProfilePageSkeleton() {
  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-3xl space-y-4 py-8">
        <Skeleton className="h-32 w-full rounded-[24px]" />
        <Skeleton className="h-64 w-full rounded-[24px]" />
      </Container>
    </div>
  );
}

export function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const { data: user, isLoading, isError, isFetching, refetch } = useProfile();
  const { data: hostProfile } = useMyHostProfile();
  const { data: kycStatus } = useVerificationStatus();
  const updateProfile = useUpdateProfile();
  const logout = useLogout();
  const resendEmail = useSendEmailVerification();
  const justVerified = searchParams.get("verified") === "1";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid flashing stale "pending" while a forced profile refetch is in flight.
  const showSkeleton = !mounted || isLoading || (justVerified && isFetching && !user?.emailVerified);

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: user?.profile
      ? {
          firstName: user.profile.firstName ?? undefined,
          lastName: user.profile.lastName ?? undefined,
          bio: user.profile.bio ?? undefined,
          city: user.profile.city ?? undefined,
          state: user.profile.state ?? undefined,
          country: user.profile.country ?? undefined,
          occupation: user.profile.occupation ?? undefined,
          company: user.profile.company ?? undefined,
        }
      : undefined,
  });

  // Keep server HTML and the first client render identical (auth/query state is client-only).
  if (showSkeleton) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="pt-24 pb-16">
        <Container className="max-w-3xl py-8">
          <ErrorState onRetry={() => refetch()} />
        </Container>
      </div>
    );
  }

  const profile = user.profile;

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {profile?.firstName} {profile?.lastName}
            </h1>
            <p className="mt-1 text-muted-foreground">@{profile?.username ?? "user"}</p>
          </div>
          <Button variant="outline" onClick={() => logout.mutate()} loading={logout.isPending}>
            <LogOut className="h-4 w-4" aria-hidden />
            Log out
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-border bg-surface/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{profile?.trustScore ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Trust score</p>
          </div>
          <div className="rounded-[24px] border border-border bg-surface/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{profile?.eventsJoined ?? 0}</p>
            <p className="text-xs text-muted-foreground">Events joined</p>
          </div>
          <div className="rounded-[24px] border border-border bg-surface/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{profile?.followersCount ?? 0}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 rounded-[24px] border border-border bg-surface/50 p-6">
          <h2 className="font-semibold text-foreground">Verification</h2>
          {justVerified && user.emailVerified && (
            <p className="rounded-[18px] border border-success/30 bg-success/10 p-3 text-sm text-foreground" role="status">
              Email verified successfully.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${user.emailVerified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
              <Mail className="h-3 w-3" aria-hidden />
              Email {user.emailVerified ? "verified" : "pending"}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${user.phoneVerified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
              <Phone className="h-3 w-3" aria-hidden />
              Phone {user.phoneVerified ? "verified" : "pending"}
            </span>
          </div>
          {!user.emailVerified && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                loading={resendEmail.isPending}
                onClick={() => resendEmail.mutate()}
              >
                Resend verification email
              </Button>
              {resendEmail.isSuccess && (
                <p className="text-sm text-success" role="status">
                  Verification email sent. Check your inbox (and spam folder).
                </p>
              )}
              {resendEmail.isError && (
                <p className="text-sm text-danger" role="alert">
                  {(resendEmail.error as ApiClientError).message ??
                    "Could not send verification email. Try again in a minute."}
                </p>
              )}
            </div>
          )}
          {!user.phoneVerified && (
            <Link href={ROUTES.verifyPhone} className="inline-block text-sm text-primary hover:underline">
              Verify phone number →
            </Link>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                isKycApproved(kycStatus?.status)
                  ? "bg-success/10 text-success"
                  : kycStatus
                    ? "bg-warning/10 text-warning"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <FileSearch className="h-3 w-3" aria-hidden />
              KYC {isKycApproved(kycStatus?.status) ? "verified" : kycStatus ? kycStatus.status.toLowerCase().replace(/_/g, " ") : "not submitted"}
            </span>
            <Link href={ROUTES.profileVerification} className="text-sm font-medium text-primary hover:underline">
              {isKycApproved(kycStatus?.status) ? "View KYC details" : "Complete identity verification (KYC) →"}
            </Link>
          </div>
        </div>

        {(updateProfile.error as ApiClientError | null) && (
          <p className="mt-4 text-sm text-danger" role="alert">{(updateProfile.error as ApiClientError).message}</p>
        )}
        {updateProfile.isSuccess && (
          <p className="mt-4 text-sm text-success" role="status">Profile updated successfully.</p>
        )}

        <form
          className="mt-8 space-y-4 rounded-[24px] border border-border bg-surface/50 p-6"
          onSubmit={handleSubmit((d) => updateProfile.mutate(d))}
          noValidate
        >
          <h2 className="font-semibold text-foreground">Edit profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" error={errors.firstName?.message} {...register("firstName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" error={errors.lastName?.message} {...register("lastName")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" error={errors.bio?.message} {...register("bio")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
            </div>
          </div>
          <Button type="submit" variant="gradient" loading={updateProfile.isPending}>Save changes</Button>
        </form>

        {user.roles.includes("HOST") && (
          <div className="mt-6 rounded-[24px] border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="font-semibold text-foreground">Host account</h2>
              {hostProfile?.isVerified && (
                <BadgeCheck className="h-4 w-4 text-primary" aria-hidden />
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {hostProfile?.isVerified
                ? "You're a verified host on Cirvia."
                : "Your host profile is pending verification. You can still create events and submit them for review."}
            </p>
            <div className="mt-4 flex gap-3">
              <Link href={ROUTES.createEvent} className="text-sm font-medium text-primary hover:underline">
                Create event →
              </Link>
              <Link href={ROUTES.hostEvents} className="text-sm font-medium text-primary hover:underline">
                My events →
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
