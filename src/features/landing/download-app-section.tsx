"use client";

import { Apple, Smartphone } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/animations/motion-section";
import { buttonVariants } from "@/components/core/button";
import { Section, SectionHeader } from "@/components/layout/section";
import { APP_LINKS } from "@/constants/site";
import { cn } from "@/lib/utils";

export function DownloadAppSection() {
  return (
    <Section id="download">
      <div className="rounded-[28px] border border-border bg-surface p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
        <SectionHeader
          align="left"
          eyebrow="Mobile app"
          title="Take Cirvia everywhere"
          description="Discover events, manage bookings, and stay connected with your community — all from your phone."
          className="mb-0 lg:max-w-xl"
        />

        <StaggerGrid className="mt-8 flex flex-col gap-4 sm:flex-row lg:mt-0">
          <StaggerItem>
            <a
              href={APP_LINKS.ios}
              aria-label="Download on the App Store"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
            >
              <Apple className="h-5 w-5" aria-hidden />
              App Store
            </a>
          </StaggerItem>
          <StaggerItem>
            <a
              href={APP_LINKS.android}
              aria-label="Get it on Google Play"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
            >
              <Smartphone className="h-5 w-5" aria-hidden />
              Google Play
            </a>
          </StaggerItem>
        </StaggerGrid>
      </div>
    </Section>
  );
}
