import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

const packages = [
  {
    name: "Prototype",
    description: "Validate your idea quickly",
    priceRange: "$2,000 - $8,000",
    timeline: "1-2 weeks",
    features: [
      "Core functionality only",
      "Basic UI/UX",
      "Single platform",
      "Limited error handling",
      "No production deployment",
    ],
    ideal: "Testing ideas before investing",
    cta: "Start Estimate",
  },
  {
    name: "MVP",
    description: "Launch your product",
    priceRange: "$8,000 - $35,000",
    timeline: "2-6 weeks",
    featured: true,
    features: [
      "Full feature set",
      "Polished UI/UX",
      "User authentication",
      "Error handling & logging",
      "Production deployment",
      "Basic analytics",
    ],
    ideal: "First version for real users",
    cta: "Start Estimate",
  },
  {
    name: "Production",
    description: "Scale with confidence",
    priceRange: "$35,000 - $100,000+",
    timeline: "6-12 weeks",
    features: [
      "Everything in MVP",
      "Performance optimization",
      "Comprehensive testing",
      "Security hardening",
      "Multi-environment setup",
      "Documentation & training",
    ],
    ideal: "Enterprise-ready applications",
    cta: "Start Estimate",
  },
];

const faqs = [
  {
    question: "How do estimates work?",
    answer:
      "Our AI-powered estimate tool analyzes your requirements and provides a P10/P50/P90 price range based on similar projects we've delivered. The wider the range, the more uncertainty in the scope.",
  },
  {
    question: "What if the project goes over estimate?",
    answer:
      "Minor overruns (under 15%) are on us. For larger variances, we'll re-estimate and get your approval before proceeding. You can always defer or descale scope to stay on budget.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes! We offer retainer packages for ongoing development, maintenance, and support. Ask us about monthly retainers starting at 20 hours/month.",
  },
  {
    question: "How do payments work?",
    answer:
      "We typically work with 50% upfront, 50% on delivery for smaller projects. Larger projects can be broken into milestone-based payments.",
  },
  {
    question: "Can I use my own designs?",
    answer:
      "Absolutely. If you have Figma designs or wireframes, we can implement them directly. Otherwise, we'll work with you on the design during discovery.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We specialize in modern web technologies: React, Next.js, TypeScript, Node.js, and various databases. For mobile, we use React Native for cross-platform apps.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6 text-center">
            <h1 className="text-h1 text-foreground mb-4">
              Transparent Pricing
            </h1>
            <p className="text-body-lg text-secondary-custom max-w-2xl mx-auto">
              No surprises. No hidden fees. Get an instant estimate for your project
              or explore our package options below.
            </p>
            <div className="mt-8">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center h-12 px-8 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
              >
                Get Instant Estimate
              </Link>
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-16 md:py-24 bg-subtle">
          <div className="container-wide mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-h2 text-foreground mb-4">Project Packages</h2>
              <p className="text-body text-secondary-custom max-w-xl mx-auto">
                Choose the quality level that matches your needs and budget.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`bg-surface rounded-2xl p-6 md:p-8 shadow-md ${
                    pkg.featured
                      ? "ring-2 ring-accent relative"
                      : "border border-border-default"
                  }`}
                >
                  {pkg.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-accent text-white text-body-sm font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-h3 text-foreground mb-2">{pkg.name}</h3>
                    <p className="text-body-sm text-secondary-custom mb-4">
                      {pkg.description}
                    </p>
                    <p className="text-h3 text-accent font-bold">
                      {pkg.priceRange}
                    </p>
                    <p className="text-body-sm text-secondary-custom mt-1">
                      {pkg.timeline}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-body-sm text-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-border-default">
                    <p className="text-body-sm text-secondary-custom mb-4">
                      <span className="font-medium text-foreground">Ideal for:</span>{" "}
                      {pkg.ideal}
                    </p>
                    <Link
                      href="/estimate"
                      className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                        pkg.featured
                          ? "bg-accent text-white hover:bg-accent-hover"
                          : "bg-subtle text-foreground hover:bg-subtle/80"
                      }`}
                    >
                      {pkg.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Retainers */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-h2 text-foreground mb-4">Monthly Retainers</h2>
                <p className="text-body text-secondary-custom">
                  Need ongoing development support? Our retainer packages give you
                  dedicated hours each month at a discounted rate.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface rounded-xl p-6 border border-border-default text-center">
                  <h3 className="text-h4 text-foreground mb-2">Starter</h3>
                  <p className="text-h3 text-accent font-bold mb-1">$2,500</p>
                  <p className="text-body-sm text-secondary-custom">20 hours/month</p>
                </div>
                <div className="bg-surface rounded-xl p-6 border border-accent text-center">
                  <h3 className="text-h4 text-foreground mb-2">Growth</h3>
                  <p className="text-h3 text-accent font-bold mb-1">$4,500</p>
                  <p className="text-body-sm text-secondary-custom">40 hours/month</p>
                </div>
                <div className="bg-surface rounded-xl p-6 border border-border-default text-center">
                  <h3 className="text-h4 text-foreground mb-2">Scale</h3>
                  <p className="text-h3 text-accent font-bold mb-1">$8,000</p>
                  <p className="text-body-sm text-secondary-custom">80 hours/month</p>
                </div>
              </div>

              <p className="text-center text-body-sm text-secondary-custom mt-6">
                Unused hours roll over for up to 2 months. Cancel anytime with 30 days notice.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-subtle">
          <div className="container-wide mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-h2 text-foreground mb-4">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-surface rounded-xl p-6 border border-border-default"
                  >
                    <h3 className="text-body font-semibold text-foreground mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-body-sm text-secondary-custom">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6 text-center">
            <h2 className="text-h2 text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-body text-secondary-custom mb-8 max-w-xl mx-auto">
              Get an instant estimate for your project in under 2 minutes.
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
