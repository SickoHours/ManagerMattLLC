"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

// V2 Question type (Claude Code-style)
interface AIQuestionV2 {
  question: string;
  header: string;
  options: {
    label: string;
    description: string;
  }[];
  multiSelect: boolean;
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

// Character limit for description
const MAX_CHARS = 2000;

function isAIResult(result: Result): result is AIResult {
  return "lineItems" in result;
}

// Stage type for the two-stage flow
type Stage =
  | "description"
  | "questions"
  | "email"
  | "generating-prd"
  | "review"
  | "enhancing"
  | "result";

export function InquiryForm() {
  // V2 Actions and mutations
  const getAIQuestionsV2 = useAction(api.inquiries.getAIQuestionsV2);
  const generatePRDAndEstimateV2 = useAction(api.inquiries.generatePRDAndEstimateV2);
  const createWithAIV2 = useMutation(api.inquiries.createWithAIV2);
  const submitFallbackV2 = useMutation(api.inquiries.submitFallbackV2);

  // Core form state
  const [stage, setStage] = useState<Stage>("description");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // AI questions state
  const [aiQuestions, setAIQuestions] = useState<AIQuestionV2[]>([]);
  const [aiAnswers, setAIAnswers] = useState<Record<string, string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [otherText, setOtherText] = useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Two-stage PRD state
  const [initialPRD, setInitialPRD] = useState<PRD | null>(null);
  const [reviewerQuestions, setReviewerQuestions] = useState<AIQuestionV2[]>([]);
  const [reviewerGaps, setReviewerGaps] = useState<string[]>([]);
  const [reviewerRecommendations, setReviewerRecommendations] = useState<string[]>([]);
  const [reviewerAnswers, setReviewerAnswers] = useState<Record<string, string[]>>({});
  const [currentReviewQuestionIndex, setCurrentReviewQuestionIndex] = useState(0);
  const [reviewOtherText, setReviewOtherText] = useState("");

  // Result state
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Textarea ref for auto-grow
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle description change with auto-grow and character limit
  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= MAX_CHARS) {
        setDescription(value);
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          Math.min(textareaRef.current.scrollHeight, 320) + "px";
      }
    },
    []
  );

  // Calculate progress
  const getProgress = () => {
    switch (stage) {
      case "description":
        return 0;
      case "questions":
        return 1 + currentQuestionIndex;
      case "email":
        return 1 + aiQuestions.length;
      case "generating-prd":
        return 2 + aiQuestions.length;
      case "review":
        return 3 + aiQuestions.length + currentReviewQuestionIndex;
      case "enhancing":
        return 4 + aiQuestions.length + reviewerQuestions.length;
      case "result":
        return 5 + aiQuestions.length + reviewerQuestions.length;
      default:
        return 0;
    }
  };

  const totalSteps = 5 + aiQuestions.length + reviewerQuestions.length;

  const handleDescriptionSubmit = useCallback(async () => {
    if (description.trim().length < 10) {
      setError("Please describe your project in a bit more detail");
      return;
    }
    setError(null);
    setIsLoadingQuestions(true);

    try {
      const questionsResult = await getAIQuestionsV2({
        description: description.trim(),
      });

      if (questionsResult.success && questionsResult.questions) {
        setAIQuestions(questionsResult.questions);
        setStage("questions");
      } else {
        console.error("AI question generation failed:", questionsResult.error);
        // Skip to email if questions fail
        setStage("email");
      }
    } catch (err) {
      console.error("Error getting AI questions:", err);
      setStage("email");
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [description, getAIQuestionsV2]);

  // Format answers for API: "Header=Option, Header2=Option A, Option B"
  const formatAnswers = (
    questions: AIQuestionV2[],
    answers: Record<string, string[]>
  ): string => {
    return questions
      .map((q) => {
        const selectedOptions = answers[q.header] || [];
        if (selectedOptions.length === 0) return null;
        return `${q.header}=${selectedOptions.join(", ")}`;
      })
      .filter(Boolean)
      .join(", ");
  };

  const handleQuestionAnswer = (
    header: string,
    answer: string,
    isMultiSelect: boolean
  ) => {
    setAIAnswers((prev) => {
      if (isMultiSelect) {
        const current = prev[header] || [];
        const newAnswers = current.includes(answer)
          ? current.filter((a) => a !== answer)
          : [...current, answer];
        return { ...prev, [header]: newAnswers };
      } else {
        return { ...prev, [header]: [answer] };
      }
    });

    // Auto-advance for single select
    if (!isMultiSelect) {
      advanceQuestion();
    }
  };

  const handleOtherSubmit = (header: string) => {
    if (otherText.trim()) {
      setAIAnswers((prev) => ({ ...prev, [header]: [otherText.trim()] }));
      setOtherText("");
      advanceQuestion();
    }
  };

  const advanceQuestion = () => {
    if (currentQuestionIndex < aiQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStage("email");
    }
  };

  const handleReviewQuestionAnswer = (
    header: string,
    answer: string,
    isMultiSelect: boolean
  ) => {
    setReviewerAnswers((prev) => {
      if (isMultiSelect) {
        const current = prev[header] || [];
        const newAnswers = current.includes(answer)
          ? current.filter((a) => a !== answer)
          : [...current, answer];
        return { ...prev, [header]: newAnswers };
      } else {
        return { ...prev, [header]: [answer] };
      }
    });

    if (!isMultiSelect) {
      advanceReviewQuestion();
    }
  };

  const handleReviewOtherSubmit = (header: string) => {
    if (reviewOtherText.trim()) {
      setReviewerAnswers((prev) => ({ ...prev, [header]: [reviewOtherText.trim()] }));
      setReviewOtherText("");
      advanceReviewQuestion();
    }
  };

  const advanceReviewQuestion = () => {
    if (currentReviewQuestionIndex < reviewerQuestions.length - 1) {
      setCurrentReviewQuestionIndex((prev) => prev + 1);
    } else {
      handleReviewComplete();
    }
  };

  const handleSkipReview = () => {
    handleReviewComplete(true);
  };

  const handleReviewComplete = async (skipped = false) => {
    setStage("enhancing");

    try {
      const answersString = formatAnswers(aiQuestions, aiAnswers);
      const reviewAnswersString = skipped
        ? "SKIPPED"
        : formatAnswers(reviewerQuestions, reviewerAnswers);

      const result = await generatePRDAndEstimateV2({
        description: description.trim(),
        answers: answersString,
        questions: aiQuestions,
        initialPRD: initialPRD!,
        reviewerAnswers: reviewAnswersString,
        reviewerQuestions: reviewerQuestions,
        gaps: reviewerGaps,
        recommendations: reviewerRecommendations,
      });

      if (result.success && result.stage === "complete" && result.prd && result.estimate) {
        // Save to database
        const response = await createWithAIV2({
          description: description.trim(),
          email: email.trim().toLowerCase(),
          name: name.trim() || undefined,
          generatedQuestions: aiQuestions,
          answers: answersString,
          initialPRD: initialPRD!,
          reviewerQuestions: reviewerQuestions.length > 0 ? reviewerQuestions : undefined,
          reviewerAnswers: reviewAnswersString !== "SKIPPED" ? reviewAnswersString : undefined,
          reviewerGaps: reviewerGaps.length > 0 ? reviewerGaps : undefined,
          reviewerRecommendations: reviewerRecommendations.length > 0 ? reviewerRecommendations : undefined,
          enhancedPRD: !skipped ? result.prd : undefined,
          estimate: result.estimate,
          extractedUserType: result.extractedUserType,
          extractedTimeline: result.extractedTimeline,
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
        setStage("result");
      } else {
        throw new Error("Failed to complete estimate");
      }
    } catch (err) {
      console.error("Error completing estimate:", err);
      // Fallback
      await handleFallback(err);
    } finally {
      // Stage already set to result in success case
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setStage("generating-prd");

    try {
      const answersString = formatAnswers(aiQuestions, aiAnswers);

      // Generate initial PRD and get review questions
      const result = await generatePRDAndEstimateV2({
        description: description.trim(),
        answers: answersString,
        questions: aiQuestions,
      });

      if (result.success && result.stage === "review" && result.initialPRD) {
        // Store review stage data
        setInitialPRD(result.initialPRD);
        setReviewerQuestions(result.reviewerQuestions || []);
        setReviewerGaps(result.gaps || []);
        setReviewerRecommendations(result.recommendations || []);

        // Move to review stage (even if no questions, show the gaps)
        if (result.reviewerQuestions && result.reviewerQuestions.length > 0) {
          setStage("review");
        } else {
          // No review questions, proceed to enhancement
          handleReviewComplete(true);
        }
      } else if (result.success && result.stage === "complete" && result.prd && result.estimate) {
        // Direct completion (shouldn't happen but handle it)
        const response = await createWithAIV2({
          description: description.trim(),
          email: email.trim().toLowerCase(),
          name: name.trim() || undefined,
          generatedQuestions: aiQuestions,
          answers: answersString,
          initialPRD: result.initialPRD!,
          estimate: result.estimate,
          extractedUserType: result.extractedUserType,
          extractedTimeline: result.extractedTimeline,
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
        setStage("result");
      } else {
        throw new Error(result.error || "Failed to generate PRD");
      }
    } catch (err) {
      console.error("Error generating PRD:", err);
      await handleFallback(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFallback = async (err: unknown) => {
    try {
      const answersString = aiQuestions.length > 0
        ? formatAnswers(aiQuestions, aiAnswers)
        : undefined;

      const response = await submitFallbackV2({
        description: description.trim(),
        email: email.trim().toLowerCase(),
        name: name.trim() || undefined,
        generatedQuestions: aiQuestions.length > 0 ? aiQuestions : undefined,
        answers: answersString,
        aiError: err instanceof Error ? err.message : "Unknown error",
      });

      setResult({
        inquiryId: response.inquiryId,
        roughMin: response.roughMin,
        roughMax: response.roughMax,
        keywords: response.keywords,
        usedAI: false,
      });
      setStage("result");
    } catch (fallbackErr) {
      setError("Something went wrong. Please try again.");
      console.error(fallbackErr);
      setStage("email");
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
    setStage("description");
    setDescription("");
    setEmail("");
    setName("");
    setAIQuestions([]);
    setAIAnswers({});
    setCurrentQuestionIndex(0);
    setOtherText("");
    setInitialPRD(null);
    setReviewerQuestions([]);
    setReviewerGaps([]);
    setReviewerRecommendations([]);
    setReviewerAnswers({});
    setCurrentReviewQuestionIndex(0);
    setReviewOtherText("");
    setResult(null);
    setError(null);
  };

  const goBack = () => {
    switch (stage) {
      case "questions":
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex((prev) => prev - 1);
        } else {
          setStage("description");
        }
        break;
      case "email":
        if (aiQuestions.length > 0) {
          setCurrentQuestionIndex(aiQuestions.length - 1);
          setStage("questions");
        } else {
          setStage("description");
        }
        break;
      case "review":
        if (currentReviewQuestionIndex > 0) {
          setCurrentReviewQuestionIndex((prev) => prev - 1);
        } else {
          setStage("email");
        }
        break;
      default:
        break;
    }
  };

  // Render question card (used for both initial and review questions)
  const renderQuestionCard = (
    question: AIQuestionV2,
    answers: Record<string, string[]>,
    onAnswer: (header: string, answer: string, isMultiSelect: boolean) => void,
    onOtherSubmit: (header: string) => void,
    otherValue: string,
    setOtherValue: (value: string) => void,
    onContinue?: () => void
  ) => {
    const selectedAnswers = answers[question.header] || [];

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
            {question.header}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {question.question}
          </h1>
          {question.multiSelect && (
            <p className="text-secondary-custom mt-2">Select all that apply</p>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option) => {
            const isSelected = selectedAnswers.includes(option.label);
            return (
              <button
                key={option.label}
                onClick={() => onAnswer(question.header, option.label, question.multiSelect)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "border-accent bg-accent/5"
                    : "border-border-default bg-surface hover:border-accent/50 hover:bg-subtle"
                }`}
              >
                <div className="flex items-start gap-3">
                  {question.multiSelect && (
                    <div
                      className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                        isSelected ? "border-accent bg-accent" : "border-border-default"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold ${isSelected ? "text-accent" : "text-foreground"}`}>
                      {option.label}
                    </p>
                    <p className="text-secondary-custom text-sm mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

          {/* "Other" option - always visible */}
          <div className="border-2 border-dashed border-border-default rounded-2xl p-5">
            <p className="font-semibold text-secondary-custom mb-3">Other</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your own answer..."
                className="flex-1 p-3 bg-subtle border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && otherValue.trim()) {
                    onOtherSubmit(question.header);
                  }
                }}
              />
              {otherValue.trim() && (
                <button
                  onClick={() => onOtherSubmit(question.header)}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Continue button for multi-select */}
        {question.multiSelect && selectedAnswers.length > 0 && onContinue && (
          <button
            onClick={onContinue}
            className="w-full h-12 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-all"
          >
            Continue
          </button>
        )}

        <button
          onClick={goBack}
          className="mt-6 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Progress dots */}
      {stage !== "result" && (
        <div className="flex items-center justify-center gap-2 mb-12">
          {Array.from({ length: Math.min(totalSteps, 8) }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === getProgress()
                  ? "w-8 bg-accent"
                  : i < getProgress()
                  ? "w-2 bg-accent/60"
                  : "w-2 bg-border-default"
              }`}
            />
          ))}
        </div>
      )}

      {/* Description Step */}
      {stage === "description" && (
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
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Example: An app where my sales team can log door knocks and I can see their routes on a map. Tell me everything you're imagining — the more detail, the better!"
                className="w-full min-h-48 p-6 text-lg bg-surface border border-border-default rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-secondary-custom/60 overflow-y-auto"
                style={{ maxHeight: "320px" }}
                autoFocus
              />
              {description.length > MAX_CHARS * 0.8 && (
                <div className="absolute bottom-3 right-4 text-sm">
                  <span
                    className={
                      description.length > MAX_CHARS * 0.95
                        ? "text-red-400 font-medium"
                        : "text-secondary-custom"
                    }
                  >
                    {MAX_CHARS - description.length} characters remaining
                  </span>
                </div>
              )}
            </div>

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

      {/* AI Questions Step */}
      {stage === "questions" && aiQuestions.length > 0 && (
        <div>
          <p className="text-center text-sm text-secondary-custom mb-6">
            Question {currentQuestionIndex + 1} of {aiQuestions.length}
          </p>
          {renderQuestionCard(
            aiQuestions[currentQuestionIndex],
            aiAnswers,
            handleQuestionAnswer,
            handleOtherSubmit,
            otherText,
            setOtherText,
            aiQuestions[currentQuestionIndex].multiSelect ? advanceQuestion : undefined
          )}
        </div>
      )}

      {/* Email Step */}
      {stage === "email" && (
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
              onClick={handleEmailSubmit}
              disabled={isSubmitting || !email.trim()}
              className="w-full h-14 bg-accent text-white text-lg font-medium rounded-xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating your project plan...
                </>
              ) : (
                "Continue"
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

      {/* Generating PRD Loading State */}
      {stage === "generating-prd" && (
        <div className="animate-in fade-in duration-500 text-center py-20">
          <svg className="w-12 h-12 animate-spin mx-auto mb-6 text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <h2 className="text-2xl font-bold text-foreground mb-2">Building your project plan...</h2>
          <p className="text-secondary-custom">This usually takes 10-15 seconds</p>
        </div>
      )}

      {/* Review Stage */}
      {stage === "review" && reviewerQuestions.length > 0 && (
        <div>
          {/* Show gaps summary */}
          {currentReviewQuestionIndex === 0 && reviewerGaps.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
              <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Quick Review
              </h3>
              <p className="text-amber-800 text-sm mb-3">
                I noticed a few things that could affect your estimate:
              </p>
              <ul className="space-y-1">
                {reviewerGaps.map((gap, i) => (
                  <li key={i} className="text-amber-700 text-sm flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-center text-sm text-secondary-custom mb-6">
            Follow-up {currentReviewQuestionIndex + 1} of {reviewerQuestions.length}
          </p>
          {renderQuestionCard(
            reviewerQuestions[currentReviewQuestionIndex],
            reviewerAnswers,
            handleReviewQuestionAnswer,
            handleReviewOtherSubmit,
            reviewOtherText,
            setReviewOtherText,
            reviewerQuestions[currentReviewQuestionIndex].multiSelect ? advanceReviewQuestion : undefined
          )}

          <button
            onClick={handleSkipReview}
            className="mt-4 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto text-sm"
          >
            Skip remaining questions
          </button>
        </div>
      )}

      {/* Enhancing PRD Loading State */}
      {stage === "enhancing" && (
        <div className="animate-in fade-in duration-500 text-center py-20">
          <svg className="w-12 h-12 animate-spin mx-auto mb-6 text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <h2 className="text-2xl font-bold text-foreground mb-2">Finalizing your estimate...</h2>
          <p className="text-secondary-custom">Almost there!</p>
        </div>
      )}

      {/* Result Step */}
      {stage === "result" && result && (
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
                <p className="text-secondary-custom">Confidence: {result.confidence}</p>
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
                      <span className="text-sm text-secondary-custom font-mono">{item.id}</span>
                      <span className="text-foreground">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-secondary-custom">{item.hours}h</span>
                      <span className="font-medium text-foreground">{formatPrice(item.cost)}</span>
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
                <p className="text-blue-700 text-sm">Usually within 24 hours</p>
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
