"use client";

import {
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/animations/motion-section";
import { Section, SectionHeader } from "@/components/layout/section";
import { WHY_CIRVIA } from "@/constants/site";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  zap: Zap,
};

const TONE_STYLES: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  accent: "bg-accent/10 text-accent",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export function WhyCirviaSection() {
  return (
    <Section id="why-cirvia" className="bg-muted/40">
      <SectionHeader
        title="Why Cirvia?"
        description="We're not another social app. We're a platform where verified people create meaningful real-world experiences."
      />

      <StaggerGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_CIRVIA.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? Sparkles;
          return (
            <StaggerItem key={item.title}>
              <div className="h-full rounded-[24px] border border-border/60 bg-surface p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(109,94,252,0.1)]">
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl",
                    TONE_STYLES[item.tone] ?? TONE_STYLES.primary,
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGrid>
    </Section>
  );
}
