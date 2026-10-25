import type { Metadata } from "next";
import { VerificationPage } from "@/features/verification/verification-page";

export const metadata: Metadata = { title: "Identity verification" };

export default function ProfileVerificationRoutePage() {
  return <VerificationPage />;
}
