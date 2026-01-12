"use client";

import { InquiryForm } from "@/components/estimate/inquiry-form";
import Link from "next/link";

export default function PlaygroundPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
          <Link href="/admin" className="hover:text-zinc-300">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-zinc-300">Estimate Playground</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Estimate Playground</h1>
        <p className="text-zinc-400 mt-1">
          Test the full estimate flow in admin mode
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm text-blue-300 font-medium">Testing Mode</p>
            <p className="text-sm text-zinc-400 mt-1">
              This is the full estimate generator. Submissions will create real
              inquiries in your database that you can view in the Inquiries section.
            </p>
          </div>
        </div>
      </div>

      {/* Estimate Form - Override styles for admin context */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="[&_.bg-background]:bg-zinc-900 [&_.bg-surface]:bg-zinc-800 [&_.border-border]:border-zinc-700">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
