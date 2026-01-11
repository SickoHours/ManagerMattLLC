"use client";

import { cn } from "@/lib/utils";

interface SelectionCardProps {
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SelectionCard({
  selected = false,
  onClick,
  disabled = false,
  children,
  className,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full text-left p-6 rounded-xl transition-all duration-150",
        "border-2 bg-surface",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "min-h-[80px]",
        selected
          ? "border-primary bg-brand-light shadow-sm"
          : "border-border hover:border-muted-foreground hover:bg-subtle",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Selection indicator */}
      <div
        className={cn(
          "absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all duration-150",
          "flex items-center justify-center",
          selected
            ? "border-primary bg-primary"
            : "border-border bg-transparent"
        )}
      >
        {selected && (
          <svg
            className="w-3 h-3 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {children}
    </button>
  );
}

interface ModuleCardProps {
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  name: string;
  description: string;
  category: string;
  className?: string;
}

export function ModuleCard({
  selected = false,
  onClick,
  disabled = false,
  name,
  description,
  category,
  className,
}: ModuleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full text-left p-4 rounded-xl transition-all duration-150",
        "border bg-surface",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-primary bg-brand-light"
          : "border-border hover:border-muted-foreground hover:bg-subtle",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Checkbox */}
      <div
        className={cn(
          "absolute top-3 right-3 w-5 h-5 rounded border transition-all duration-150",
          "flex items-center justify-center",
          selected ? "border-primary bg-primary" : "border-border bg-transparent"
        )}
      >
        {selected && (
          <svg
            className="w-3 h-3 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {/* Category badge */}
      <span className="inline-block px-2 py-0.5 rounded text-label-xs font-medium uppercase bg-subtle text-secondary-custom">
        {category}
      </span>

      {/* Name */}
      <h4 className="mt-2 text-body font-medium text-foreground pr-6">{name}</h4>

      {/* Description */}
      <p className="mt-1 text-body-sm text-secondary-custom line-clamp-2">
        {description}
      </p>
    </button>
  );
}
