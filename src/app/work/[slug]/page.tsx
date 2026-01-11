import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

// Case study data - in production this would come from a CMS or database
const caseStudies: Record<
  string,
  {
    title: string;
    category: string;
    description: string;
    challenge: string;
    approach: string[];
    outcome: { metric: string; value: string }[];
    modules: string[];
    timeline: string;
    quality: string;
    tech: string[];
  }
> = {
  "saas-dashboard": {
    title: "SaaS Analytics Dashboard",
    category: "Web Application",
    description:
      "A real-time analytics dashboard for a B2B SaaS company, processing millions of events daily with sub-second query response times.",
    challenge:
      "The client's existing analytics solution was slow, expensive, and couldn't handle their growing data volume. Customer success teams were spending hours waiting for reports to load, and the engineering team was overwhelmed with custom report requests.",
    approach: [
      "Designed a new data pipeline using event streaming to reduce query latency",
      "Built a custom dashboard builder allowing non-technical users to create reports",
      "Implemented smart caching and pre-aggregation for common queries",
      "Created role-based access controls for sensitive data",
    ],
    outcome: [
      { metric: "Query Speed", value: "95% faster" },
      { metric: "Support Tickets", value: "-50%" },
      { metric: "Self-Service Reports", value: "200+/month" },
    ],
    modules: ["Dashboard", "Analytics", "API", "Database"],
    timeline: "6 weeks",
    quality: "Production",
    tech: ["Next.js", "PostgreSQL", "Redis", "TimescaleDB"],
  },
  "mobile-marketplace": {
    title: "Mobile Marketplace App",
    category: "Mobile Application",
    description:
      "Cross-platform mobile app connecting local service providers with customers, featuring real-time chat and booking.",
    challenge:
      "A startup needed to validate their marketplace concept quickly. They wanted an iOS and Android app that could handle real-time messaging, payments, and scheduling without building two separate apps.",
    approach: [
      "Used React Native for cross-platform development to ship faster",
      "Integrated Stripe Connect for marketplace payments",
      "Built real-time chat with presence indicators and typing status",
      "Implemented push notifications for booking updates and messages",
    ],
    outcome: [
      { metric: "Downloads", value: "10,000+ in month 1" },
      { metric: "Bookings", value: "500+ completed" },
      { metric: "App Rating", value: "4.7 stars" },
    ],
    modules: ["Auth", "Chat", "Payments", "Push Notifications"],
    timeline: "8 weeks",
    quality: "MVP",
    tech: ["React Native", "Node.js", "Firebase", "Stripe"],
  },
  "automation-platform": {
    title: "Workflow Automation Platform",
    category: "Internal Tool",
    description:
      "Custom automation platform that reduced manual data entry by 90% through intelligent form processing and API integrations.",
    challenge:
      "The operations team was spending 40+ hours per week on manual data entry between systems. They needed a solution that could connect their existing tools and automate repetitive tasks without replacing their entire tech stack.",
    approach: [
      "Built a visual workflow builder for non-technical users",
      "Created integrations with their existing CRM, ERP, and accounting software",
      "Implemented smart form recognition for document processing",
      "Added monitoring dashboard with error alerts and retry logic",
    ],
    outcome: [
      { metric: "Time Saved", value: "40 hours/week" },
      { metric: "Error Rate", value: "-85%" },
      { metric: "ROI", value: "6 weeks" },
    ],
    modules: ["Integrations", "Workflows", "Dashboard", "API"],
    timeline: "4 weeks",
    quality: "Production",
    tech: ["TypeScript", "Node.js", "PostgreSQL", "Bull"],
  },
  "ecommerce-redesign": {
    title: "E-commerce Platform Redesign",
    category: "Web Application",
    description:
      "Complete frontend redesign of an e-commerce platform, improving conversion rates through better UX and performance optimization.",
    challenge:
      "An established e-commerce company was losing customers due to a slow, outdated website. Their conversion rate was well below industry average, and mobile users were abandoning carts at alarming rates.",
    approach: [
      "Conducted UX audit to identify friction points in the checkout flow",
      "Rebuilt frontend with Next.js for better performance",
      "Implemented predictive search and smart recommendations",
      "Optimized images and added lazy loading for faster page loads",
    ],
    outcome: [
      { metric: "Conversion Rate", value: "+35%" },
      { metric: "Page Load Time", value: "-60%" },
      { metric: "Mobile Revenue", value: "+45%" },
    ],
    modules: ["Cart", "Checkout", "Products", "Search"],
    timeline: "5 weeks",
    quality: "Production",
    tech: ["Next.js", "React", "Tailwind CSS", "Algolia"],
  },
};

export async function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies[slug];

  if (!study) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-secondary-custom hover:text-foreground transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Work
            </Link>

            <div className="max-w-3xl">
              <span className="text-accent font-medium">{study.category}</span>
              <h1 className="text-h1 text-foreground mt-2 mb-4">{study.title}</h1>
              <p className="text-body-lg text-secondary-custom">{study.description}</p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-border-default">
                <div>
                  <p className="text-body-sm text-secondary-custom">Timeline</p>
                  <p className="text-body font-semibold text-foreground">{study.timeline}</p>
                </div>
                <div>
                  <p className="text-body-sm text-secondary-custom">Quality</p>
                  <p className="text-body font-semibold text-foreground">{study.quality}</p>
                </div>
                <div>
                  <p className="text-body-sm text-secondary-custom">Tech Stack</p>
                  <p className="text-body font-semibold text-foreground">{study.tech.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge */}
        <section className="py-16 md:py-20 bg-subtle">
          <div className="container-wide mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 text-foreground mb-6">The Challenge</h2>
              <p className="text-body text-secondary-custom">{study.challenge}</p>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="py-16 md:py-20 bg-page">
          <div className="container-wide mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 text-foreground mb-6">Our Approach</h2>
              <ul className="space-y-4">
                {study.approach.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-body text-secondary-custom pt-1">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Modules */}
        <section className="py-16 md:py-20 bg-subtle">
          <div className="container-wide mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 text-foreground mb-6">Modules Used</h2>
              <div className="flex flex-wrap gap-3">
                {study.modules.map((module, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-surface rounded-lg text-body text-foreground border border-border-default"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Outcome */}
        <section className="py-16 md:py-20 bg-page">
          <div className="container-wide mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 text-foreground mb-8">The Outcome</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {study.outcome.map((item, index) => (
                  <div
                    key={index}
                    className="bg-surface rounded-xl p-6 border border-border-default text-center"
                  >
                    <p className="text-h2 text-success font-bold">{item.value}</p>
                    <p className="text-body text-secondary-custom mt-1">{item.metric}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-subtle">
          <div className="container-wide mx-auto px-6 text-center">
            <h2 className="text-h2 text-foreground mb-4">Want Similar Results?</h2>
            <p className="text-body text-secondary-custom mb-8 max-w-xl mx-auto">
              Get an instant estimate for your project and see what we can build together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center h-12 px-8 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
              >
                Start Your Estimate
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center h-12 px-8 bg-surface text-foreground rounded-lg font-medium border border-border-default hover:bg-subtle transition-colors"
              >
                See More Work
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
