"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { ROUTES } from "@/constants/routes";
import { useResetPassword } from "@/hooks/useAuth";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/schemas/auth.schema";
import { ApiClientError } from "@/types/api.types";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const mutation = useResetPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Invalid reset link</h1>
        <p className="mt-2 text-sm text-muted-foreground">This password reset link is invalid or expired.</p>
        <Link href={ROUTES.forgotPassword} className="mt-4 inline-block text-primary hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
      <p className="mt-2 text-sm text-muted-foreground">Enter your new password below.</p>
      <input type="hidden" {...register("token")} />

      {(mutation.error as ApiClientError | null) && (
        <p className="mt-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {(mutation.error as ApiClientError).message}
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" error={errors.password?.message} {...register("password")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        </div>
        <Button type="submit" variant="gradient" className="w-full" loading={mutation.isPending}>
          Reset password
        </Button>
      </form>
    </div>
  );
}
