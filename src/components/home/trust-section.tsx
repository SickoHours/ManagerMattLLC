"use client";

import { FadeIn } from "@/components/ui/fade-in";

const trustItems = [
  {
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Explainable Estimates",
    description:
      "See every assumption, module, and cost driver. Know exactly where your budget goes with P10/P50/P90 ranges.",
  },
  {
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Fast Builds",
    description:
      "AI tools compress weeks into days. Get from idea to working product faster than traditional development.",
  },
  {
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Control Room",
    description:
      "Track progress, approve changes, review previews. No GitHub required — just a clean dashboard for decisions.",
  },
];

export function TrustSection() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-wide mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {trustItems.map((item, index) => (
            <FadeIn key={index} delay={index * 150} direction="up">
              <div className="text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center text-secondary-custom">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="mt-6 text-h3 text-foreground">{item.title}</h3>

                {/* Description */}
                <p className="mt-3 text-body-sm text-secondary-custom max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
