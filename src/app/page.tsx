import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { TrustSection } from "@/components/home/trust-section";
import { NotForSection } from "@/components/home/not-for-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />
        <TrustSection />
        <NotForSection />
      </main>

      <Footer />
    </div>
  );
}
