"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { Section, SectionHeader } from "@/components/layout/section";
import {
  newsletterSchema,
  useNewsletterSubscribe,
  type NewsletterFormValues,
} from "@/hooks/useNewsletter";

export function NewsletterSection() {
  const mutation = useNewsletterSubscribe();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch {
      // API not yet available
    }
  });

  return (
    <Section id="newsletter">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeader
          eyebrow="Newsletter"
          title="Stay in the loop"
          description="Get updates on new cities, featured events, and platform news."
        />

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          noValidate
        >
          <div className="flex-1 space-y-2 text-left">
            <Label htmlFor="newsletter-email" className="sr-only">
              Email address
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <Button type="submit" variant="gradient" loading={mutation.isPending} className="shrink-0">
            <Send className="h-4 w-4" aria-hidden />
            Subscribe
          </Button>
        </form>

        {mutation.isError && (
          <div
            className="mx-auto mt-4 flex max-w-md items-start gap-2 rounded-[18px] border border-warning/30 bg-warning/10 p-4 text-left text-sm text-foreground"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
            <p>
              Newsletter subscription API is not yet available. CMS module pending on
              backend.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
