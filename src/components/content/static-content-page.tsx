import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";

export interface StaticPageSection {
  heading?: string;
  paragraphs: string[];
}

export interface StaticPageProps {
  title: string;
  description: string;
  sections: StaticPageSection[];
  cta?: { label: string; href: string };
}

export function StaticContentPage({ title, description, sections, cta }: StaticPageProps) {
  return (
    <Container className="max-w-3xl py-24">
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{description}</p>

      <div className="mt-10 space-y-8">
        {sections.map((section, index) => (
          <section key={section.heading ?? index}>
            {section.heading && (
              <h2 className="text-xl font-semibold text-foreground">{section.heading}</h2>
            )}
            <div className={section.heading ? "mt-3 space-y-3" : "space-y-3"}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {cta && (
        <p className="mt-10">
          <Link href={cta.href} className="font-medium text-primary hover:underline">
            {cta.label}
          </Link>
        </p>
      )}
    </Container>
  );
}

export function buildStaticMetadata(title: string, description: string): Metadata {
  return { title, description };
}

export { ROUTES };
