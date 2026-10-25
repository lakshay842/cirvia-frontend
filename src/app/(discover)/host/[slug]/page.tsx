import type { Metadata } from "next";
import { HostProfilePage } from "@/features/host/host-profile-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Host — ${slug.replace(/-/g, " ")}` };
}

export default async function HostPage({ params }: PageProps) {
  const { slug } = await params;
  return <HostProfilePage slug={slug} />;
}
