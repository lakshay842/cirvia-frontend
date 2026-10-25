"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/section";
import { FAQ_ITEMS } from "@/constants/faq";
import { cn } from "@/lib/utils";

export function FaqSection() {
  return (
    <Section id="faq">
      <SectionHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know about Cirvia."
      />

      <Accordion.Root
        type="single"
        collapsible
        className="mx-auto max-w-3xl divide-y divide-border rounded-[24px] border border-border bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
      >
        {FAQ_ITEMS.map((item) => (
          <Accordion.Item key={item.id} value={item.id} className="px-6">
            <Accordion.Header>
              <Accordion.Trigger
                className={cn(
                  "group flex w-full items-center justify-between py-5 text-left text-base font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                )}
              >
                {item.question}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Section>
  );
}
