"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { PlaygroundForm } from "@/components/admin/playground-form";
import Link from "next/link";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

type PlaygroundTest = {
  _id: Id<"playgroundTests">;
  description: string;
  stage: string;
  estimateMin?: number;
  estimateMax?: number;
  createdAt: number;
  completedAt?: number;
  debugInfo?: {
    questionsCall?: { tokensIn: number; tokensOut: number; durationMs: number };
    prdCall?: { tokensIn: number; tokensOut: number; durationMs: number };
    reviewCall?: { tokensIn: number; tokensOut: number; durationMs: number };
    enhanceCall?: { tokensIn: number; tokensOut: number; durationMs: number };
    estimateCall?: { tokensIn: number; tokensOut: number; durationMs: number };
    totalCost?: number;
  };
  error?: string;
};

function TestHistoryItem({
  test,
  isSelected,
  onClick,
}: {
  test: PlaygroundTest;
  isSelected: boolean;
  onClick: () => void;
}) {
  const stageColors: Record<string, string> = {
    questions: "bg-blue-500/20 text-blue-400",
    "initial-prd": "bg-yellow-500/20 text-yellow-400",
    review: "bg-purple-500/20 text-purple-400",
    enhanced: "bg-cyan-500/20 text-cyan-400",
    estimated: "bg-green-500/20 text-green-400",
    error: "bg-red-500/20 text-red-400",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-500/10"
          : "border-zinc-800 hover:border-zinc-700 bg-zinc-900"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-white truncate">
            {test.description.slice(0, 50)}
            {test.description.length > 50 && "..."}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${stageColors[test.stage] || "bg-zinc-700 text-zinc-400"}`}
            >
              {test.stage}
            </span>
            <span className="text-xs text-zinc-500">
              {formatDate(test.createdAt)}
            </span>
          </div>
        </div>
        {test.estimateMin && test.estimateMax && (
          <div className="text-xs text-zinc-400">
            {formatCurrency(test.estimateMin)}
          </div>
        )}
      </div>
    </button>
  );
}

function DebugPanel({ test }: { test: PlaygroundTest }) {
  const [expandedCalls, setExpandedCalls] = useState<Set<string>>(new Set());

  const toggleCall = (callName: string) => {
    setExpandedCalls((prev) => {
      const next = new Set(prev);
      if (next.has(callName)) {
        next.delete(callName);
      } else {
        next.add(callName);
      }
      return next;
    });
  };

  if (!test.debugInfo) {
    return (
      <div className="text-sm text-zinc-500 text-center py-4">
        No debug info available
      </div>
    );
  }

  const calls = [
    { key: "questionsCall", name: "Generate Questions", data: test.debugInfo.questionsCall },
    { key: "prdCall", name: "Generate PRD", data: test.debugInfo.prdCall },
    { key: "reviewCall", name: "Review PRD", data: test.debugInfo.reviewCall },
    { key: "enhanceCall", name: "Enhance PRD", data: test.debugInfo.enhanceCall },
    { key: "estimateCall", name: "Generate Estimate", data: test.debugInfo.estimateCall },
  ].filter((c) => c.data);

  const totalTokensIn = calls.reduce((sum, c) => sum + (c.data?.tokensIn || 0), 0);
  const totalTokensOut = calls.reduce((sum, c) => sum + (c.data?.tokensOut || 0), 0);
  const totalDuration = calls.reduce((sum, c) => sum + (c.data?.durationMs || 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-zinc-800/50 rounded-lg p-3">
          <div className="text-xs text-zinc-500">Tokens In</div>
          <div className="text-lg font-medium text-white">
            {totalTokensIn.toLocaleString()}
          </div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3">
          <div className="text-xs text-zinc-500">Tokens Out</div>
          <div className="text-lg font-medium text-white">
            {totalTokensOut.toLocaleString()}
          </div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3">
          <div className="text-xs text-zinc-500">Total Time</div>
          <div className="text-lg font-medium text-white">
            {formatDuration(totalDuration)}
          </div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3">
          <div className="text-xs text-zinc-500">Est. Cost</div>
          <div className="text-lg font-medium text-green-400">
            ${(test.debugInfo.totalCost || 0).toFixed(4)}
          </div>
        </div>
      </div>

      {/* Call breakdown */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-zinc-400">AI Calls</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-zinc-500 uppercase">
              <th className="text-left pb-2">Stage</th>
              <th className="text-right pb-2">Tokens In</th>
              <th className="text-right pb-2">Tokens Out</th>
              <th className="text-right pb-2">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {calls.map((call) => (
              <tr key={call.key} className="text-zinc-300">
                <td className="py-2">{call.name}</td>
                <td className="py-2 text-right">
                  {call.data?.tokensIn.toLocaleString()}
                </td>
                <td className="py-2 text-right">
                  {call.data?.tokensOut.toLocaleString()}
                </td>
                <td className="py-2 text-right">
                  {formatDuration(call.data?.durationMs || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TestDetailPanel({
  test,
  onPromote,
  onDelete,
}: {
  test: PlaygroundTest;
  onPromote: () => void;
  onDelete: () => void;
}) {
  const fullTest = useQuery(api.playground.get, { id: test._id });
  const [showDebug, setShowDebug] = useState(false);
  const [promoteEmail, setPromoteEmail] = useState("");
  const [showPromoteForm, setShowPromoteForm] = useState(false);

  if (!fullTest) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-zinc-500">
            {formatDate(fullTest.createdAt)}
          </div>
          <h3 className="text-lg font-medium text-white mt-1">
            {fullTest.description.slice(0, 100)}
            {fullTest.description.length > 100 && "..."}
          </h3>
        </div>
        {fullTest.estimateMin && fullTest.estimateMax && (
          <div className="text-right">
            <div className="text-xl font-bold text-white">
              {formatCurrency(fullTest.estimateMin)} -{" "}
              {formatCurrency(fullTest.estimateMax)}
            </div>
            <div className="text-sm text-zinc-500">
              {fullTest.estimateConfidence} confidence
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {fullTest.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="text-sm text-red-400">{fullTest.error}</div>
        </div>
      )}

      {/* Line items */}
      {fullTest.lineItems && fullTest.lineItems.length > 0 && (
        <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-zinc-700">
            <div className="text-sm font-medium text-zinc-400">Line Items</div>
          </div>
          <div className="divide-y divide-zinc-700">
            {fullTest.lineItems.map((item) => (
              <div key={item.id} className="px-4 py-2 flex justify-between">
                <div className="text-sm text-white">{item.title}</div>
                <div className="text-sm text-zinc-400">
                  {item.hours}h • {formatCurrency(item.cost)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug toggle */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="w-full px-4 py-2 text-sm text-left text-zinc-400 hover:text-white bg-zinc-800/50 rounded-lg transition-colors flex items-center justify-between"
      >
        <span>Debug Info</span>
        <svg
          className={`w-4 h-4 transition-transform ${showDebug ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDebug && (
        <DebugPanel test={fullTest as PlaygroundTest} />
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-zinc-800">
        {fullTest.stage === "estimated" && !showPromoteForm && (
          <button
            onClick={() => setShowPromoteForm(true)}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Promote to Inquiry
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Promote form */}
      {showPromoteForm && (
        <div className="p-4 bg-zinc-800/50 rounded-lg space-y-3">
          <div className="text-sm font-medium text-white">
            Promote to Real Inquiry
          </div>
          <input
            type="email"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                onPromote();
                setShowPromoteForm(false);
              }}
              disabled={!promoteEmail.includes("@")}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Promote
            </button>
            <button
              onClick={() => setShowPromoteForm(false)}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlaygroundPage() {
  const tests = useQuery(api.playground.list);
  const deleteTest = useMutation(api.playground.deleteTest);
  const clearAll = useMutation(api.playground.clearAll);
  const promoteToInquiry = useMutation(api.playground.promoteToInquiry);

  const [selectedTestId, setSelectedTestId] = useState<Id<"playgroundTests"> | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");

  const selectedTest = tests?.find((t) => t._id === selectedTestId);

  const handleTestCreated = (testId: Id<"playgroundTests">) => {
    setSelectedTestId(testId);
  };

  const handleDelete = async (testId: Id<"playgroundTests">) => {
    await deleteTest({ id: testId });
    if (selectedTestId === testId) {
      setSelectedTestId(null);
    }
  };

  const handleClearAll = async () => {
    if (confirm("Delete all playground tests?")) {
      await clearAll();
      setSelectedTestId(null);
    }
  };

  const handlePromote = async (testId: Id<"playgroundTests">, email: string) => {
    await promoteToInquiry({ id: testId, email });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
          <Link href="/admin" className="hover:text-zinc-300">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-zinc-300">Playground</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">PRD Playground</h1>
            <p className="text-zinc-400 mt-1">
              Test the AI estimation flow without creating real inquiries
            </p>
          </div>
          {tests && tests.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              Clear All Tests
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: New test form / Test history */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-zinc-900 rounded-lg mb-4">
            <button
              onClick={() => setActiveTab("new")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "new"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              New Test
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "history"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              History ({tests?.length || 0})
            </button>
          </div>

          {/* Content */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            {activeTab === "new" ? (
              <PlaygroundForm onTestCreated={handleTestCreated} />
            ) : (
              <div className="space-y-2">
                {!tests ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : tests.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    No tests yet. Run a test to see history here.
                  </div>
                ) : (
                  tests.map((test) => (
                    <TestHistoryItem
                      key={test._id}
                      test={test as PlaygroundTest}
                      isSelected={selectedTestId === test._id}
                      onClick={() => setSelectedTestId(test._id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected test details */}
        <div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            {selectedTest ? (
              <TestDetailPanel
                test={selectedTest as PlaygroundTest}
                onPromote={() =>
                  handlePromote(selectedTest._id, "test@example.com")
                }
                onDelete={() => handleDelete(selectedTest._id)}
              />
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-zinc-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p>Run a test or select from history to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
