"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { ROUTES } from "@/constants/routes";
import { useRegister } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";
import { ApiClientError } from "@/types/api.types";

export function RegisterForm() {
  const registerMutation = useRegister();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const acceptTerms = watch("acceptTerms");

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Join verified gatherings near you</p>

      {(registerMutation.error as ApiClientError | null) && (
        <p className="mt-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {(registerMutation.error as ApiClientError).message}
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit((d) => registerMutation.mutate(d))} noValidate>
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" error={errors.email?.message} {...register("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" error={errors.phone?.message} {...register("phone")} placeholder="+919876543210" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" error={errors.password?.message} {...register("password")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        </div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={acceptTerms === true}
            onChange={(e) => setValue("acceptTerms", e.target.checked ? true : (undefined as unknown as true), { shouldValidate: true })}
            className="mt-1 rounded"
          />
          <span>
            I accept the{" "}
            <Link href={ROUTES.terms} className="text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href={ROUTES.privacy} className="text-primary hover:underline">Privacy Policy</Link>
          </span>
        </label>
        {errors.acceptTerms && <p className="text-xs text-danger">{errors.acceptTerms.message}</p>}
        <Button type="submit" variant="gradient" className="w-full" loading={registerMutation.isPending}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
