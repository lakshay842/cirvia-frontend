"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  Plus,
  Ticket,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useHostDashboard } from "@/hooks/useHost";
import { cn } from "@/lib/utils";

const HOST_NAV = [
  { href: ROUTES.hostDashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.hostBookings, label: "Bookings", icon: Ticket },
  { href: ROUTES.hostAnalytics, label: "Analytics", icon: BarChart3 },
  { href: ROUTES.hostEvents, label: "Events", icon: CalendarDays },
  { href: ROUTES.hostWallet, label: "Wallet", icon: Wallet },
  { href: ROUTES.createEvent, label: "Create event", icon: Plus },
] as const;

export function HostShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  const { data: dashboard } = useHostDashboard();
  const isVerifiedHost = dashboard?.accountStatus === "VERIFIED";
  const verificationLabel = dashboard
    ? isVerifiedHost
      ? "Verified host"
      : `Host ${dashboard.accountStatus.toLowerCase().replace(/_/g, " ")}`
    : null;

  return (
    <div className="pt-24 pb-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-[24px] border border-border bg-surface p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] lg:sticky lg:top-24">
            <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Host panel
            </p>
            {verificationLabel && (
              <div
                className={cn(
                  "mb-4 flex items-center gap-2 rounded-[14px] px-3 py-2 text-xs font-medium",
                  isVerifiedHost
                    ? "bg-primary/10 text-primary"
                    : "bg-warning/10 text-warning",
                )}
              >
                <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>{verificationLabel}</span>
              </div>
            )}
            <nav className="flex flex-col gap-1">
              {HOST_NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-[14px] px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname.startsWith(href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
          <div>
            {title && <h1 className="mb-6 text-3xl font-bold text-foreground">{title}</h1>}
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
