import {
  StaticContentPage,
  buildStaticMetadata,
} from "@/components/content/static-content-page";
import { ROUTES } from "@/constants/routes";

export const metadata = buildStaticMetadata(
  "Safety",
  "How Cirvia keeps gatherings safe with verification, trust scores, and community standards.",
);

export default function SafetyPage() {
  return (
    <StaticContentPage
      title="Safety"
      description="Your safety is central to every Cirvia experience."
      sections={[
        {
          paragraphs: [
            "All hosts and members go through identity verification. Events include clear rules, capacity limits, and reporting tools so you can participate with confidence.",
          ],
        },
        {
          heading: "Community standards",
          paragraphs: [
            "We enforce policies against harassment, fraud, and unsafe behavior. Hosts can set age requirements, approval flows, and house rules for every event.",
          ],
        },
      ]}
      cta={{ label: "Read trust & safety details", href: ROUTES.trust }}
    />
  );
}
