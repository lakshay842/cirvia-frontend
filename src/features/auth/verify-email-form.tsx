"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useVerifyEmail } from "@/hooks/useAuth";
import { ApiClientError } from "@/types/api.types";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const mutation = useVerifyEmail();
  const called = useRef(false);

  useEffect(() => {
    if (token && !called.current) {
      called.current = true;
      mutation.mutate(token);
    }
  }, [token, mutation]);

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Verify your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">Check your inbox for the verification link.</p>
        <Link href={ROUTES.login} className="mt-4 inline-block text-primary hover:underline">Back to sign in</Link>
      </div>
    );
  }

  if (mutation.isPending) {
    return (
      <div className="flex flex-col items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">Verifying your email...</p>
      </div>
    );
  }

  if (mutation.isError) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Verification failed</h1>
        <p className="mt-2 text-sm text-danger" role="alert">
          {(mutation.error as ApiClientError).message}
        </p>
        <Link href={ROUTES.login} className="mt-4 inline-block text-primary hover:underline">Back to sign in</Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-foreground">Email verified!</h1>
      <p className="mt-2 text-sm text-muted-foreground">Redirecting to sign in...</p>
    </div>
  );
}
