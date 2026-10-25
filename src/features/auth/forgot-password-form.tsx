"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { ROUTES } from "@/constants/routes";
import { useForgotPassword } from "@/hooks/useAuth";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/schemas/auth.schema";
import { ApiClientError } from "@/types/api.types";

export function ForgotPasswordForm() {
  const mutation = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Forgot password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send reset instructions.
      </p>

      {mutation.isSuccess && (
        <p className="mt-4 rounded-[18px] border border-success/30 bg-success/10 p-3 text-sm" role="status">
          If an account exists with this email, a reset link has been sent. Check your inbox.
        </p>
      )}

      {(mutation.error as ApiClientError | null) && (
        <p className="mt-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {(mutation.error as ApiClientError).message}
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit((d) => mutation.mutate(d.email))} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" error={errors.email?.message} {...register("email")} />
        </div>
        <Button type="submit" variant="gradient" className="w-full" loading={mutation.isPending}>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href={ROUTES.login} className="text-primary hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
