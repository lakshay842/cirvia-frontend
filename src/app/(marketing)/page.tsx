import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/landing-page";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: SITE.tagline,
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
};

export default function HomePage() {
  return <LandingPage />;
}
