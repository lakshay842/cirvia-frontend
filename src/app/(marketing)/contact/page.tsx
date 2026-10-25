import {
  StaticContentPage,
  buildStaticMetadata,
} from "@/components/content/static-content-page";
import { ROUTES } from "@/constants/routes";

export const metadata = buildStaticMetadata(
  "Contact",
  "Get in touch with the Cirvia team.",
);

export default function ContactPage() {
  return (
    <StaticContentPage
      title="Contact us"
      description="Questions about hosting, bookings, or your account? We're here to help."
      sections={[
        {
          paragraphs: [
            "Email us at support@cirvia.com for account, payment, or safety concerns. For urgent safety issues related to an active event, use the in-app report feature on the event page.",
          ],
        },
        {
          heading: "Response times",
          paragraphs: [
            "We aim to respond to support requests within one business day. Verification and payout reviews may take longer depending on queue volume.",
          ],
        },
      ]}
      cta={{ label: "Visit homepage contact section", href: `${ROUTES.home}#contact` }}
    />
  );
}
