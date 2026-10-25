"use client";

import { Suspense, type ReactNode } from "react";
import { AuthGuard } from "@/components/navigation/auth-guard";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <Suspense fallback={null}>
          <AuthGuard>{children}</AuthGuard>
        </Suspense>
      </QueryProvider>
    </ThemeProvider>
  );
}
