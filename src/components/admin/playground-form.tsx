"use client";

import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

// Quick test presets
const PRESETS = [
  {
    name: "Landing Page",
    description:
      "I need a simple landing page for my small business. It should have a hero section, about us, services offered, and a contact form. Mobile-friendly design is important.",
  },
  {
    name: "E-commerce Store",
    description:
      "I want to build an online store to sell handmade jewelry. Need product catalog, shopping cart, Stripe payments, order management, and customer accounts.",
  },
  {
    name: "SaaS Dashboard",
    description:
      "Building a project management SaaS for small teams. Need user authentication, team workspaces, task boards, file uploads, and a billing system with Stripe subscriptions.",
  },
  {
    name: "Mobile App",
    description:
      "I need a mobile app for my restaurant. Customers should be able to view the menu, place orders for pickup/delivery, make reservations, and earn loyalty points.",
  },
];

type AIQuestion = {
  question: string;
  header: string;
  options: Array<{ label: string; description: string }>;
  multiSelect: boolean;
};

type PRD = {
  summary: string;
  userStories: Array<{
    id: string;
    title: string;
    description: string;
    acceptanceCriteria: string[];
  }>;
  functionalRequirements: Array<{ id: string; description: string }>;
  nonGoals: string[];
};

type LineItem = {
  id: string;
  title: string;
  hours: number;
  cost: number;
  confidence: string;
};

type Stage =
  | "description"
  | "generating-questions"
  | "questions"
  | "generating-prd"
  | "review"
  | "generating-estimate"
  | "complete"
  | "error";

export function PlaygroundForm({
  onTestCreated,
}: {
  onTestCreated?: (testId: Id<"playgroundTests">) => void;
}) {
  // Form state
  const [stage, setStage] = useState<Stage>("description");
  const [description, setDescription] = useState("");
  const [testId, setTestId] = useState<Id<"playgroundTests"> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Questions state
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  // Review state
  const [initialPRD, setInitialPRD] = useState<PRD | null>(null);
  const [reviewerGaps, setReviewerGaps] = useState<string[]>([]);
  const [reviewerRecommendations, setReviewerRecommendations] = useState<
    string[]
  >([]);
  const [reviewerQuestions, setReviewerQuestions] = useState<AIQuestion[]>([]);
  const [currentReviewQuestionIndex, setCurrentReviewQuestionIndex] =
    useState(0);
  const [reviewerAnswers, setReviewerAnswers] = useState<
    Record<string, string[]>
  >({});

  // Result state
  const [enhancedPRD, setEnhancedPRD] = useState<PRD | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [estimateMin, setEstimateMin] = useState(0);
  const [estimateMax, setEstimateMax] = useState(0);
  const [estimateConfidence, setEstimateConfidence] = useState("");

  // Mutations
  const createTest = useMutation(api.playground.create);
  const updateWithQuestions = useMutation(api.playground.updateWithQuestions);
  const updateWithAnswers = useMutation(api.playground.updateWithAnswers);
  const updateWithInitialPRD = useMutation(api.playground.updateWithInitialPRD);
  const updateWithReview = useMutation(api.playground.updateWithReview);
  const updateWithReviewerAnswers = useMutation(
    api.playground.updateWithReviewerAnswers
  );
  const updateWithEnhancedPRD = useMutation(
    api.playground.updateWithEnhancedPRD
  );
  const updateWithEstimate = useMutation(api.playground.updateWithEstimate);
  const markError = useMutation(api.playground.markError);

  // AI Actions
  const getAIQuestions = useAction(api.inquiries.getAIQuestionsV2);
  const generatePRDAndEstimate = useAction(
    api.inquiries.generatePRDAndEstimateV2
  );

  // Format answers for API
  const formatAnswers = (ans: Record<string, string[]>) => {
    return Object.entries(ans)
      .map(([header, selected]) => `${header}=${selected.join(", ")}`)
      .join(", ");
  };

  // Handle description submit
  const handleDescriptionSubmit = async () => {
    if (description.trim().length < 10) return;

    setStage("generating-questions");
    setError(null);

    try {
      // Create test record
      const id = await createTest({ description: description.trim() });
      setTestId(id);
      onTestCreated?.(id);

      // Generate questions
      const startTime = Date.now();
      const result = await getAIQuestions({ description: description.trim() });
      const duration = Date.now() - startTime;

      if (result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        await updateWithQuestions({
          id,
          questions: result.questions,
          debugInfo: {
            tokensIn: 500, // Approximate
            tokensOut: 800,
            durationMs: duration,
          },
        });
        setStage("questions");
      } else {
        throw new Error("No questions generated");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setStage("error");
      if (testId) {
        await markError({ id: testId, error: message });
      }
    }
  };

  // Handle question answer
  const handleAnswer = (header: string, selected: string[]) => {
    setAnswers((prev) => ({ ...prev, [header]: selected }));

    // Auto-advance for single-select
    const question = questions[currentQuestionIndex];
    if (!question.multiSelect && selected.length > 0) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }
  };

  // Handle questions complete
  const handleQuestionsComplete = async () => {
    if (!testId) return;

    const formattedAnswers = formatAnswers(answers);
    await updateWithAnswers({ id: testId, answers: formattedAnswers });

    setStage("generating-prd");

    try {
      const startTime = Date.now();
      const result = await generatePRDAndEstimate({
        description,
        answers: formattedAnswers,
        questions,
      });
      const duration = Date.now() - startTime;

      if (result.stage === "review" && result.initialPRD) {
        // Stage 1 complete - have initial PRD and review questions
        setInitialPRD(result.initialPRD);
        setReviewerGaps(result.gaps || []);
        setReviewerRecommendations(result.recommendations || []);
        setReviewerQuestions(result.reviewerQuestions || []);

        await updateWithInitialPRD({
          id: testId,
          initialPRD: result.initialPRD,
          debugInfo: {
            tokensIn: 1500,
            tokensOut: 2000,
            durationMs: duration,
          },
        });

        if (result.reviewerQuestions && result.reviewerQuestions.length > 0) {
          await updateWithReview({
            id: testId,
            gaps: result.gaps || [],
            recommendations: result.recommendations || [],
            questions: result.reviewerQuestions,
            debugInfo: {
              tokensIn: 1000,
              tokensOut: 800,
              durationMs: duration / 2,
            },
          });
        }

        setStage("review");
      } else if (result.stage === "complete" && result.prd && result.estimate) {
        // Direct to complete (no review needed)
        // Convert null to undefined for enhancedPRD compatibility
        await completeEstimate({
          prd: result.prd,
          estimate: result.estimate,
          enhancedPRD: result.enhancedPRD ?? undefined,
        }, duration);
      } else {
        throw new Error("Unexpected result from PRD generation");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setStage("error");
      await markError({ id: testId, error: message });
    }
  };

  // Handle review question answer
  const handleReviewAnswer = (header: string, selected: string[]) => {
    setReviewerAnswers((prev) => ({ ...prev, [header]: selected }));

    const question = reviewerQuestions[currentReviewQuestionIndex];
    if (!question.multiSelect && selected.length > 0) {
      if (currentReviewQuestionIndex < reviewerQuestions.length - 1) {
        setCurrentReviewQuestionIndex((prev) => prev + 1);
      }
    }
  };

  // Handle skip review
  const handleSkipReview = async () => {
    if (!testId) return;

    await updateWithReviewerAnswers({ id: testId, answers: "SKIPPED" });
    await generateFinalEstimate("SKIPPED");
  };

  // Handle review complete
  const handleReviewComplete = async () => {
    if (!testId) return;

    const formattedAnswers = formatAnswers(reviewerAnswers);
    await updateWithReviewerAnswers({ id: testId, answers: formattedAnswers });
    await generateFinalEstimate(formattedAnswers);
  };

  // Generate final estimate
  const generateFinalEstimate = async (reviewAnswers: string) => {
    if (!testId || !initialPRD) return;

    setStage("generating-estimate");

    try {
      const startTime = Date.now();
      const result = await generatePRDAndEstimate({
        description,
        answers: formatAnswers(answers),
        questions,
        initialPRD,
        reviewerAnswers: reviewAnswers,
        reviewerQuestions,
        gaps: reviewerGaps,
        recommendations: reviewerRecommendations,
      });
      const duration = Date.now() - startTime;

      if (result.stage === "complete" && result.prd && result.estimate) {
        // Convert null to undefined for enhancedPRD compatibility
        await completeEstimate({
          prd: result.prd,
          estimate: result.estimate,
          enhancedPRD: result.enhancedPRD ?? undefined,
        }, duration);
      } else {
        throw new Error("Failed to generate estimate");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setStage("error");
      await markError({ id: testId, error: message });
    }
  };

  // Complete the estimate
  const completeEstimate = async (
    result: {
      prd: PRD;
      estimate: {
        lineItems: LineItem[];
        total: { min: number; max: number };
        subtotal: number;
        riskBuffer: number;
        riskPercent: number;
        totalHours: number;
        confidence: string;
      };
      enhancedPRD?: PRD;
    },
    duration: number
  ) => {
    if (!testId) return;

    setEnhancedPRD(result.enhancedPRD || result.prd);
    setLineItems(result.estimate.lineItems);
    setEstimateMin(result.estimate.total.min);
    setEstimateMax(result.estimate.total.max);
    setEstimateConfidence(result.estimate.confidence);

    if (result.enhancedPRD) {
      await updateWithEnhancedPRD({
        id: testId,
        enhancedPRD: result.enhancedPRD,
        debugInfo: {
          tokensIn: 1200,
          tokensOut: 1500,
          durationMs: duration / 3,
        },
      });
    }

    await updateWithEstimate({
      id: testId,
      lineItems: result.estimate.lineItems,
      estimateMin: result.estimate.total.min,
      estimateMax: result.estimate.total.max,
      estimateSubtotal: result.estimate.subtotal,
      estimateRiskBuffer: result.estimate.riskBuffer,
      estimateRiskPercent: result.estimate.riskPercent,
      estimateTotalHours: result.estimate.totalHours,
      estimateConfidence: result.estimate.confidence,
      debugInfo: {
        tokensIn: 800,
        tokensOut: 600,
        durationMs: duration / 3,
      },
    });

    setStage("complete");
  };

  // Reset form
  const handleReset = () => {
    setStage("description");
    setDescription("");
    setTestId(null);
    setError(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setInitialPRD(null);
    setReviewerGaps([]);
    setReviewerRecommendations([]);
    setReviewerQuestions([]);
    setCurrentReviewQuestionIndex(0);
    setReviewerAnswers({});
    setEnhancedPRD(null);
    setLineItems([]);
    setEstimateMin(0);
    setEstimateMax(0);
    setEstimateConfidence("");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render based on stage
  if (stage === "description") {
    return (
      <div className="space-y-6">
        {/* Presets */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Quick Start Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setDescription(preset.description)}
                className="px-3 py-2 text-sm text-left bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Description textarea */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Project Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project idea in plain English..."
            className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>{description.length} characters</span>
            <span>Min 10 characters</span>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleDescriptionSubmit}
          disabled={description.trim().length < 10}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Generate Questions
        </button>
      </div>
    );
  }

  if (stage === "generating-questions") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400">Generating AI questions...</p>
      </div>
    );
  }

  if (stage === "questions" && questions.length > 0) {
    const question = questions[currentQuestionIndex];
    const currentAnswer = answers[question.header] || [];

    return (
      <div className="space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < currentQuestionIndex
                  ? "bg-blue-500"
                  : i === currentQuestionIndex
                    ? "bg-blue-500/50"
                    : "bg-zinc-700"
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <div>
          <div className="text-xs text-zinc-500 mb-1">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <h3 className="text-xl font-medium text-white">{question.question}</h3>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((option) => {
            const isSelected = currentAnswer.includes(option.label);
            return (
              <button
                key={option.label}
                onClick={() => {
                  if (question.multiSelect) {
                    const newSelection = isSelected
                      ? currentAnswer.filter((a) => a !== option.label)
                      : [...currentAnswer, option.label];
                    handleAnswer(question.header, newSelection);
                  } else {
                    handleAnswer(question.header, [option.label]);
                  }
                }}
                className={`w-full p-4 text-left border rounded-lg transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/50"
                }`}
              >
                <div className="font-medium text-white">{option.label}</div>
                <div className="text-sm text-zinc-400 mt-1">
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentQuestionIndex > 0 && (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Back
            </button>
          )}
          {question.multiSelect && currentAnswer.length > 0 && (
            <button
              onClick={() => {
                if (currentQuestionIndex < questions.length - 1) {
                  setCurrentQuestionIndex((prev) => prev + 1);
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Next
            </button>
          )}
          {currentQuestionIndex === questions.length - 1 &&
            Object.keys(answers).length === questions.length && (
              <button
                onClick={handleQuestionsComplete}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Generate PRD
              </button>
            )}
        </div>
      </div>
    );
  }

  if (stage === "generating-prd") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400">Generating PRD and reviewing...</p>
      </div>
    );
  }

  if (stage === "review") {
    // Show review findings and questions
    if (reviewerQuestions.length > 0) {
      const question = reviewerQuestions[currentReviewQuestionIndex];
      const currentAnswer = reviewerAnswers[question.header] || [];

      return (
        <div className="space-y-6">
          {/* Gaps banner */}
          {reviewerGaps.length > 0 && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="text-sm font-medium text-amber-400 mb-2">
                Gaps Identified
              </div>
              <ul className="text-sm text-amber-300 space-y-1">
                {reviewerGaps.map((gap, i) => (
                  <li key={i}>• {gap}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Question */}
          <div>
            <div className="text-xs text-zinc-500 mb-1">
              Follow-up {currentReviewQuestionIndex + 1} of{" "}
              {reviewerQuestions.length}
            </div>
            <h3 className="text-xl font-medium text-white">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option) => {
              const isSelected = currentAnswer.includes(option.label);
              return (
                <button
                  key={option.label}
                  onClick={() => {
                    if (question.multiSelect) {
                      const newSelection = isSelected
                        ? currentAnswer.filter((a) => a !== option.label)
                        : [...currentAnswer, option.label];
                      handleReviewAnswer(question.header, newSelection);
                    } else {
                      handleReviewAnswer(question.header, [option.label]);
                    }
                  }}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/50"
                  }`}
                >
                  <div className="font-medium text-white">{option.label}</div>
                  <div className="text-sm text-zinc-400 mt-1">
                    {option.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handleSkipReview}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors"
            >
              Skip Review
            </button>
            {currentReviewQuestionIndex === reviewerQuestions.length - 1 &&
              Object.keys(reviewerAnswers).length ===
                reviewerQuestions.length && (
                <button
                  onClick={handleReviewComplete}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Generate Estimate
                </button>
              )}
          </div>
        </div>
      );
    } else {
      // No review questions, just show skip to estimate
      return (
        <div className="space-y-6">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="text-sm font-medium text-green-400">
              PRD Generated Successfully
            </div>
            <p className="text-sm text-green-300 mt-1">
              No follow-up questions needed.
            </p>
          </div>
          <button
            onClick={() => generateFinalEstimate("SKIPPED")}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Estimate
          </button>
        </div>
      );
    }
  }

  if (stage === "generating-estimate") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400">Generating final estimate...</p>
      </div>
    );
  }

  if (stage === "complete") {
    return (
      <div className="space-y-6">
        {/* Estimate header */}
        <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl">
          <div className="text-sm text-zinc-400 mb-1">Estimated Range</div>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(estimateMin)} - {formatCurrency(estimateMax)}
          </div>
          <div className="text-sm text-zinc-400 mt-2">
            Confidence: {estimateConfidence}
          </div>
        </div>

        {/* Line items */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800">
            <h4 className="font-medium text-white">Line Items</h4>
          </div>
          <div className="divide-y divide-zinc-800">
            {lineItems.map((item) => (
              <div key={item.id} className="px-4 py-3 flex justify-between">
                <div>
                  <div className="text-sm text-white">{item.title}</div>
                  <div className="text-xs text-zinc-500">
                    {item.hours}h •{" "}
                    <span
                      className={
                        item.confidence === "high"
                          ? "text-green-400"
                          : item.confidence === "medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }
                    >
                      {item.confidence}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-white">
                  {formatCurrency(item.cost)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRD Summary */}
        {(enhancedPRD || initialPRD) && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800">
              <h4 className="font-medium text-white">PRD Summary</h4>
            </div>
            <div className="p-4">
              <p className="text-sm text-zinc-300">
                {(enhancedPRD || initialPRD)?.summary}
              </p>
              <div className="mt-3 text-xs text-zinc-500">
                {(enhancedPRD || initialPRD)?.userStories.length} user stories •{" "}
                {(enhancedPRD || initialPRD)?.functionalRequirements.length}{" "}
                requirements
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            New Test
          </button>
        </div>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="text-sm font-medium text-red-400">Error</div>
          <p className="text-sm text-red-300 mt-1">{error}</p>
        </div>
        <button
          onClick={handleReset}
          className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
}
