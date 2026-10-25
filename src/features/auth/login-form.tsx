"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OtpInput } from "@/components/forms/otp-input";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { ROUTES } from "@/constants/routes";
import { useLogin, useLoginPhone, useSendPhoneOtp } from "@/hooks/useAuth";
import {
  loginPhoneSchema,
  loginSchema,
  type LoginFormValues,
  type LoginPhoneFormValues,
} from "@/schemas/auth.schema";
import { ApiClientError } from "@/types/api.types";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [otpSent, setOtpSent] = useState(false);
  const login = useLogin();
  const loginPhone = useLoginPhone();
  const sendOtp = useSendPhoneOtp();

  const emailForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: true },
  });

  const phoneForm = useForm<LoginPhoneFormValues>({
    resolver: zodResolver(loginPhoneSchema),
  });

  const error =
    (login.error as ApiClientError | null)?.message ??
    (loginPhone.error as ApiClientError | null)?.message ??
    (sendOtp.error as ApiClientError | null)?.message;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to your Cirvia account</p>

      {searchParams.get("registered") && (
        <p className="mt-4 rounded-[18px] border border-success/30 bg-success/10 p-3 text-sm text-foreground" role="status">
          Registration successful. Please verify your email, then sign in.
        </p>
      )}
      {searchParams.get("verified") && (
        <p className="mt-4 rounded-[18px] border border-success/30 bg-success/10 p-3 text-sm text-foreground" role="status">
          Email verified. You can now sign in.
        </p>
      )}
      {searchParams.get("reset") && (
        <p className="mt-4 rounded-[18px] border border-success/30 bg-success/10 p-3 text-sm text-foreground" role="status">
          Password reset successful. Sign in with your new password.
        </p>
      )}

      <div className="mt-6 flex rounded-[18px] border border-border p-1">
        <button
          type="button"
          className={`flex-1 rounded-[14px] py-2 text-sm font-medium transition-colors ${mode === "email" ? "bg-primary text-white" : "text-muted-foreground"}`}
          onClick={() => setMode("email")}
        >
          Email
        </button>
        <button
          type="button"
          className={`flex-1 rounded-[14px] py-2 text-sm font-medium transition-colors ${mode === "phone" ? "bg-primary text-white" : "text-muted-foreground"}`}
          onClick={() => setMode("phone")}
        >
          Phone OTP
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {mode === "email" ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={emailForm.handleSubmit((data) => login.mutate(data))}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" error={emailForm.formState.errors.email?.message} {...emailForm.register("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" error={emailForm.formState.errors.password?.message} {...emailForm.register("password")} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" {...emailForm.register("rememberMe")} className="rounded" />
              Remember me
            </label>
            <Link href={ROUTES.forgotPassword} className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={login.isPending}>
            Sign in
          </Button>
        </form>
      ) : (
        <form
          className="mt-6 space-y-4"
          onSubmit={phoneForm.handleSubmit((data) => loginPhone.mutate(data))}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" error={phoneForm.formState.errors.phone?.message} {...phoneForm.register("phone")} placeholder="+919876543210" />
          </div>
          {!otpSent ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              loading={sendOtp.isPending}
              onClick={phoneForm.handleSubmit(async (data) => {
                await sendOtp.mutateAsync(data.phone);
                setOtpSent(true);
              })}
            >
              Send OTP
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <OtpInput
                  value={phoneForm.watch("otp") ?? ""}
                  onChange={(v) => phoneForm.setValue("otp", v, { shouldValidate: true })}
                />
                {phoneForm.formState.errors.otp && (
                  <p className="text-center text-xs text-danger">{phoneForm.formState.errors.otp.message}</p>
                )}
              </div>
              <Button type="submit" variant="gradient" className="w-full" loading={loginPhone.isPending}>
                Verify & Sign in
              </Button>
            </>
          )}
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="font-medium text-primary hover:underline">
          Join Cirvia
        </Link>
      </p>
    </div>
  );
}
