import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | Manager Matt LLC",
  description:
    "Real projects we've shipped. From legal tech automation to clean living platforms.",
};

const projects = [
  {
    slug: "instachp",
    title: "InstaCHP",
    category: "Legal Tech SaaS",
    description:
      "Automated CHP traffic collision report retrieval for personal injury law firms. Features browser automation, AI voice calling, and a multi-role workflow system that handles 1000+ requests monthly.",
    modules: ["Playwright Automation", "AI Voice (VAPI)", "Real-time Dashboard", "Multi-user Roles"],
    outcome: "90% faster report retrieval",
    timeline: "10 weeks",
    quality: "Production",
    url: "https://instachp.com",
    stack: ["Next.js 15", "Convex", "Clerk", "SendGrid", "VAPI"],
    featured: true,
  },
  {
    slug: "purelist-market",
    title: "PureList Market",
    category: "Consumer Wellness",
    description:
      "Mobile-first product scanner and clean brand marketplace. Helps health-conscious consumers identify harmful ingredients and discover better alternatives through affiliate recommendations.",
    modules: ["Product Scanner", "Ingredient Database", "Brand Directory", "Affiliate Engine"],
    outcome: "168 brands cataloged",
    timeline: "In Development",
    quality: "MVP",
    url: null,
    stack: ["React Native", "Convex", "AI Scanning"],
    featured: true,
  },
  {
    slug: "chp-wrapper",
    title: "CHP Wrapper API",
    category: "Internal Tool",
    description:
      "Headless browser automation service that powers InstaCHP. Handles CHP portal authentication, search, verification, and secure PDF downloads with token-based access.",
    modules: ["Playwright", "REST API", "Token Auth", "PDF Processing"],
    outcome: "Powers 100% of InstaCHP requests",
    timeline: "4 weeks",
    quality: "Production",
    url: null,
    stack: ["Next.js", "Playwright", "Fly.io"],
    featured: false,
  },
  {
    slug: "caesars-palace-training",
    title: "Caesars Palace Training Hub",
    category: "Hospitality",
    description:
      "Interactive training platform demo for hospitality staff. Features video modules, quizzes, progress tracking, and PDF certificate generation for completed courses.",
    modules: ["Video Courses", "Quiz System", "Progress Tracking", "PDF Certificates"],
    outcome: "Demo delivered",
    timeline: "2 weeks",
    quality: "Prototype",
    url: null,
    stack: ["Next.js", "Convex"],
    featured: false,
  },
];

const qualityColors: Record<string, string> = {
  MVP: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Production: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Prototype: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Legal Tech SaaS": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  "Consumer Wellness": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  "Internal Tool": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Hospitality: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
};

export default function WorkPage() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6 text-center">
            <h1 className="text-h1 text-foreground mb-4">Our Work</h1>
            <p className="text-body-lg text-secondary-custom max-w-2xl mx-auto">
              Real projects we&apos;ve shipped. From legal tech automation to wellness
              platforms — here&apos;s what we build.
            </p>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 md:py-24 bg-subtle">
          <div className="container-wide mx-auto px-6">
            <h2 className="text-h3 text-foreground mb-8 text-center">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featuredProjects.map((project) => (
                <div
                  key={project.slug}
                  className="group bg-surface rounded-2xl overflow-hidden border border-border-default hover:border-accent/30 transition-all hover:shadow-lg"
                >
                  {/* Image placeholder with icon */}
                  <div className="aspect-video bg-gradient-to-br from-accent/5 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 text-accent">
                        {categoryIcons[project.category] || categoryIcons["Internal Tool"]}
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

                    <p className="text-body-sm text-secondary-custom mb-4">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.stack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-accent/10 text-accent rounded text-body-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Modules */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.modules.map((module, index) => (
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
                        <p className="text-body-sm text-secondary-custom">Timeline</p>
                        <p className="text-body font-medium text-foreground">
                          {project.timeline}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-body-sm text-secondary-custom">Result</p>
                        <p className="text-body font-medium text-success">
                          {project.outcome}
                        </p>
                      </div>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-accent hover:underline text-body-sm font-medium"
                        >
                          Visit
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Projects */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6">
            <h2 className="text-h3 text-foreground mb-8 text-center">
              More Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {otherProjects.map((project) => (
                <div
                  key={project.slug}
                  className="bg-surface rounded-xl p-6 border border-border-default hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      {categoryIcons[project.category] || categoryIcons["Internal Tool"]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-body font-semibold text-foreground">
                          {project.title}
                        </h3>
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-medium ${qualityColors[project.quality]}`}
                        >
                          {project.quality}
                        </span>
                      </div>
                      <p className="text-body-sm text-secondary-custom mb-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.stack.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-1.5 py-0.5 bg-subtle rounded text-xs text-secondary-custom"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-subtle">
          <div className="container-wide mx-auto px-6 text-center">
            <h2 className="text-h2 text-foreground mb-4">
              Ready to Build Something Great?
            </h2>
            <p className="text-body text-secondary-custom mb-8 max-w-xl mx-auto">
              Get an instant estimate for your project. Our Monte Carlo engine gives
              you realistic P10/P50/P90 price ranges — no guesswork.
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
