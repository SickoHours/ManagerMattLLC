import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { LaborSection } from "@/components/home/labor-section";
import { EvidenceSection } from "@/components/home/evidence-section";
import { ProcessSection } from "@/components/home/process-section";
import { SafetySection } from "@/components/home/safety-section";
import { QualificationsSection } from "@/components/home/qualifications-section";
import { CommunicationSection } from "@/components/home/communication-section";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#020202]">
      <Header />

      <main className="flex-1">
        {/* The Confession */}
        <Hero />

        {/* Why This Matters - The Economics */}
        <LaborSection />

        {/* Proof It Works */}
        <EvidenceSection />

        {/* How We Work Together */}
        <ProcessSection />

        {/* Engineering Practices */}
        <SafetySection />

        {/* What I Bring */}
        <QualificationsSection />

        {/* What to Expect */}
        <CommunicationSection />

        {/* Answer Objections */}
        <FAQSection />

        {/* Final Push */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
