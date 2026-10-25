"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { Textarea } from "@/components/core/textarea";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useBecomeHost } from "@/hooks/useHost";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth-store";
import {
  becomeHostSchema,
  toBecomeHostPayload,
  type BecomeHostFormValues,
} from "@/schemas/host.schema";
import { ApiClientError } from "@/types/api.types";

export function BecomeHostPage() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const isHost =
    useAuthStore((s) => s.hasRole("HOST")) || (profile?.roles.includes("HOST") ?? false);
  const becomeHost = useBecomeHost();

  const { register, handleSubmit, formState: { errors } } = useForm<BecomeHostFormValues>({
    resolver: zodResolver(becomeHostSchema),
    defaultValues: { country: "India" },
  });

  if (isHost) {
    return (
      <div className="pt-24 pb-16">
        <Container className="max-w-lg text-center">
          <h1 className="text-2xl font-bold text-foreground">You&apos;re already a host!</h1>
          <p className="mt-2 text-muted-foreground">Start creating events for your community.</p>
          <Button variant="gradient" className="mt-6" onClick={() => router.push(ROUTES.createEvent)}>
            Create an event
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">Become a host</h1>
        <p className="mt-2 text-muted-foreground">
          Share your passion and bring people together through verified gatherings.
        </p>

        {(becomeHost.error as ApiClientError | null) && (
          <p className="mt-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
            {(becomeHost.error as ApiClientError).message}
          </p>
        )}

        <form
          className="mt-8 space-y-4 rounded-[24px] border border-border bg-surface/50 p-6"
          onSubmit={handleSubmit(async (values) => {
            await becomeHost.mutateAsync(toBecomeHostPayload(values));
            router.push(ROUTES.createEvent);
          })}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="displayName">Display name (optional)</Label>
            <Input id="displayName" {...register("displayName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" error={errors.bio?.message} {...register("bio")} placeholder="Tell guests about yourself..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Hosting experience</Label>
            <Textarea id="experience" error={errors.experience?.message} {...register("experience")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="languages">Languages (comma-separated)</Label>
            <Input id="languages" error={errors.languages?.message} {...register("languages")} placeholder="English, Hindi" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address</Label>
            <Input id="addressLine1" error={errors.addressLine1?.message} {...register("addressLine1")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" error={errors.city?.message} {...register("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" error={errors.state?.message} {...register("state")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" error={errors.country?.message} {...register("country")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input id="postalCode" error={errors.postalCode?.message} {...register("postalCode")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Emergency contact name</Label>
              <Input id="emergencyName" error={errors.emergencyName?.message} {...register("emergencyName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Emergency contact phone</Label>
              <Input id="emergencyPhone" error={errors.emergencyPhone?.message} {...register("emergencyPhone")} />
            </div>
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={becomeHost.isPending}>
            Submit application
          </Button>
        </form>
      </Container>
    </div>
  );
}
