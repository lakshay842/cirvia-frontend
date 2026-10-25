import type { Metadata } from "next";
import { DiscoverPage } from "@/features/discover/discover-page";
import { ROUTES } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Discover Events",
  description: "Explore verified gatherings and real-world connections on Cirvia.",
  path: ROUTES.discover,
});

export default function DiscoverRoutePage() {
  return <DiscoverPage />;
}
