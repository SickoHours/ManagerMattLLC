"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const USER_TYPE_OPTIONS = [
  {
    value: "just-me",
    label: "Just me",
    description: "Personal tool or solo project",
    icon: "👤",
  },
  {
    value: "team",
    label: "My team",
    description: "Internal tool for 2-20 people",
    icon: "👥",
  },
  {
    value: "customers",
    label: "My customers",
    description: "Public-facing product",
    icon: "🌍",
  },
  {
    value: "everyone",
    label: "Everyone",
    description: "Team + customers use it",
    icon: "🚀",
  },
];

const TIMELINE_OPTIONS = [
  {
    value: "exploring",
    label: "Just exploring",
    description: "No rush - gathering information",
    icon: "🔍",
  },
  {
    value: "soon",
    label: "Within 2-3 months",
    description: "Have a timeline in mind",
    icon: "📅",
  },
  {
    value: "asap",
    label: "ASAP",
    description: "Ready to start immediately",
    icon: "⚡",
  },
];

type UserType = "just-me" | "team" | "customers" | "everyone";
type Timeline = "exploring" | "soon" | "asap";

interface InquiryResult {
  inquiryId: string;
  roughMin: number;
  roughMax: number;
  keywords: string[];
}

export function InquiryForm() {
  const router = useRouter();
  const submitInquiry = useMutation(api.inquiries.submit);

  const [step, setStep] = useState(0);
  const [description, setDescription] = useState("");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDescriptionSubmit = () => {
    if (description.trim().length < 10) {
      setError("Please describe your project in a bit more detail");
      return;
    }
    setError(null);
    setStep(1);
  };

  const handleUserTypeSelect = (value: UserType) => {
    setUserType(value);
    setStep(2);
  };

  const handleTimelineSelect = (value: Timeline) => {
    setTimeline(value);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!description || !userType || !timeline) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await submitInquiry({
        description: description.trim(),
        userType,
        timeline,
        email: email.trim().toLowerCase(),
        name: name.trim() || undefined,
      });

      setResult({
        inquiryId: response.inquiryId,
        roughMin: response.roughMin,
        roughMax: response.roughMax,
        keywords: response.keywords,
      });
      setStep(4);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Progress dots */}
      {step < 4 && (
        <div className="flex items-center justify-center gap-3 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-accent"
                  : i < step
                  ? "w-2 bg-accent/60"
                  : "w-2 bg-border-default"
              }`}
            />
          ))}
        </div>
      )}

      {/* Step 0: What do you want to build? */}
      {step === 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What do you want to build?
            </h1>
            <p className="text-lg text-secondary-custom">
              Don&apos;t worry about technical details — just describe what you want it to do
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: An app where my sales team can log door knocks and I can see their routes on a map"
              className="w-full h-40 p-5 text-lg bg-surface border border-border-default rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-secondary-custom/60"
              autoFocus
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              onClick={handleDescriptionSubmit}
              disabled={description.trim().length < 10}
              className="w-full h-14 bg-accent text-white text-lg font-medium rounded-xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continue
            </button>
          </div>

          <p className="text-center text-sm text-secondary-custom mt-8">
            Takes less than 60 seconds to get your estimate
          </p>
        </div>
      )}

      {/* Step 1: Who will use this? */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Who will use this?
            </h1>
            <p className="text-lg text-secondary-custom">
              This helps us understand the scope
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {USER_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleUserTypeSelect(option.value as UserType)}
                className="flex items-center gap-4 p-6 bg-surface border border-border-default rounded-2xl hover:border-accent/50 hover:bg-subtle transition-all text-left group"
              >
                <span className="text-3xl">{option.icon}</span>
                <div>
                  <p className="font-semibold text-foreground text-lg group-hover:text-accent transition-colors">
                    {option.label}
                  </p>
                  <p className="text-secondary-custom text-sm mt-0.5">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(0)}
            className="mt-8 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* Step 2: When do you need this? */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              When do you need this?
            </h1>
            <p className="text-lg text-secondary-custom">
              No pressure — just helps us prioritize
            </p>
          </div>

          <div className="space-y-4">
            {TIMELINE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTimelineSelect(option.value as Timeline)}
                className="flex items-center gap-4 w-full p-6 bg-surface border border-border-default rounded-2xl hover:border-accent/50 hover:bg-subtle transition-all text-left group"
              >
                <span className="text-3xl">{option.icon}</span>
                <div>
                  <p className="font-semibold text-foreground text-lg group-hover:text-accent transition-colors">
                    {option.label}
                  </p>
                  <p className="text-secondary-custom text-sm mt-0.5">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="mt-8 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* Step 3: Contact info */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Where should I send the estimate?
            </h1>
            <p className="text-lg text-secondary-custom">
              I&apos;ll review your project and get back to you within 24 hours
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-14 px-5 text-lg bg-surface border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name <span className="text-secondary-custom">(optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-14 px-5 text-lg bg-surface border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !email.trim()}
              className="w-full h-14 bg-accent text-white text-lg font-medium rounded-xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Get My Estimate"
              )}
            </button>
          </div>

          <button
            onClick={() => setStep(2)}
            className="mt-8 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 4 && result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Estimate is Ready
            </h1>
            <p className="text-lg text-secondary-custom">
              Based on what you described, projects like this typically cost:
            </p>
          </div>

          <div className="bg-surface border border-border-default rounded-2xl p-8 mb-8">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="text-4xl md:text-5xl font-bold text-foreground">
                  {formatPrice(result.roughMin)}
                </span>
                <span className="text-xl text-secondary-custom">to</span>
                <span className="text-4xl md:text-5xl font-bold text-foreground">
                  {formatPrice(result.roughMax)}
                </span>
              </div>
              <p className="text-secondary-custom">
                Preliminary range
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-blue-900 mb-1">
                  I&apos;ll review your project and send a detailed quote to {email}
                </p>
                <p className="text-blue-700 text-sm">
                  Usually within 24 hours
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-foreground">What happens next:</h3>
            <div className="space-y-3">
              {[
                { num: 1, text: "I review your project description" },
                { num: 2, text: "You get a detailed quote with clear assumptions" },
                { num: 3, text: "We hop on a quick call if needed" },
              ].map((item) => (
                <div key={item.num} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent font-semibold flex items-center justify-center text-sm">
                    {item.num}
                  </div>
                  <p className="text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:matt@managermatt.com?subject=Project%20Inquiry%20-%20Quick%20Question"
              className="flex-1 h-14 bg-surface border border-border-default text-foreground text-lg font-medium rounded-xl hover:bg-subtle transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Questions? Let&apos;s chat
            </a>
            <button
              onClick={() => {
                setStep(0);
                setDescription("");
                setUserType(null);
                setTimeline(null);
                setEmail("");
                setName("");
                setResult(null);
              }}
              className="flex-1 h-14 bg-accent text-white text-lg font-medium rounded-xl hover:bg-accent-hover transition-all"
            >
              Submit Another Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
