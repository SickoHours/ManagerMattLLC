"use client";

export function RemediesSection() {
  const remedies = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Minor Overrun (under 15%)",
      description: "We absorb it. No questions asked.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Material Variance",
      description: "We re-estimate and get your approval first.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      title: "Scope Change",
      description: "You can defer or descale anytime.",
    },
  ];

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-md">
      <h3 className="text-h4 text-foreground mb-4">What if the Estimate is Off?</h3>
      <p className="text-body-sm text-secondary-custom mb-5">
        No surprises. No hidden fees. Clear communication.
      </p>

      <div className="space-y-3">
        {remedies.map((remedy, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-subtle"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success">
              {remedy.icon}
            </div>
            <div>
              <p className="font-medium text-foreground text-body-sm">
                {remedy.title}
              </p>
              <p className="text-body-sm text-secondary-custom">
                {remedy.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
