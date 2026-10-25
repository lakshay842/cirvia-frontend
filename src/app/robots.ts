import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/host/", "/bookings/", "/profile", "/settings", "/notifications", "/saved", "/recently-viewed"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
