"use client";

import { AuroraBackground } from "@/components/animations/aurora-background";
import { Container } from "@/components/layout/container";
import { SkipLink } from "@/components/layout/skip-link";
import { SITE } from "@/constants/site";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function AuthLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden py-12">
      <SkipLink />
      <AuroraBackground />
      <Container className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href={ROUTES.home} className="inline-flex items-center gap-2 text-xl font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-extrabold text-white shadow-md shadow-primary/25">
              C
            </span>
            {SITE.name}
          </Link>
        </div>
        <div
          id="main-content"
          className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)] sm:p-8"
        >
          {children}
        </div>
      </Container>
    </div>
  );
}
