import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { LaborSection } from "@/components/home/labor-section";
import { EvidenceSection } from "@/components/home/evidence-section";
import { ProcessSectionHorizontal } from "@/components/home/process-section-horizontal";
import { SafetySection } from "@/components/home/safety-section";
import { QualificationsSection } from "@/components/home/qualifications-section";
import { CommunicationSection } from "@/components/home/communication-section";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";
import { AnimationProvider } from "@/components/providers/animation-provider";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { NoiseOverlay } from "@/components/animations/noise-overlay";

export default function HomePage() {
  return (
    <AnimationProvider>
      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Film grain texture overlay */}
      <NoiseOverlay />

      <div className="min-h-screen flex flex-col bg-[#020202]">
        <Header />

        <main className="flex-1">
          {/* The Confession */}
          <Hero />

          {/* Why This Matters - The Economics */}
          <LaborSection />

          {/* Proof It Works */}
          <EvidenceSection />

          {/* How We Work Together - Horizontal Scroll */}
          <ProcessSectionHorizontal />

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
    </AnimationProvider>
  );
}
