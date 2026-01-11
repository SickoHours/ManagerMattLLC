import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | Manager Matt LLC",
  description: "Featured projects and case studies from Manager Matt LLC",
};

const projects = [
  {
    slug: "saas-dashboard",
    title: "SaaS Analytics Dashboard",
    category: "Web Application",
    description:
      "A real-time analytics dashboard for a B2B SaaS company, processing millions of events daily with sub-second query response times.",
    modules: ["Dashboard", "Analytics", "API", "Database"],
    outcome: "50% reduction in customer support tickets",
    timeline: "6 weeks",
    quality: "Production",
    image: "/work/saas-dashboard.jpg",
  },
  {
    slug: "mobile-marketplace",
    title: "Mobile Marketplace App",
    category: "Mobile Application",
    description:
      "Cross-platform mobile app connecting local service providers with customers, featuring real-time chat and booking.",
    modules: ["Auth", "Chat", "Payments", "Push Notifications"],
    outcome: "10,000+ downloads in first month",
    timeline: "8 weeks",
    quality: "MVP",
    image: "/work/mobile-marketplace.jpg",
  },
  {
    slug: "automation-platform",
    title: "Workflow Automation Platform",
    category: "Internal Tool",
    description:
      "Custom automation platform that reduced manual data entry by 90% through intelligent form processing and API integrations.",
    modules: ["Integrations", "Workflows", "Dashboard", "API"],
    outcome: "40 hours/week saved",
    timeline: "4 weeks",
    quality: "Production",
    image: "/work/automation-platform.jpg",
  },
  {
    slug: "ecommerce-redesign",
    title: "E-commerce Platform Redesign",
    category: "Web Application",
    description:
      "Complete frontend redesign of an e-commerce platform, improving conversion rates through better UX and performance optimization.",
    modules: ["Cart", "Checkout", "Products", "Search"],
    outcome: "35% increase in conversion rate",
    timeline: "5 weeks",
    quality: "Production",
    image: "/work/ecommerce-redesign.jpg",
  },
];

const qualityColors: Record<string, string> = {
  MVP: "bg-blue-100 text-blue-700",
  Production: "bg-purple-100 text-purple-700",
  Prototype: "bg-amber-100 text-amber-700",
};

export default function WorkPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6 text-center">
            <h1 className="text-h1 text-foreground mb-4">Our Work</h1>
            <p className="text-body-lg text-secondary-custom max-w-2xl mx-auto">
              A selection of projects we&apos;ve delivered. Each case study showcases our
              approach to solving real problems with software.
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 md:py-24 bg-subtle">
          <div className="container-wide mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="group bg-surface rounded-2xl overflow-hidden border border-border-default hover:border-accent/30 transition-all hover:shadow-lg"
                >
                  {/* Image placeholder */}
                  <div className="aspect-video bg-subtle flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-8 h-8 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                      </div>
                      <span className="text-body-sm text-secondary-custom">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-body-sm text-secondary-custom">
                        {project.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-body-sm font-medium ${qualityColors[project.quality]}`}
                      >
                        {project.quality}
                      </span>
                    </div>

                    <h3 className="text-h4 text-foreground mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-body-sm text-secondary-custom mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Modules */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.modules.slice(0, 4).map((module, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-subtle rounded text-body-sm text-secondary-custom"
                        >
                          {module}
                        </span>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border-default">
                      <div>
                        <p className="text-body-sm text-secondary-custom">
                          Timeline
                        </p>
                        <p className="text-body font-medium text-foreground">
                          {project.timeline}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-body-sm text-secondary-custom">
                          Outcome
                        </p>
                        <p className="text-body font-medium text-success">
                          {project.outcome}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6 text-center">
            <h2 className="text-h2 text-foreground mb-4">
              Ready to Build Something Great?
            </h2>
            <p className="text-body text-secondary-custom mb-8 max-w-xl mx-auto">
              Get an instant estimate for your project and see how we can help.
            </p>
            <Link
              href="/estimate"
              className="inline-flex items-center justify-center h-12 px-8 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Start Your Estimate
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
