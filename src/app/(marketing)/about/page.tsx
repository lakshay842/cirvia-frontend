import {
  StaticContentPage,
  buildStaticMetadata,
} from "@/components/content/static-content-page";
import { ROUTES } from "@/constants/routes";

export const metadata = buildStaticMetadata(
  "About Cirvia",
  "Learn how Cirvia helps people discover verified gatherings and build real-world connections.",
);

export default function AboutPage() {
  return (
    <StaticContentPage
      title="About Cirvia"
      description="Cirvia is a premium verified social discovery platform for meaningful offline gatherings."
      sections={[
        {
          paragraphs: [
            "We connect people through curated events hosted by verified community members. Every gathering on Cirvia is designed to help you meet like-minded people in a safe, welcoming environment.",
          ],
        },
        {
          heading: "Our mission",
          paragraphs: [
            "We believe real connection happens offline. Cirvia makes it easy to discover gatherings, book with confidence, and build trust through verification and transparent reviews.",
          ],
        },
      ]}
      cta={{ label: "Discover events", href: ROUTES.discover }}
    />
  );
}
