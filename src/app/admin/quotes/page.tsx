"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

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
  });
}

export default function QuotesPage() {
  const quotes = useQuery(api.admin.listQuotes);

  if (!quotes) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded mb-6" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-zinc-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Quotes</h1>
        <p className="text-zinc-400 mt-1">
          Formal quotes sent to clients
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Total Quotes</div>
          <div className="text-2xl font-bold text-white">{quotes.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Sent</div>
          <div className="text-2xl font-bold text-blue-400">
            {quotes.filter((q) => q.status === "sent").length}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Viewed</div>
          <div className="text-2xl font-bold text-yellow-400">
            {quotes.filter((q) => q.status === "viewed").length}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Accepted</div>
          <div className="text-2xl font-bold text-green-400">
            {quotes.filter((q) => q.status === "accepted").length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Share Link
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase">
                Price Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Viewed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  No quotes yet
                </td>
              </tr>
            ) : (
              quotes.map((quote) => (
                <tr key={quote._id} className="hover:bg-zinc-800/50">
                  <td className="px-6 py-4 text-sm text-white">
                    {quote.email}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/q/${quote.shareId}`}
                      target="_blank"
                      className="text-sm text-blue-400 hover:text-blue-300 font-mono"
                    >
                      /q/{quote.shareId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-white text-right">
                    {formatCurrency(quote.snapshot.priceMin)} - {formatCurrency(quote.snapshot.priceMax)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        quote.status === "accepted"
                          ? "bg-green-500/10 text-green-400"
                          : quote.status === "viewed"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {formatDate(quote.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {quote.viewedAt ? formatDate(quote.viewedAt) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
