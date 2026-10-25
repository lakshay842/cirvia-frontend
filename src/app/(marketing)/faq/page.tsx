import {
  StaticContentPage,
  buildStaticMetadata,
} from "@/components/content/static-content-page";
import { ROUTES } from "@/constants/routes";

export const metadata = buildStaticMetadata(
  "FAQ",
  "Frequently asked questions about Cirvia events, bookings, and hosting.",
);

export default function FaqPage() {
  return (
    <StaticContentPage
      title="Frequently asked questions"
      description="Quick answers to common questions about Cirvia."
      sections={[
        {
          heading: "How do I book an event?",
          paragraphs: [
            "Browse events on Discover, open an event page, and sign in to book. Paid events require checkout before your spot is confirmed.",
          ],
        },
        {
          heading: "Do I need to verify my identity?",
          paragraphs: [
            "Verification is required for booking and hosting. It helps keep gatherings safe and builds trust across the community.",
          ],
        },
        {
          heading: "How do host payouts work?",
          paragraphs: [
            "After your event ends, earnings move from pending to available balance. Add a verified bank account, then request a withdrawal from your host wallet.",
          ],
        },
      ]}
      cta={{ label: "See more on the homepage", href: `${ROUTES.home}#faq` }}
    />
  );
}
