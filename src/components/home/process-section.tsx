"use client";

const clientSteps = [
  {
    number: "01",
    title: "Discovery",
    description: "We understand your vision, goals, and constraints.",
    deliverables: ["Project brief", "Technical requirements", "Timeline"],
  },
  {
    number: "02",
    title: "Design",
    description: "Wireframes and mockups before any code is written.",
    deliverables: ["Wireframes", "Visual designs", "Your approval"],
  },
  {
    number: "03",
    title: "Build",
    description: "Development in focused sprints with real-time visibility.",
    deliverables: ["Staging environment", "Weekly updates", "Working features"],
  },
  {
    number: "04",
    title: "Review",
    description: "QA testing, bug fixes, and polish before launch.",
    deliverables: ["QA results", "Performance tuning", "Final sign-off"],
  },
  {
    number: "05",
    title: "Ship",
    description: "Production deployment with documentation and support.",
    deliverables: ["Live deployment", "Documentation", "30-day support"],
  },
];

export function ProcessSection() {
  return (
    <section className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="glow-purple-sm absolute top-1/4 right-0 opacity-30" />

      <div className="vibe-container px-6 relative">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="aura-hidden">
            <h2 className="text-display-premium text-white text-3xl md:text-5xl">
              How We Work Together
            </h2>
          </div>
          <div className="aura-hidden mt-4">
            <p className="text-zinc-400 text-lg">
              A clear, predictable process from idea to launch.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line (desktop) */}
            <div className="hidden md:block absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent" />

            {/* Steps */}
            <div className="space-y-8">
              {clientSteps.map((step) => (
                <div
                  key={step.number}
                  className="aura-hidden relative"
                >
                  <div className="flex gap-6">
                    {/* Number circle */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-sm z-10">
                      {step.number}
                    </div>

                    {/* Content card */}
                    <div className="flex-1 vibe-card-enhanced p-6 hover-glow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h3 className="text-white text-xl font-medium mb-2">
                            {step.title}
                          </h3>
                          <p className="text-zinc-400 text-base">
                            {step.description}
                          </p>
                        </div>

                        {/* Deliverables */}
                        <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                          {step.deliverables.map((item, i) => (
                            <span
                              key={i}
                              className="text-xs text-zinc-500 bg-white/5 px-2 py-1 border border-white/10"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
