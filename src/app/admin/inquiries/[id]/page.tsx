"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type InquiryStatus = "new" | "reviewed" | "quoted" | "converted";

const statusColors: Record<InquiryStatus, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  reviewed: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  quoted: "bg-green-500/10 text-green-400 border-green-500/20",
  converted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-800">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function StatusUpdater({
  currentStatus,
  onUpdate,
}: {
  currentStatus: InquiryStatus;
  onUpdate: (status: InquiryStatus) => void;
}) {
  const statuses: InquiryStatus[] = ["new", "reviewed", "quoted", "converted"];

  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onUpdate(status)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            currentStatus === status
              ? statusColors[status]
              : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  );
}

function StageProgress({ stage }: { stage?: string }) {
  const stages = [
    { key: "questions", label: "Questions" },
    { key: "initial-prd", label: "Initial PRD" },
    { key: "review", label: "Review" },
    { key: "enhanced", label: "Enhanced" },
    { key: "estimated", label: "Estimated" },
  ];

  const currentIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {stages.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div
            className={`px-3 py-1 text-xs rounded-full ${
              i <= currentIndex
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-zinc-800 text-zinc-500 border border-zinc-700"
            }`}
          >
            {s.label}
          </div>
          {i < stages.length - 1 && (
            <div
              className={`w-4 h-0.5 mx-1 ${
                i < currentIndex ? "bg-blue-500/50" : "bg-zinc-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ReviewerFindings({
  gaps,
  recommendations,
  questions,
  answers,
}: {
  gaps?: string[];
  recommendations?: string[];
  questions?: Array<{
    question: string;
    header: string;
    options: Array<{ label: string; description: string }>;
  }>;
  answers?: string;
}) {
  if (!gaps?.length && !recommendations?.length && !questions?.length) {
    return null;
  }

  const reviewStatus =
    answers === "SKIPPED"
      ? { label: "Skipped", color: "text-amber-400 bg-amber-500/10" }
      : answers
        ? { label: "Completed", color: "text-green-400 bg-green-500/10" }
        : { label: "Pending", color: "text-zinc-400 bg-zinc-500/10" };

  return (
    <SectionCard title="AI Review Findings">
      <div className="space-y-4">
        {/* Review Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${reviewStatus.color}`}>
            Review: {reviewStatus.label}
          </span>
        </div>

        {/* Gaps */}
        {gaps && gaps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-amber-400 mb-2">
              Gaps Identified
            </h4>
            <ul className="space-y-1">
              {gaps.map((gap, i) => (
                <li key={i} className="text-sm text-zinc-300 flex gap-2">
                  <span className="text-amber-500">•</span> {gap}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-blue-400 mb-2">
              Recommendations
            </h4>
            <ul className="space-y-1">
              {recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-zinc-300 flex gap-2">
                  <span className="text-blue-500">•</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Follow-up Questions & Answers */}
        {questions && questions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-2">
              Follow-up Questions
            </h4>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-sm text-zinc-300 mb-1">{q.question}</div>
                  <div className="text-sm text-blue-400">
                    {answers === "SKIPPED"
                      ? "—"
                      : answers
                          ?.split(",")
                          .find((a) => a.trim().startsWith(q.header + "="))
                          ?.split("=")[1]
                          ?.trim() || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

function PRDViewer({
  prd,
}: {
  prd: {
    summary: string;
    userStories: Array<{
      id: string;
      title: string;
      description: string;
      acceptanceCriteria: string[];
    }>;
    functionalRequirements: Array<{
      id: string;
      description: string;
    }>;
    nonGoals: string[];
  };
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-zinc-400 mb-2">Summary</h4>
        <p className="text-white">{prd.summary}</p>
      </div>

      {expanded && (
        <>
          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-2">
              User Stories ({prd.userStories.length})
            </h4>
            <div className="space-y-3">
              {prd.userStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-zinc-500">
                      {story.id}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {story.title}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-2">
                    {story.description}
                  </p>
                  <div className="text-xs text-zinc-500">
                    {story.acceptanceCriteria.length} acceptance criteria
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-2">
              Functional Requirements ({prd.functionalRequirements.length})
            </h4>
            <ul className="space-y-2">
              {prd.functionalRequirements.map((req) => (
                <li
                  key={req.id}
                  className="flex gap-2 text-sm text-zinc-300"
                >
                  <span className="text-zinc-500 font-mono">{req.id}</span>
                  <span>{req.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {prd.nonGoals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-400 mb-2">
                Non-Goals
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {prd.nonGoals.map((goal, i) => (
                  <li key={i} className="text-sm text-zinc-300">
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        {expanded ? "Show less" : "Show full PRD"}
      </button>
    </div>
  );
}

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const inquiry = useQuery(api.admin.getInquiry, {
    id: id as Id<"projectInquiries">,
  });
  const updateStatus = useMutation(api.admin.updateInquiryStatus);
  const updateNotes = useMutation(api.admin.updateInquiryNotes);

  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize notes when inquiry loads
  if (inquiry && notes === undefined) {
    setNotes(inquiry.reviewNotes || "");
  }

  if (inquiry === undefined) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded mb-6" />
        <div className="space-y-6">
          <div className="h-48 bg-zinc-800 rounded-xl" />
          <div className="h-96 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (inquiry === null) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-2">
          Inquiry Not Found
        </h1>
        <p className="text-zinc-400 mb-6">
          This inquiry may have been deleted.
        </p>
        <Link
          href="/admin/inquiries"
          className="text-blue-400 hover:text-blue-300"
        >
          Back to Inquiries
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = async (status: InquiryStatus) => {
    await updateStatus({ id: inquiry._id, status });
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    await updateNotes({ id: inquiry._id, notes: notes || "" });
    setIsSaving(false);
  };

  const prd = inquiry.enhancedPRD || inquiry.initialPRD || inquiry.prd;
  const estimate = inquiry.estimateMin && inquiry.estimateMax
    ? { min: inquiry.estimateMin, max: inquiry.estimateMax, isAI: true }
    : { min: inquiry.roughMin, max: inquiry.roughMax, isAI: false };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/inquiries"
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{inquiry.email}</h1>
          <p className="text-zinc-400">
            Submitted {formatDate(inquiry.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {formatCurrency(estimate.min)} - {formatCurrency(estimate.max)}
          </div>
          <div className="text-sm text-zinc-500">
            {estimate.isAI ? "AI Estimate" : "Rough Estimate"}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Status
        </label>
        <StatusUpdater
          currentStatus={inquiry.status as InquiryStatus}
          onUpdate={handleStatusUpdate}
        />
      </div>

      {/* Stage Progress - shows V2 inquiry flow progression */}
      {inquiry.stage && <StageProgress stage={inquiry.stage} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <SectionCard title="Project Description">
            <p className="text-zinc-300 whitespace-pre-wrap">
              {inquiry.description}
            </p>
          </SectionCard>

          {/* AI Questions & Answers */}
          {inquiry.generatedQuestionsV2 && inquiry.answers && (
            <SectionCard title="Discovery Questions">
              <div className="space-y-4">
                {inquiry.generatedQuestionsV2.map((q, i) => (
                  <div key={i} className="border-b border-zinc-800 pb-4 last:border-0">
                    <div className="text-sm font-medium text-zinc-300 mb-1">
                      {q.question}
                    </div>
                    <div className="text-sm text-blue-400">
                      {/* Parse answer from the answers string */}
                      {inquiry.answers?.split(",").find((a) =>
                        a.trim().startsWith(q.header + "=")
                      )?.split("=")[1]?.trim() || "—"}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* AI Review Findings - shows gaps, recommendations, and follow-up Q&A */}
          <ReviewerFindings
            gaps={inquiry.reviewerGaps}
            recommendations={inquiry.reviewerRecommendations}
            questions={inquiry.reviewerQuestions}
            answers={inquiry.reviewerAnswers}
          />

          {/* PRD - with comparison when both initial and enhanced exist */}
          {prd && (
            <SectionCard title="Product Requirements">
              {inquiry.initialPRD && inquiry.enhancedPRD ? (
                <div className="space-y-4">
                  {/* PRD Evolution Badge */}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs bg-zinc-700 text-zinc-300 rounded">
                      Initial
                    </span>
                    <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                      Enhanced (Final)
                    </span>
                  </div>

                  {/* Enhanced PRD (primary view) */}
                  <PRDViewer prd={inquiry.enhancedPRD} />

                  {/* Collapsible Initial PRD */}
                  <details className="group mt-4">
                    <summary className="text-sm text-zinc-500 cursor-pointer hover:text-zinc-300 flex items-center gap-2">
                      <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      View Initial PRD (before AI review enhancements)
                    </summary>
                    <div className="mt-3 pt-3 border-t border-zinc-700">
                      <PRDViewer prd={inquiry.initialPRD} />
                    </div>
                  </details>
                </div>
              ) : (
                <PRDViewer prd={prd} />
              )}
            </SectionCard>
          )}

          {/* Line Items */}
          {inquiry.lineItems && inquiry.lineItems.length > 0 && (
            <SectionCard title="Cost Breakdown">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 uppercase">
                    <th className="pb-3">Item</th>
                    <th className="pb-3 text-right">Hours</th>
                    <th className="pb-3 text-right">Cost</th>
                    <th className="pb-3 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {inquiry.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-zinc-300">{item.title}</td>
                      <td className="py-3 text-right text-zinc-400">
                        {item.hours}h
                      </td>
                      <td className="py-3 text-right text-white">
                        {formatCurrency(item.cost)}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            item.confidence === "high"
                              ? "bg-green-500/20 text-green-400"
                              : item.confidence === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {item.confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-zinc-700">
                  <tr>
                    <td className="pt-3 font-medium text-white">Total</td>
                    <td className="pt-3 text-right text-zinc-400">
                      {inquiry.estimateTotalHours}h
                    </td>
                    <td className="pt-3 text-right font-medium text-white">
                      {formatCurrency(inquiry.estimateSubtotal || 0)}
                    </td>
                    <td></td>
                  </tr>
                  {inquiry.estimateRiskBuffer && (
                    <tr>
                      <td className="pt-1 text-zinc-400">
                        Risk Buffer ({inquiry.estimateRiskPercent}%)
                      </td>
                      <td></td>
                      <td className="pt-1 text-right text-zinc-400">
                        +{formatCurrency(inquiry.estimateRiskBuffer)}
                      </td>
                      <td></td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </SectionCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <SectionCard title="Contact">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500">Email</label>
                <div className="text-white">{inquiry.email}</div>
              </div>
              {inquiry.name && (
                <div>
                  <label className="text-xs text-zinc-500">Name</label>
                  <div className="text-white">{inquiry.name}</div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Keywords */}
          {inquiry.keywords && inquiry.keywords.length > 0 && (
            <SectionCard title="Detected Keywords">
              <div className="flex flex-wrap gap-2">
                {inquiry.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Notes */}
          <SectionCard title="Admin Notes">
            <textarea
              value={notes || ""}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this inquiry..."
              className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <button
              onClick={handleSaveNotes}
              disabled={isSaving}
              className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isSaving ? "Saving..." : "Save Notes"}
            </button>
          </SectionCard>

          {/* Metadata */}
          <SectionCard title="Metadata">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Created</span>
                <span className="text-white">
                  {formatDate(inquiry.createdAt)}
                </span>
              </div>
              {inquiry.reviewedAt && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Reviewed</span>
                  <span className="text-white">
                    {formatDate(inquiry.reviewedAt)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500">Stage</span>
                <span className="text-white">{inquiry.stage || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">AI Review</span>
                <span
                  className={
                    inquiry.reviewerAnswers === "SKIPPED"
                      ? "text-amber-400"
                      : inquiry.reviewerAnswers
                        ? "text-green-400"
                        : "text-zinc-400"
                  }
                >
                  {inquiry.reviewerAnswers === "SKIPPED"
                    ? "Skipped"
                    : inquiry.reviewerAnswers
                      ? "Completed"
                      : inquiry.reviewerGaps?.length
                        ? "Pending"
                        : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">AI Used</span>
                <span className="text-white">
                  {inquiry.usedAI ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
