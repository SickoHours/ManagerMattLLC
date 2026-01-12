"use client";

import { useState, useCallback } from "react";
import { useMutation, useAction } from "convex/react";
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

interface AIQuestion {
  id: number;
  question: string;
  options: {
    key: string;
    label: string;
    emoji?: string;
  }[];
}

interface LineItem {
  id: string;
  title: string;
  hours: number;
  cost: number;
  confidence: string;
}

interface PRD {
  summary: string;
  userStories: {
    id: string;
    title: string;
    description: string;
    acceptanceCriteria: string[];
  }[];
  functionalRequirements: {
    id: string;
    description: string;
  }[];
  nonGoals: string[];
}

interface AIResult {
  inquiryId: string;
  estimateMin: number;
  estimateMax: number;
  lineItems: LineItem[];
  prd: PRD;
  confidence: string;
  notes: string[];
}

interface FallbackResult {
  inquiryId: string;
  roughMin: number;
  roughMax: number;
  keywords: string[];
  usedAI: false;
}

type Result = AIResult | FallbackResult;

function isAIResult(result: Result): result is AIResult {
  return "lineItems" in result;
}

export function InquiryForm() {
  // Actions and mutations
  const getAIQuestions = useAction(api.inquiries.getAIQuestions);
  const generatePRDAndEstimate = useAction(api.inquiries.generatePRDAndEstimate);
  const createWithAI = useMutation(api.inquiries.createWithAI);
  const submitFallback = useMutation(api.inquiries.submitFallback);

  // Core form state
  const [step, setStep] = useState(0);
  const [description, setDescription] = useState("");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // AI state
  const [aiQuestions, setAIQuestions] = useState<AIQuestion[]>([]);
  const [aiAnswers, setAIAnswers] = useState<Record<number, string>>({});
  const [currentAIQuestion, setCurrentAIQuestion] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isGeneratingEstimate, setIsGeneratingEstimate] = useState(false);

  // Result state
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total steps: description + AI questions + userType + timeline + email + result
  const totalSteps = 1 + aiQuestions.length + 3;
  const currentProgress = step < totalSteps - 1 ? step : totalSteps - 1;

  const handleDescriptionSubmit = useCallback(async () => {
    if (description.trim().length < 10) {
      setError("Please describe your project in a bit more detail");
      return;
    }
    setError(null);
    setIsLoadingQuestions(true);

    try {
      // Get AI-generated questions
      const questionsResult = await getAIQuestions({
        description: description.trim(),
      });

      if (questionsResult.success && questionsResult.questions) {
        setAIQuestions(questionsResult.questions);
        setStep(1);
      } else {
        // Fallback: skip AI questions if generation fails
        console.error("AI question generation failed:", questionsResult.error);
        setStep(1);
      }
    } catch (err) {
      console.error("Error getting AI questions:", err);
      // Continue without AI questions
      setStep(1);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [description, getAIQuestions]);

  const handleAIQuestionAnswer = (questionId: number, answer: string) => {
    setAIAnswers((prev) => ({ ...prev, [questionId]: answer }));

    if (currentAIQuestion < aiQuestions.length - 1) {
      setCurrentAIQuestion((prev) => prev + 1);
      setStep((prev) => prev + 1);
    } else {
      // Move to user type selection
      setStep(1 + aiQuestions.length);
    }
  };

  const handleUserTypeSelect = (value: UserType) => {
    setUserType(value);
    setStep(1 + aiQuestions.length + 1);
  };

  const handleTimelineSelect = (value: Timeline) => {
    setTimeline(value);
    setStep(1 + aiQuestions.length + 2);
  };

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!description || !userType || !timeline) return;

    setError(null);
    setIsSubmitting(true);
    setIsGeneratingEstimate(true);

    try {
      // Format answers string: "1A, 2C, 3B"
      const answersString = Object.entries(aiAnswers)
        .map(([id, key]) => `${id}${key}`)
        .join(", ");

      if (aiQuestions.length > 0 && Object.keys(aiAnswers).length > 0) {
        // AI path: generate PRD and estimate
        const aiResult = await generatePRDAndEstimate({
          description: description.trim(),
          answers: answersString,
          questions: aiQuestions,
          userType,
          timeline,
        });

        if (aiResult.success && aiResult.prd && aiResult.estimate) {
          // Save to database
          const response = await createWithAI({
            description: description.trim(),
            userType,
            timeline,
            email: email.trim().toLowerCase(),
            name: name.trim() || undefined,
            generatedQuestions: aiQuestions,
            answers: answersString,
            prd: aiResult.prd,
            estimate: aiResult.estimate,
          });

          setResult({
            inquiryId: response.inquiryId,
            estimateMin: response.estimateMin,
            estimateMax: response.estimateMax,
            lineItems: response.lineItems,
            prd: response.prd,
            confidence: response.confidence,
            notes: response.notes,
          });
        } else {
          // AI failed, use fallback
          throw new Error(aiResult.error || "AI estimation failed");
        }
      } else {
        // Fallback path: no AI questions answered
        const response = await submitFallback({
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
          usedAI: false,
        });
      }

      setStep(totalSteps - 1);
    } catch (err) {
      console.error("Submission error:", err);
      // Try fallback
      try {
        const response = await submitFallback({
          description: description.trim(),
          userType: userType!,
          timeline: timeline!,
          email: email.trim().toLowerCase(),
          name: name.trim() || undefined,
          aiError: err instanceof Error ? err.message : "Unknown error",
        });

        setResult({
          inquiryId: response.inquiryId,
          roughMin: response.roughMin,
          roughMax: response.roughMax,
          keywords: response.keywords,
          usedAI: false,
        });
        setStep(totalSteps - 1);
      } catch (fallbackErr) {
        setError("Something went wrong. Please try again.");
        console.error(fallbackErr);
      }
    } finally {
      setIsSubmitting(false);
      setIsGeneratingEstimate(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const resetForm = () => {
    setStep(0);
    setDescription("");
    setUserType(null);
    setTimeline(null);
    setEmail("");
    setName("");
    setAIQuestions([]);
    setAIAnswers({});
    setCurrentAIQuestion(0);
    setResult(null);
    setError(null);
  };

  const goBack = () => {
    if (step === 0) return;

    if (step === 1 && aiQuestions.length === 0) {
      setStep(0);
    } else if (step <= aiQuestions.length) {
      // Going back through AI questions
      if (currentAIQuestion > 0) {
        setCurrentAIQuestion((prev) => prev - 1);
      }
      setStep((prev) => prev - 1);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  // Determine which step to show
  const isDescriptionStep = step === 0;
  const isAIQuestionStep = step >= 1 && step <= aiQuestions.length;
  const isUserTypeStep = step === 1 + aiQuestions.length;
  const isTimelineStep = step === 1 + aiQuestions.length + 1;
  const isEmailStep = step === 1 + aiQuestions.length + 2;
  const isResultStep = step === totalSteps - 1 && result !== null;

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Progress dots */}
      {!isResultStep && (
        <div className="flex items-center justify-center gap-2 mb-12">
          {Array.from({ length: Math.min(totalSteps - 1, 8) }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentProgress
                  ? "w-8 bg-accent"
                  : i < currentProgress
                  ? "w-2 bg-accent/60"
                  : "w-2 bg-border-default"
              }`}
            />
          ))}
        </div>
      )}

      {/* Step 0: What do you want to build? */}
      {isDescriptionStep && (
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleDescriptionSubmit}
              disabled={description.trim().length < 10 || isLoadingQuestions}
              className="w-full h-14 bg-accent text-white text-lg font-medium rounded-xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              {isLoadingQuestions ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing your project...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>

          <p className="text-center text-sm text-secondary-custom mt-8">
            Takes less than 90 seconds to get your detailed estimate
          </p>
        </div>
      )}

      {/* AI-Generated Questions */}
      {isAIQuestionStep && aiQuestions.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {aiQuestions[currentAIQuestion].question}
            </h1>
            <p className="text-lg text-secondary-custom">
              Question {currentAIQuestion + 1} of {aiQuestions.length}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {aiQuestions[currentAIQuestion].options.map((option) => (
              <button
                key={option.key}
                onClick={() =>
                  handleAIQuestionAnswer(aiQuestions[currentAIQuestion].id, option.key)
                }
                className="flex items-center gap-4 p-6 bg-surface border border-border-default rounded-2xl hover:border-accent/50 hover:bg-subtle transition-all text-left group"
              >
                <span className="text-3xl">{option.emoji || "•"}</span>
                <div>
                  <p className="font-semibold text-foreground text-lg group-hover:text-accent transition-colors">
                    {option.label}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={goBack}
            className="mt-8 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* User Type Step */}
      {isUserTypeStep && (
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
            onClick={goBack}
            className="mt-8 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* Timeline Step */}
      {isTimelineStep && (
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
            onClick={goBack}
            className="mt-8 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* Email Step */}
      {isEmailStep && (
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

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
                  {isGeneratingEstimate ? "Generating detailed estimate..." : "Submitting..."}
                </>
              ) : (
                "Get My Detailed Estimate"
              )}
            </button>
          </div>

          <button
            onClick={goBack}
            className="mt-8 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* Result Step */}
      {isResultStep && result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Detailed Estimate
            </h1>
            <p className="text-lg text-secondary-custom">
              {isAIResult(result)
                ? "Here's a breakdown of what your project includes:"
                : "Based on what you described, projects like this typically cost:"}
            </p>
          </div>

          {/* Price Summary */}
          <div className="bg-surface border border-border-default rounded-2xl p-8 mb-6">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="text-4xl md:text-5xl font-bold text-foreground">
                  {formatPrice(isAIResult(result) ? result.estimateMin : result.roughMin)}
                </span>
                <span className="text-xl text-secondary-custom">to</span>
                <span className="text-4xl md:text-5xl font-bold text-foreground">
                  {formatPrice(isAIResult(result) ? result.estimateMax : result.roughMax)}
                </span>
              </div>
              {isAIResult(result) && (
                <p className="text-secondary-custom">
                  Confidence: {result.confidence}
                </p>
              )}
            </div>
          </div>

          {/* Line Items (AI results only) */}
          {isAIResult(result) && result.lineItems && result.lineItems.length > 0 && (
            <div className="bg-surface border border-border-default rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">What&apos;s Included:</h3>
              <div className="space-y-3">
                {result.lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-border-default last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-secondary-custom font-mono">
                        {item.id}
                      </span>
                      <span className="text-foreground">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-secondary-custom">
                        {item.hours}h
                      </span>
                      <span className="font-medium text-foreground">
                        {formatPrice(item.cost)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {result.notes && result.notes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border-default">
                  <p className="text-sm text-secondary-custom">
                    <strong>Notes:</strong> {result.notes.join(" • ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Email confirmation */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-blue-900 mb-1">
                  I&apos;ll review your project and send a final quote to {email}
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
                { num: 1, text: "I review your project requirements" },
                { num: 2, text: "You get a final quote with confirmed pricing" },
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
              onClick={resetForm}
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
