"use client";

import { Mail, Clock, MessageSquare, Kanban } from "lucide-react";

const expectations = [
  {
    icon: Mail,
    title: "Weekly Updates",
    description:
      "Written summary every week: progress, blockers, and what's next.",
  },
  {
    icon: Clock,
    title: "48-Hour Response",
    description:
      "All messages answered within 2 business days. Usually same-day.",
  },
  {
    icon: MessageSquare,
    title: "Async by Default",
    description:
      "Email or Slack for most things. Calls scheduled when actually needed.",
  },
  {
    icon: Kanban,
    title: "Transparent Timeline",
    description:
      "Real-time access to the project board. See what's done, in progress, and coming up.",
  },
];

export function CommunicationSection() {
  return (
    <section className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden">
      <div className="vibe-container px-6 relative">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="aura-hidden">
            <h2 className="text-display-premium text-white text-3xl md:text-5xl">
              What to Expect
            </h2>
          </div>
          <div className="aura-hidden mt-4">
            <p className="text-zinc-400 text-lg">
              Clear communication, no surprises.
            </p>
          </div>
        </div>

        {/* Expectations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {expectations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="aura-hidden"
              >
                <div className="vibe-card-enhanced p-6 h-full hover-glow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-500/10 text-purple-400">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">{item.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">
                        {item.description}
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
