"use client";

interface AssumptionsListProps {
  assumptions: string[];
}

export function AssumptionsList({ assumptions }: AssumptionsListProps) {
  if (!assumptions || assumptions.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md">
      <h2 className="text-h3 text-foreground mb-4">Assumptions</h2>
      <p className="text-body-sm text-secondary-custom mb-6">
        This estimate is based on the following assumptions. Please review and
        confirm these are accurate for your project.
      </p>

      <ul className="space-y-3">
        {assumptions.map((assumption, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-body text-foreground">{assumption}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
