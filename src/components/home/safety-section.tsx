"use client";

import {
  GitBranch,
  TestTube,
  Shield,
  Activity,
  FileText,
  Server,
} from "lucide-react";

const safetyPractices = [
  {
    icon: GitBranch,
    title: "Version Control",
    description: "All code in Git with full history and backups. Nothing gets lost.",
  },
  {
    icon: Server,
    title: "Staging Environment",
    description: "Test changes safely before they touch production.",
  },
  {
    icon: TestTube,
    title: "Automated Testing",
    description: "Critical paths covered by tests that run on every change.",
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Auth, data handling, and APIs follow industry best practices.",
  },
  {
    icon: Activity,
    title: "Monitoring & Alerts",
    description: "Real-time error tracking so issues get caught immediately.",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Clear docs for maintenance and future development.",
  },
];

export function SafetySection() {
  return (
    <section className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden">
      <div className="vibe-container px-6 relative">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="aura-hidden">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
              &ldquo;But isn&apos;t vibe coding... risky?&rdquo;
            </p>
            <h2 className="text-display-premium text-white text-3xl md:text-5xl">
              Same Safety Standards
            </h2>
          </div>
          <div className="aura-hidden mt-4">
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              AI writes the code. I still apply the same engineering practices
              any senior team would use.
            </p>
          </div>
        </div>

        {/* Safety Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {safetyPractices.map((practice) => {
            const Icon = practice.icon;
            return (
              <div
                key={practice.title}
                className="aura-hidden"
              >
                <div className="vibe-card-enhanced p-6 h-full hover-glow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-500/10 text-green-400">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">
                        {practice.title}
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">
                        {practice.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
