"use client";

export function LaborSection() {
  return (
    <section className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="glow-purple-sm absolute top-1/2 left-0 -translate-y-1/2 opacity-40" />

      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

      <div className="vibe-container px-6 relative">
        <div className="max-w-4xl mx-auto">
          {/* The big quote */}
          <div className="aura-hidden text-center mb-16">
            <blockquote className="relative">
              <span className="absolute -top-8 -left-4 text-8xl text-purple-500/20 font-serif">
                &ldquo;
              </span>
              <p className="text-white text-2xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight">
                AI doesn&apos;t reduce the value of money.
                <br />
                <span className="text-gradient-purple">
                  It reduces the value of labor.
                </span>
              </p>
              <p className="text-zinc-400 text-lg mt-6">Big difference.</p>
            </blockquote>
            <cite className="block mt-8 text-zinc-500 text-base not-italic">
              — Alex Hormozi,{" "}
              <a
                href="https://x.com/AlexHormozi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                @AlexHormozi
              </a>{" "}
              · Jan 3, 2026
            </cite>
          </div>

          {/* The explanation */}
          <div className="aura-hidden max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* What this means */}
              <div className="vibe-card-enhanced p-6">
                <h3 className="text-white text-lg font-medium mb-4">
                  What this means for you:
                </h3>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3 group">
                    <span className="text-purple-400 mt-1 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                    <span>
                      The same quality software that cost $100k in 2023 might cost
                      a fraction of that today
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="text-purple-400 mt-1 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                    <span>
                      Not because the work is worth less, but because the labor
                      required has collapsed
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="text-purple-400 mt-1 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                    <span>
                      Startups that couldn&apos;t afford custom software can now
                      compete with funded companies
                    </span>
                  </li>
                </ul>
              </div>

              {/* What stays the same */}
              <div className="vibe-card-enhanced p-6">
                <h3 className="text-white text-lg font-medium mb-4">
                  What stays the same:
                </h3>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Quality standards and code review</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Testing and security practices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Communication and project management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>The expertise to know what to build</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* The punchline */}
          <div className="aura-hidden mt-16 text-center">
            <p className="text-zinc-300 text-lg md:text-xl">
              This is the first time in history that{" "}
              <span className="text-white font-medium">
                custom software is accessible to everyone
              </span>
              .
            </p>
            <p className="text-zinc-500 text-base mt-2">
              Not templates. Not no-code workarounds. Real, custom software.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
