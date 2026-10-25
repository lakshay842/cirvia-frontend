import { SkipLink } from "@/components/layout/skip-link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/navigation/navbar";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
