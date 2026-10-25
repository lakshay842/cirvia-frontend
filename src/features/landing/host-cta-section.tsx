"use client";

import { ArrowRight, Mic } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { LinkButton } from "@/components/core/link-button";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";

export function HostCtaSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="become-host" className="py-16 sm:py-20 lg:py-24">
      <Container>
        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-primary/15 bg-gradient-to-br from-primary/15 via-surface to-accent/10 p-8 shadow-[0_16px_48px_rgba(109,94,252,0.08)] sm:p-12 lg:p-16"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/20 text-primary">
              <Mic className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Share your passion. Host a gathering.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether it&apos;s a book club, networking dinner, or photography walk — bring
              your community together on Cirvia.
            </p>
            <LinkButton href={ROUTES.becomeHost} variant="gradient" size="lg" className="mt-8">
              Become a Host
              <ArrowRight className="h-5 w-5" aria-hidden />
            </LinkButton>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
          />
        </motion.div>
      </Container>
    </section>
  );
}
