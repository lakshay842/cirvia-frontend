import type { Metadata } from "next";
import { BecomeHostPage } from "@/features/host/become-host-page";

export const metadata: Metadata = {
  title: "Become a Host",
  description: "Apply to host verified gatherings on Cirvia.",
};

export default function BecomeHostRoutePage() {
  return <BecomeHostPage />;
}
