import {
  StaticContentPage,
  buildStaticMetadata,
} from "@/components/content/static-content-page";
import { ROUTES } from "@/constants/routes";

export const metadata = buildStaticMetadata(
  "Pricing",
  "Simple, transparent pricing for hosts and guests on Cirvia.",
);

export default function PricingPage() {
  return (
    <StaticContentPage
      title="Pricing"
      description="Joining events is straightforward. Hosts pay a platform fee only when they earn."
      sections={[
        {
          heading: "For guests",
          paragraphs: [
            "Browsing and discovering events is free. You only pay the ticket price set by the host when you book a paid gathering.",
          ],
        },
        {
          heading: "For hosts",
          paragraphs: [
            "Listing events is free. Cirvia charges a small platform fee on successful paid bookings. Payouts are processed after your event completes and your bank account is verified.",
          ],
        },
      ]}
      cta={{ label: "Become a host", href: ROUTES.becomeHost }}
    />
  );
}
