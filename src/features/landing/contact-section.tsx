"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { Textarea } from "@/components/core/textarea";
import { Section, SectionHeader } from "@/components/layout/section";
import {
  contactFormSchema,
  useContactSubmit,
  type ContactFormValues,
} from "@/hooks/useContact";

export function ContactSection() {
  const mutation = useContactSubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch {
      // API not yet available — error shown in UI
    }
  });

  return (
    <Section id="contact" className="bg-muted/40">
      <SectionHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Have a question or partnership inquiry? We'd love to hear from you."
      />

      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
              <Mail className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="font-medium text-foreground">Email</p>
              <a
                href="mailto:hello@cirvia.com"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                hello@cirvia.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
              <Phone className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="font-medium text-foreground">Support</p>
              <p className="text-sm text-muted-foreground">Mon–Fri, 9am–6pm IST</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="font-medium text-foreground">Headquarters</p>
              <p className="text-sm text-muted-foreground">Bangalore, India</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-[24px] border border-border bg-surface p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] lg:col-span-3"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-subject">Subject</Label>
            <Input id="contact-subject" placeholder="How can we help?" error={errors.subject?.message} {...register("subject")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea id="contact-message" placeholder="Tell us more..." error={errors.message?.message} {...register("message")} />
          </div>

          {mutation.isError && (
            <div className="flex items-start gap-2 rounded-[18px] border border-warning/30 bg-warning/10 p-4 text-sm text-foreground" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
              <p>
                Contact form submission is not yet connected to the backend. Support API
                module is pending — your message was not sent.
              </p>
            </div>
          )}

          {mutation.isSuccess && (
            <div className="flex items-center gap-2 rounded-[18px] border border-success/30 bg-success/10 p-4 text-sm text-foreground" role="status">
              <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />
              Message sent successfully.
            </div>
          )}

          <Button type="submit" variant="gradient" loading={mutation.isPending} className="w-full sm:w-auto">
            Send message
          </Button>
        </form>
      </div>
    </Section>
  );
}
