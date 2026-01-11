"use client";

interface ComparableBuild {
  type: string;
  modules: string[];
  priceTier: "$" | "$$" | "$$$" | "$$$$";
  timeline: string;
  quality: string;
}

// Static anonymized comparable builds
const COMPARABLE_BUILDS: ComparableBuild[] = [
  {
    type: "Internal Dashboard",
    modules: ["Dashboard", "Analytics", "Database", "API"],
    priceTier: "$$",
    timeline: "2-3 weeks",
    quality: "MVP",
  },
  {
    type: "SaaS Platform",
    modules: ["Auth", "Dashboard", "Settings", "Billing", "API"],
    priceTier: "$$$",
    timeline: "4-6 weeks",
    quality: "Production",
  },
  {
    type: "Mobile App",
    modules: ["Auth", "Push Notifications", "API", "Database"],
    priceTier: "$$",
    timeline: "3-4 weeks",
    quality: "MVP",
  },
  {
    type: "E-commerce Site",
    modules: ["Products", "Cart", "Payments", "Admin", "API"],
    priceTier: "$$$",
    timeline: "5-8 weeks",
    quality: "Production",
  },
  {
    type: "Automation Tool",
    modules: ["Integrations", "Workflows", "Dashboard", "API"],
    priceTier: "$$",
    timeline: "2-4 weeks",
    quality: "MVP",
  },
];

interface ComparableBuildsProps {
  selectedModules?: string[];
  quality?: string;
}

export function ComparableBuilds({ selectedModules = [], quality }: ComparableBuildsProps) {
  // Find the most relevant comparable builds based on selected modules
  const scoredBuilds = COMPARABLE_BUILDS.map((build) => {
    let score = 0;

    // Score based on module overlap
    const selectedLower = selectedModules.map((m) => m.toLowerCase());
    build.modules.forEach((m) => {
      if (selectedLower.some((s) => m.toLowerCase().includes(s) || s.includes(m.toLowerCase()))) {
        score += 1;
      }
    });

    // Score based on quality match
    if (quality && build.quality.toLowerCase() === quality.toLowerCase()) {
      score += 0.5;
    }

    return { ...build, score };
  });

  // Sort by score and take top 3
  const topBuilds = scoredBuilds
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const priceTierColors: Record<string, string> = {
    $: "bg-success/10 text-success",
    $$: "bg-blue-100 text-blue-700",
    $$$: "bg-purple-100 text-purple-700",
    $$$$: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-md">
      <h3 className="text-h4 text-foreground mb-2">Similar Projects</h3>
      <p className="text-body-sm text-secondary-custom mb-5">
        Anonymized examples of comparable builds we&apos;ve delivered.
      </p>

      <div className="space-y-4">
        {topBuilds.map((build, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-border-default hover:border-accent/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">{build.type}</h4>
              <span
                className={`px-2 py-0.5 rounded-full text-body-sm font-medium ${priceTierColors[build.priceTier]}`}
              >
                {build.priceTier}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {build.modules.slice(0, 4).map((module, mIndex) => (
                <span
                  key={mIndex}
                  className="px-2 py-0.5 bg-subtle rounded text-body-sm text-secondary-custom"
                >
                  {module}
                </span>
              ))}
              {build.modules.length > 4 && (
                <span className="px-2 py-0.5 text-body-sm text-secondary-custom">
                  +{build.modules.length - 4} more
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-body-sm text-secondary-custom">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {build.timeline}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {build.quality}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
