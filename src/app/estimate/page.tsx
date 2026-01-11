"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Wizard } from "@/components/estimate/wizard";
import { MiniWizard } from "@/components/estimate/mini-wizard";
import { EstimateConfig } from "@/lib/mock-data";

export default function EstimatePage() {
  const [showFullWizard, setShowFullWizard] = useState(false);
  const [preset, setPreset] = useState<Partial<EstimateConfig> | undefined>(undefined);

  const handleStartFull = (presetConfig?: Partial<EstimateConfig>) => {
    setPreset(presetConfig);
    setShowFullWizard(true);
  };

  const handleBackToMini = () => {
    setShowFullWizard(false);
    setPreset(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12 pb-24 lg:pb-12">
        <div className="container-wide mx-auto px-4 md:px-8">
          {!showFullWizard ? (
            <>
              {/* Mini-wizard header */}
              <div className="mb-8 md:mb-12 text-center">
                <h1 className="text-h1 text-foreground">Get a Quick Estimate</h1>
                <p className="mt-3 text-body text-secondary-custom max-w-2xl mx-auto">
                  Answer 3 quick questions to get a rough estimate in seconds.
                  You can refine it later with our detailed configurator.
                </p>
              </div>

              {/* Mini-wizard */}
              <MiniWizard onStartFull={handleStartFull} />

              {/* Skip to full wizard option */}
              <div className="text-center mt-12 pt-8 border-t border-border-default">
                <p className="text-body-sm text-secondary-custom mb-3">
                  Already know what you need?
                </p>
                <button
                  onClick={() => handleStartFull()}
                  className="text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  Skip to detailed configurator →
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Full wizard header */}
              <div className="mb-8 md:mb-12">
                <button
                  onClick={handleBackToMini}
                  className="inline-flex items-center gap-2 text-secondary-custom hover:text-foreground transition-colors mb-4"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to quick estimate
                </button>
                <h1 className="text-h1 text-foreground">Configure Your Build</h1>
                <p className="mt-3 text-body text-secondary-custom max-w-2xl">
                  Answer a few questions and get a transparent estimate. Every
                  assumption is visible, and you can adjust as needed.
                </p>
              </div>

              {/* Full wizard */}
              <Wizard initialConfig={preset} />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
