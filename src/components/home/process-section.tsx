"use client";

const steps = [
  {
    number: "01",
    title: "I understand your problem",
    description: "human brain, still required",
  },
  {
    number: "02",
    title: "I architect the solution",
    description: "fundamentals matter, who knew",
  },
  {
    number: "03",
    title: "Claude writes the implementation",
    description: "fast, tireless, doesn't need coffee",
  },
  {
    number: "04",
    title: "I review every line",
    description: "yes, every line",
  },
  {
    number: "05",
    title: "I test it",
    description: "revolutionary concept",
  },
  {
    number: "06",
    title: "I ship it",
    description: "the part that matters",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-vibe-dark py-24 md:py-32">
      <div className="vibe-container px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="aura-reveal">
            <h2 className="text-vibe-display text-white text-3xl md:text-5xl">
              How I Actually Work
            </h2>
          </div>
          <div className="aura-reveal aura-reveal-delay-1 mt-4">
            <p className="text-zinc-500 text-lg italic">
              (A.K.A. The Part That Makes Traditional Devs Uncomfortable)
            </p>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Left: Intro + Steps */}
          <div>
            <div className="aura-reveal aura-reveal-delay-2">
              <p className="text-zinc-300 text-lg leading-relaxed mb-8">
                I don&apos;t mass-produce spaghetti code and pray.
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed mb-4">
                I have a workflow. A real one.
                <br />
                The same one a senior dev team would use.
                <br />
                Except my team is... artificial.
              </p>
              <p className="text-zinc-400 text-base mt-8 mb-6">
                Here&apos;s what actually happens:
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`aura-reveal aura-reveal-delay-${index + 3} flex items-start gap-4`}
                >
                  <span className="text-purple-400 font-mono text-sm mt-1">
                    {step.number}
                  </span>
                  <div>
                    <span className="text-white text-base font-medium">
                      {step.title}
                    </span>
                    <span className="text-zinc-500 text-base ml-2">
                      ({step.description})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The Thesis */}
          <div className="aura-reveal aura-reveal-delay-4 flex flex-col justify-center">
            {/* Results summary */}
            <div className="mb-8">
              <p className="text-zinc-300 text-lg leading-relaxed">
                The output?{" "}
                <span className="text-white font-medium">
                  Production-grade software.
                </span>
              </p>
              <p className="text-zinc-300 text-lg leading-relaxed mt-2">
                The process?{" "}
                <span className="text-purple-400 font-medium">Vibe-coded.</span>
              </p>
              <p className="text-zinc-300 text-lg leading-relaxed mt-2">
                The results?{" "}
                <span className="text-white font-medium">
                  Indistinguishable from &ldquo;real&rdquo; development.
                </span>
              </p>
            </div>

            {/* The big quote */}
            <div className="quote-highlight">
              <p className="text-zinc-400 text-base mb-4">
                Because here&apos;s the secret nobody wants to admit:
              </p>
              <p className="text-white text-xl md:text-2xl font-medium leading-relaxed">
                The client doesn&apos;t care HOW it was built.
                <br />
                They care that it WORKS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
