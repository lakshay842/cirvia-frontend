import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/verify-email-form";
import { Skeleton } from "@/components/core/skeleton";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Skeleton className="h-32 w-full" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
