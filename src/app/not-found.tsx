import type { Metadata } from "next";
import { Home, Search } from "lucide-react";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { SkipLink } from "@/components/layout/skip-link";
import { ROUTES } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Page not found",
  description: "The page you are looking for does not exist or has been moved.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <>
      <SkipLink />
      <div className="flex min-h-screen items-center justify-center bg-background pt-20">
        <Container className="py-20 text-center">
          <p
            className="text-8xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            aria-hidden
          >
            404
          </p>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LinkButton href={ROUTES.home} variant="gradient">
              <Home className="h-4 w-4" aria-hidden />
              Back to home
            </LinkButton>
            <LinkButton href={ROUTES.discover} variant="outline">
              <Search className="h-4 w-4" aria-hidden />
              Explore events
            </LinkButton>
          </div>
        </Container>
      </div>
    </>
  );
}
