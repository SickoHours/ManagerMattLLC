import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-page">
        <div className="container-wide mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto prose prose-neutral">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
