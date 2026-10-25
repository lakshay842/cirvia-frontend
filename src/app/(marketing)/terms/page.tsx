import {
  StaticContentPage,
  buildStaticMetadata,
} from "@/components/content/static-content-page";

export const metadata = buildStaticMetadata(
  "Terms of Service",
  "Terms governing your use of the Cirvia platform.",
);

export default function TermsPage() {
  return (
    <StaticContentPage
      title="Terms of Service"
      description="Last updated: June 2025"
      sections={[
        {
          paragraphs: [
            "By using Cirvia you agree to these terms. You must be at least 18 years old and provide accurate information when creating an account or hosting an event.",
          ],
        },
        {
          heading: "Bookings & payments",
          paragraphs: [
            "Ticket purchases are subject to each event's cancellation policy. Hosts are responsible for delivering the experience described in their listing.",
          ],
        },
        {
          heading: "Acceptable use",
          paragraphs: [
            "You may not use Cirvia for unlawful activity, harassment, or misrepresentation. We may suspend accounts that violate these terms or community guidelines.",
          ],
        },
      ]}
    />
  );
}
