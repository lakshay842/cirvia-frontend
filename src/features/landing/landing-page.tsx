import { HeroSection } from "@/features/landing/hero-section";
import { StatsBar } from "@/features/landing/stats-bar";
import { CategoriesSection } from "@/features/landing/categories-section";
import { FeaturedEventsSection } from "@/features/landing/featured-events-section";
import { WhyCirviaSection } from "@/features/landing/why-cirvia-section";
import { TrendingEventsSection } from "@/features/landing/trending-events-section";
import { HostCtaSection } from "@/features/landing/host-cta-section";
import { DownloadAppSection } from "@/features/landing/download-app-section";
import { TestimonialsSection } from "@/features/landing/testimonials-section";
import { FaqSection } from "@/features/landing/faq-section";
import { ContactSection } from "@/features/landing/contact-section";
import { NewsletterSection } from "@/features/landing/newsletter-section";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <CategoriesSection />
      <FeaturedEventsSection />
      <WhyCirviaSection />
      <TrendingEventsSection />
      <HostCtaSection />
      <DownloadAppSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
      <NewsletterSection />
    </>
  );
}
