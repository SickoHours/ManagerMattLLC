"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { InquiryForm } from "@/components/estimate/inquiry-form";

export default function EstimatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <InquiryForm />
      </main>

      <Footer />
    </div>
  );
}
