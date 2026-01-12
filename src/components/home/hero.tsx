"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-vibe-dark">
      {/* Spotlight overlay */}
      <div className="absolute inset-0 bg-spotlight pointer-events-none" />

      <div className="vibe-container w-full px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <div className="aura-reveal">
            <p className="text-zinc-400 text-lg md:text-xl">
              Hi. I&apos;m Matt.
            </p>
          </div>

          {/* The confession lead-in */}
          <div className="aura-reveal aura-reveal-delay-1 mt-6">
            <p className="text-zinc-400 text-lg md:text-xl">
              And I have a confession to make.
            </p>
          </div>

          {/* THE HEADLINE - the reveal */}
          <div className="aura-reveal aura-reveal-delay-2 mt-10">
            <h1 className="text-vibe-display text-white text-5xl md:text-7xl lg:text-8xl">
              I&apos;m a{" "}
              <span className="text-gradient-purple">vibe coder.</span>
            </h1>
          </div>

          {/* The gasp - comedic beat */}
          <div className="aura-reveal aura-reveal-delay-3 mt-8">
            <p className="text-zinc-500 text-xl md:text-2xl italic">
              *gasp*
            </p>
          </div>

          {/* The context */}
          <div className="aura-reveal aura-reveal-delay-4 mt-10 space-y-4">
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              Yes, that thing senior developers warn junior devs about.
              <br />
              That thing tech Twitter debates about.
              <br />
              That thing{" "}
              <a
                href="https://en.wikipedia.org/wiki/Vibe_coding"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors"
              >
                Andrej Karpathy
              </a>{" "}
              accidentally started.
            </p>
          </div>

          {/* The pivot */}
          <div className="aura-reveal aura-reveal-delay-5 mt-8">
            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed">
              I embraced the vibes. I let the AI cook.
              <br />
              And somehow... it worked?
            </p>
          </div>

          {/* The payoff */}
          <div className="aura-reveal aura-reveal-delay-6 mt-10">
            <p className="text-white text-xl md:text-2xl leading-relaxed font-medium">
              You&apos;re looking at what might be the internet&apos;s first portfolio
              <br className="hidden md:block" />
              from a self-proclaimed, shameless, unapologetic vibe coder
              <br className="hidden md:block" />
              who actually ships production software.
            </p>
          </div>

          {/* The proof */}
          <div className="aura-reveal aura-reveal-delay-7 mt-6">
            <p className="text-zinc-300 text-lg md:text-xl">
              To paying clients.
            </p>
            <p className="text-zinc-400 text-lg md:text-xl mt-2">
              Who come back for more.
            </p>
          </div>

          {/* The congratulations */}
          <div className="aura-reveal aura-reveal-delay-8 mt-12">
            <p className="text-vibe-display text-white text-2xl md:text-3xl tracking-wide">
              Congratulations. You just witnessed history.
            </p>
          </div>

          {/* CTA */}
          <div className="aura-reveal aura-reveal-delay-8 mt-12 flex flex-col sm:flex-row gap-4">
            <Link href="/estimate" className="btn-vibe-primary shimmer-border text-center">
              Get Your Estimate
            </Link>
            <Link href="/work" className="btn-vibe-secondary text-center">
              See My Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
