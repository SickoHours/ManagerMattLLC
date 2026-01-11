import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We start with understanding your vision, goals, and constraints. This includes a kickoff call, requirements gathering, and scope definition.",
    duration: "1-3 days",
    deliverables: [
      "Project brief document",
      "Technical requirements",
      "Timeline and milestones",
      "Fixed-price quote",
    ],
  },
  {
    number: "02",
    title: "Design",
    description:
      "Before writing code, we create wireframes and designs for key screens. You'll review and approve these before development begins.",
    duration: "3-7 days",
    deliverables: [
      "Wireframes for key flows",
      "Visual design mockups",
      "Design system components",
      "Interactive prototype (if needed)",
    ],
  },
  {
    number: "03",
    title: "Build",
    description:
      "Development happens in focused sprints with regular check-ins. You'll see progress in real-time through a staging environment.",
    duration: "1-8 weeks",
    deliverables: [
      "Working staging environment",
      "Weekly progress updates",
      "Feature demonstrations",
      "Code in version control",
    ],
  },
  {
    number: "04",
    title: "Review",
    description:
      "Before launch, we conduct thorough QA testing and get your final approval. We fix any issues and polish the experience.",
    duration: "2-5 days",
    deliverables: [
      "QA test results",
      "Bug fixes and polish",
      "Performance optimization",
      "Final sign-off checklist",
    ],
  },
  {
    number: "05",
    title: "Ship",
    description:
      "We deploy to production and monitor for any issues. You get documentation and a smooth handoff.",
    duration: "1-2 days",
    deliverables: [
      "Production deployment",
      "Technical documentation",
      "Admin credentials",
      "30-day support period",
    ],
  },
];

const safetyPractices = [
  {
    title: "Version Control",
    description: "All code is stored in Git with full history and backups.",
  },
  {
    title: "Staging Environment",
    description: "Test changes safely before they reach production.",
  },
  {
    title: "Automated Testing",
    description: "Critical paths covered by automated tests.",
  },
  {
    title: "Security First",
    description: "Industry best practices for auth, data handling, and APIs.",
  },
  {
    title: "Monitoring & Alerts",
    description: "Real-time error tracking and performance monitoring.",
  },
  {
    title: "Documentation",
    description: "Clear docs for maintenance and future development.",
  },
];

const communicationExpectations = [
  {
    title: "Weekly Updates",
    description:
      "You'll receive a written summary every week with progress, blockers, and next steps.",
  },
  {
    title: "48-Hour Response Time",
    description:
      "We respond to all messages within 2 business days, usually same-day.",
  },
  {
    title: "Async by Default",
    description:
      "Most communication happens via email or Slack. Calls scheduled when needed.",
  },
  {
    title: "Transparent Timeline",
    description:
      "Real-time access to project board showing what's done, in progress, and coming up.",
  },
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6 text-center">
            <h1 className="text-h1 text-foreground mb-4">How We Work</h1>
            <p className="text-body-lg text-secondary-custom max-w-2xl mx-auto">
              A clear, predictable process that keeps you informed and in control
              from start to finish.
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 md:py-24 bg-subtle">
          <div className="container-wide mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {processSteps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative ${
                    index < processSteps.length - 1 ? "pb-12" : ""
                  }`}
                >
                  {/* Timeline line */}
                  {index < processSteps.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border-default" />
                  )}

                  <div className="flex gap-6">
                    {/* Number circle */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                      {step.number}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-surface rounded-2xl p-6 shadow-sm border border-border-default">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-h3 text-foreground">{step.title}</h3>
                        <span className="text-body-sm text-secondary-custom bg-subtle px-3 py-1 rounded-full">
                          {step.duration}
                        </span>
                      </div>

                      <p className="text-body text-secondary-custom mb-4">
                        {step.description}
                      </p>

                      <div>
                        <p className="text-body-sm font-medium text-foreground mb-2">
                          Deliverables:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {step.deliverables.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-success flex-shrink-0"
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
                              <span className="text-body-sm text-secondary-custom">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Practices */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-h2 text-foreground mb-4">Safety Practices</h2>
                <p className="text-body text-secondary-custom">
                  Every project follows these engineering best practices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safetyPractices.map((practice, index) => (
                  <div
                    key={index}
                    className="bg-surface rounded-xl p-5 border border-border-default"
                  >
                    <h3 className="font-semibold text-foreground mb-2">
                      {practice.title}
                    </h3>
                    <p className="text-body-sm text-secondary-custom">
                      {practice.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Communication */}
        <section className="py-16 md:py-24 bg-subtle">
          <div className="container-wide mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-h2 text-foreground mb-4">
                  Communication Expectations
                </h2>
                <p className="text-body text-secondary-custom">
                  What you can expect when working with us.
                </p>
              </div>

              <div className="space-y-4">
                {communicationExpectations.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-surface rounded-xl p-5 border border-border-default"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-body-sm text-secondary-custom">
                        {item.description}
                      </p>
                    </div>
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
              Ready to Start Your Project?
            </h2>
            <p className="text-body text-secondary-custom mb-8 max-w-xl mx-auto">
              Get an instant estimate and see how we can bring your vision to life.
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
