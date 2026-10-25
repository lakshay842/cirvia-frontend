import type { MetadataRoute } from "next";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";

const STATIC_PATHS = [
  ROUTES.home,
  ROUTES.discover,
  ROUTES.about,
  ROUTES.becomeHost,
  ROUTES.contact,
  ROUTES.faq,
  ROUTES.pricing,
  ROUTES.safety,
  ROUTES.trust,
  ROUTES.privacy,
  ROUTES.terms,
  ROUTES.login,
  ROUTES.register,
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return STATIC_PATHS.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: path === ROUTES.home || path === ROUTES.discover ? "daily" : "weekly",
    priority: path === ROUTES.home ? 1 : path === ROUTES.discover ? 0.9 : 0.7,
  }));
}
