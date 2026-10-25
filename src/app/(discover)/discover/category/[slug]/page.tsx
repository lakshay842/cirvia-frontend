import type { Metadata } from "next";
import { DiscoverPage } from "@/features/discover/discover-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} Events` };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <DiscoverPage initialCategory={slug} />;
}
