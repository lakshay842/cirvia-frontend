import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { VerifyPhoneForm } from "@/features/auth/verify-phone-form";

export const metadata: Metadata = { title: "Verify phone" };

export default function VerifyPhonePage() {
  return (
    <div className="py-8">
      <Container className="max-w-md">
        <div className="rounded-[28px] border border-border bg-surface/80 p-6 shadow-lg backdrop-blur-sm sm:p-8">
          <VerifyPhoneForm />
        </div>
      </Container>
    </div>
  );
}
