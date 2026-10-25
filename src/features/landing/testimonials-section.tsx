"use client";

import { StaggerGrid, StaggerItem } from "@/components/animations/motion-section";
import { Section, SectionHeader } from "@/components/layout/section";
import { TESTIMONIALS } from "@/constants/testimonials";

export function TestimonialsSection() {
  return (
    <Section id="testimonials" className="bg-muted/40">
      <SectionHeader
        eyebrow="Community voices"
        title="Loved by verified members"
        description="Real stories from people who found their community on Cirvia."
      />

      <StaggerGrid className="grid gap-6 sm:grid-cols-2">
        {TESTIMONIALS.map((testimonial) => (
          <StaggerItem key={testimonial.id}>
            <blockquote className="flex h-full flex-col rounded-[24px] border border-border/60 bg-surface p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <p className="flex-1 text-base leading-relaxed text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white"
                  aria-hidden
                >
                  {testimonial.avatarInitials}
                </div>
                <div>
                  <cite className="not-italic font-semibold text-foreground">
                    {testimonial.name}
                  </cite>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </footer>
            </blockquote>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </Section>
  );
}
