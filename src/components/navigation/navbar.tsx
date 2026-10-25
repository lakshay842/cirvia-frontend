"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  CalendarDays,
  ChevronDown,
  Menu,
  User,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "@/components/core/button";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { NotificationBadgeLink } from "@/components/navigation/notification-badge";
import { NAV_LINKS, ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

const MOBILE_MENU_ID = "mobile-nav-menu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isHost = user?.roles.includes("HOST");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const panel = mobileMenuRef.current;
    if (!panel) return;

    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-surface/90 shadow-sm backdrop-blur-xl"
          : "bg-surface/70 backdrop-blur-md",
      )}
    >
      <Container>
        <nav
          className="flex h-16 items-center justify-between lg:h-[72px]"
          aria-label="Main navigation"
        >
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-extrabold text-white shadow-md shadow-primary/25">
              C
            </span>
            {SITE.name}
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-all",
                      active
                        ? "text-foreground after:w-full"
                        : "text-muted-foreground after:w-0 hover:text-foreground hover:after:w-full",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-1.5 lg:flex">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <NotificationBadgeLink />
                <LinkButton
                  href={ROUTES.savedEvents}
                  variant="ghost"
                  size="icon"
                  aria-label="Saved events"
                  className="text-muted-foreground"
                >
                  <Bookmark className="h-5 w-5" />
                </LinkButton>
                <LinkButton
                  href={ROUTES.bookings}
                  variant="ghost"
                  size="icon"
                  aria-label="Bookings"
                  className="text-muted-foreground"
                >
                  <CalendarDays className="h-5 w-5" />
                </LinkButton>
                <LinkButton
                  href={ROUTES.profile}
                  variant="ghost"
                  className="gap-2 px-3 text-muted-foreground"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                    {(user?.profile?.firstName ?? "U").charAt(0)}
                  </span>
                  <span className="max-w-[100px] truncate text-sm font-medium text-foreground">
                    {user?.profile?.firstName ?? "Profile"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
                </LinkButton>
                {isHost ? (
                  <>
                    <LinkButton href={ROUTES.hostDashboard} variant="outline" size="sm">
                      Host
                    </LinkButton>
                    <LinkButton href={ROUTES.createEvent} variant="gradient" size="sm">
                      Create Event
                    </LinkButton>
                  </>
                ) : (
                  <LinkButton href={ROUTES.becomeHost} variant="outline" size="sm">
                    Host
                  </LinkButton>
                )}
              </>
            ) : (
              <>
                <LinkButton href={ROUTES.login} variant="ghost">
                  Log in
                </LinkButton>
                <LinkButton href={ROUTES.register} variant="gradient">
                  Join Now
                </LinkButton>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="icon"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls={MOBILE_MENU_ID}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            id={MOBILE_MENU_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border/60 bg-surface/95 backdrop-blur-xl lg:hidden"
          >
            <Container className="flex flex-col gap-4 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-medium">Notifications</span>
                      <NotificationBadgeLink />
                    </div>
                    <LinkButton
                      href={ROUTES.savedEvents}
                      variant="outline"
                      onClick={() => setMobileOpen(false)}
                    >
                      Saved events
                    </LinkButton>
                    <LinkButton
                      href={ROUTES.bookings}
                      variant="outline"
                      onClick={() => setMobileOpen(false)}
                    >
                      Bookings
                    </LinkButton>
                    <LinkButton
                      href={ROUTES.profile}
                      variant="outline"
                      onClick={() => setMobileOpen(false)}
                    >
                      <User className="h-4 w-4" aria-hidden />
                      Profile
                    </LinkButton>
                    {isHost ? (
                      <>
                        <LinkButton
                          href={ROUTES.hostDashboard}
                          variant="outline"
                          onClick={() => setMobileOpen(false)}
                        >
                          Host dashboard
                        </LinkButton>
                        <LinkButton
                          href={ROUTES.createEvent}
                          variant="gradient"
                          onClick={() => setMobileOpen(false)}
                        >
                          Create Event
                        </LinkButton>
                      </>
                    ) : (
                      <LinkButton
                        href={ROUTES.becomeHost}
                        variant="outline"
                        onClick={() => setMobileOpen(false)}
                      >
                        Become a Host
                      </LinkButton>
                    )}
                  </>
                ) : (
                  <>
                    <LinkButton
                      href={ROUTES.login}
                      variant="outline"
                      onClick={() => setMobileOpen(false)}
                    >
                      Log in
                    </LinkButton>
                    <LinkButton
                      href={ROUTES.register}
                      variant="gradient"
                      onClick={() => setMobileOpen(false)}
                    >
                      Join Now
                    </LinkButton>
                  </>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
