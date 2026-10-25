"use client";

import { PageError } from "@/components/feedback/page-error";

export default function Error(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageError
      {...props}
      title="Authentication error"
      description="We couldn't load this page. Please try again or return home."
    />
  );
}
