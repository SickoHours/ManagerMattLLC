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

export default function EstimatesPage() {
  const estimates = useQuery(api.estimates.list);

  if (!estimates) {
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
        <h1 className="text-2xl font-bold text-white">Estimates</h1>
        <p className="text-zinc-400 mt-1">
          Detailed estimates created from the wizard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Total Estimates</div>
          <div className="text-2xl font-bold text-white">{estimates.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Draft</div>
          <div className="text-2xl font-bold text-white">
            {estimates.filter((e) => e.status === "draft").length}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Quoted</div>
          <div className="text-2xl font-bold text-white">
            {estimates.filter((e) => e.status === "quoted").length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Modules
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Quality
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase">
                Price Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {estimates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  No estimates yet
                </td>
              </tr>
            ) : (
              estimates.map((estimate) => (
                <tr key={estimate._id} className="hover:bg-zinc-800/50">
                  <td className="px-6 py-4 text-sm text-zinc-300">
                    {formatDate(estimate.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded capitalize">
                      {estimate.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {estimate.modules.length} modules
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded capitalize ${
                        estimate.quality === "production"
                          ? "bg-green-500/10 text-green-400"
                          : estimate.quality === "mvp"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {estimate.quality}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white text-right">
                    {formatCurrency(estimate.priceMin)} - {formatCurrency(estimate.priceMax)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        estimate.status === "quoted"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {estimate.status}
                    </span>
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
