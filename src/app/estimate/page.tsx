import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Wizard } from "@/components/estimate/wizard";

export const metadata = {
  title: "Get Your Estimate | Manager Matt LLC",
  description:
    "Configure your build and get a transparent estimate with P10/P50/P90 ranges. See every assumption and cost driver.",
};

export default function EstimatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12 pb-24 lg:pb-12">
        <div className="container-wide mx-auto px-4 md:px-8">
          {/* Page header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-h1 text-foreground">Configure Your Build</h1>
            <p className="mt-3 text-body text-secondary-custom max-w-2xl">
              Answer a few questions and get a transparent estimate. Every
              assumption is visible, and you can adjust as needed.
            </p>
          </div>

          {/* Wizard */}
          <Wizard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
