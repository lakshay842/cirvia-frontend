"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { OtpInput } from "@/components/forms/otp-input";
import { useSendPhoneOtp, useVerifyPhoneOtp } from "@/hooks/useAuth";
import { sendPhoneOtpSchema, verifyPhoneOtpSchema, type VerifyPhoneFormValues } from "@/schemas/auth.schema";
import { ApiClientError } from "@/types/api.types";
import { useState } from "react";

export function VerifyPhoneForm() {
  const [otpSent, setOtpSent] = useState(false);
  const sendOtp = useSendPhoneOtp();
  const verifyOtp = useVerifyPhoneOtp();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VerifyPhoneFormValues>({
    resolver: zodResolver(verifyPhoneOtpSchema),
  });

  const error =
    (sendOtp.error as ApiClientError | null)?.message ??
    (verifyOtp.error as ApiClientError | null)?.message;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Verify your phone</h1>
      <p className="mt-2 text-sm text-muted-foreground">Confirm your phone number to build trust on Cirvia.</p>

      {error && (
        <p className="mt-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit((d) => verifyOtp.mutate(d))} noValidate>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" error={errors.phone?.message} {...register("phone")} placeholder="+919876543210" />
        </div>

        {!otpSent ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            loading={sendOtp.isPending}
            onClick={handleSubmit(async (data) => {
              const parsed = sendPhoneOtpSchema.safeParse({ phone: data.phone });
              if (!parsed.success) return;
              await sendOtp.mutateAsync(parsed.data.phone);
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
                value={watch("otp") ?? ""}
                onChange={(v) => setValue("otp", v, { shouldValidate: true })}
              />
              {errors.otp && <p className="text-center text-xs text-danger">{errors.otp.message}</p>}
            </div>
            <Button type="submit" variant="gradient" className="w-full" loading={verifyOtp.isPending}>
              Verify phone
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
