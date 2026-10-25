import type { Metadata } from "next";
import { SITE } from "@/constants/site";

const DEFAULT_OG_PATH = "/opengraph-image";

export function buildPageMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  image?: string;
}): Metadata {
  const url = `${SITE.url}${path}`;
  const desc = description ?? SITE.description;
  const ogImage = image ?? `${SITE.url}${DEFAULT_OG_PATH}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_IN",
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
