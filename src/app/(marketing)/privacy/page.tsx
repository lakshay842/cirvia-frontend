import {
  StaticContentPage,
  buildStaticMetadata,
} from "@/components/content/static-content-page";

export const metadata = buildStaticMetadata(
  "Privacy Policy",
  "How Cirvia collects, uses, and protects your personal information.",
);

export default function PrivacyPage() {
  return (
    <StaticContentPage
      title="Privacy Policy"
      description="Last updated: June 2025"
      sections={[
        {
          paragraphs: [
            "Cirvia collects information you provide when you register, verify your identity, book events, or contact support. We use this data to operate the platform, process payments, and keep our community safe.",
          ],
        },
        {
          heading: "Data we collect",
          paragraphs: [
            "This includes account details, verification documents, booking history, payment records, and device information used for security and fraud prevention.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "You can update profile settings, manage notification preferences, and request account deletion through your account settings or by contacting support.",
          ],
        },
      ]}
    />
  );
}
