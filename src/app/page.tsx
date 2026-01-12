import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { EvidenceSection } from "@/components/home/evidence-section";
import { ProcessSection } from "@/components/home/process-section";
import { QualificationsSection } from "@/components/home/qualifications-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#020202]">
      <Header />

      <main className="flex-1">
        <Hero />
        <EvidenceSection />
        <ProcessSection />
        <QualificationsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
