"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/core/button";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";

interface PageErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}

export function PageError({
  error,
  reset,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again or return to the homepage.",
}: PageErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background pt-20" role="alert">
      <Container className="py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
          <AlertTriangle className="h-8 w-8 text-danger" aria-hidden />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-foreground">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">{description}</p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="gradient" onClick={reset}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </Button>
          <LinkButton href={ROUTES.home} variant="outline">
            Back to home
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
