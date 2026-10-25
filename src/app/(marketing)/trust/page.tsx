import {
  StaticContentPage,
  buildStaticMetadata,
} from "@/components/content/static-content-page";

export const metadata = buildStaticMetadata(
  "Trust & Safety",
  "Verification, reviews, and moderation practices that keep the Cirvia community trustworthy.",
);

export default function TrustPage() {
  return (
    <StaticContentPage
      title="Trust & Safety"
      description="Cirvia is built on verified identities, transparent reviews, and responsive moderation."
      sections={[
        {
          paragraphs: [
            "Members complete KYC verification before booking or hosting. Trust scores reflect account history, verification status, and community feedback.",
          ],
        },
        {
          heading: "Reviews & moderation",
          paragraphs: [
            "Only verified attendees can leave reviews after completed events. Our team moderates reported content and can suspend hosts or events that violate platform policies.",
          ],
        },
      ]}
    />
  );
}
