"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AUTH_GUEST_ONLY_ROUTES, HOST_ROUTES, PROTECTED_ROUTES, ROUTES } from "@/constants/routes";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasRole = useAuthStore((s) => s.hasRole);
  const { data: profile, isLoading: profileLoading } = useProfile();
  const [hydrated, setHydrated] = useState(false);

  const isHost =
    hasRole("HOST") || (profile?.roles.includes("HOST") ?? false);

  useEffect(() => {
    const persist = useAuthStore.persist;
    if (!persist) {
      setHydrated(true);
      return;
    }
    if (persist.hasHydrated()) {
      setHydrated(true);
    }
    return persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const isGuestAuthRoute = AUTH_GUEST_ONLY_ROUTES.some((r) => pathname.startsWith(r));
    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    const isHostRoute = HOST_ROUTES.some((r) => pathname.startsWith(r));
    const isBookRoute = pathname.includes("/book");

    if (!isAuthenticated && (isProtected || isBookRoute)) {
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isAuthenticated && isGuestAuthRoute) {
      const redirect = searchParams.get("redirect");
      router.replace(redirect?.startsWith("/") ? redirect : ROUTES.discover);
      return;
    }

    if (!isAuthenticated) return;

    const hostCheckPending = profileLoading && !profile;

    if (hostCheckPending) return;

    if (pathname.startsWith(ROUTES.createEvent) && !isHost) {
      router.replace(ROUTES.becomeHost);
      return;
    }

    if (isHostRoute && !isHost) {
      router.replace(ROUTES.becomeHost);
    }
  }, [
    hydrated,
    isAuthenticated,
    isHost,
    pathname,
    profile,
    profileLoading,
    router,
    searchParams,
  ]);

  return <>{children}</>;
}
