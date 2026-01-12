"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="text-sm font-medium text-zinc-400">{title}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {trend && (
          <span
            className={`text-sm ${
              trend === "up"
                ? "text-green-400"
                : trend === "down"
                  ? "text-red-400"
                  : "text-zinc-400"
            }`}
          >
            {trend === "up" ? "+" : trend === "down" ? "-" : ""}
          </span>
        )}
      </div>
      {subtitle && <div className="mt-1 text-sm text-zinc-500">{subtitle}</div>}
    </div>
  );
}

function FunnelBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm text-zinc-400">
          {count} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-8 bg-zinc-800 rounded-lg overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ConversionFunnel({
  funnel,
  total,
}: {
  funnel: { new: number; reviewed: number; quoted: number; converted: number };
  total: number;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Conversion Funnel
      </h3>
      <div className="space-y-4">
        <FunnelBar
          label="New Inquiries"
          count={funnel.new + funnel.reviewed + funnel.quoted + funnel.converted}
          total={total}
          color="bg-blue-500"
        />
        <FunnelBar
          label="Reviewed"
          count={funnel.reviewed + funnel.quoted + funnel.converted}
          total={total}
          color="bg-yellow-500"
        />
        <FunnelBar
          label="Quoted"
          count={funnel.quoted + funnel.converted}
          total={total}
          color="bg-green-500"
        />
        <FunnelBar
          label="Converted"
          count={funnel.converted}
          total={total}
          color="bg-purple-500"
        />
      </div>
    </div>
  );
}

function ConversionRates({
  rates,
}: {
  rates: { reviewRate: number; quoteRate: number; conversionRate: number };
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Conversion Rates
      </h3>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Review Rate</span>
            <span className="text-lg font-bold text-white">
              {rates.reviewRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all"
              style={{ width: `${Math.min(rates.reviewRate, 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Inquiries that get reviewed
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Quote Rate</span>
            <span className="text-lg font-bold text-white">
              {rates.quoteRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${Math.min(rates.quoteRate, 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Inquiries that receive a quote
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Conversion Rate</span>
            <span className="text-lg font-bold text-white">
              {rates.conversionRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${Math.min(rates.conversionRate, 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Inquiries that become projects
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const stats = useQuery(api.admin.getStats);
  const funnelData = useQuery(api.admin.getConversionFunnel);

  if (!stats || !funnelData) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-zinc-800 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-zinc-800 rounded-xl" />
          <div className="h-80 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-400 mt-1">
          Track performance and conversion metrics
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Inquiries"
          value={stats.totalInquiries}
          subtitle="All time"
        />
        <MetricCard
          title="Quotes Sent"
          value={stats.quotesSent}
          subtitle={`${stats.quotesViewed} viewed (${stats.quotesSent > 0 ? ((stats.quotesViewed / stats.quotesSent) * 100).toFixed(0) : 0}%)`}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${funnelData.rates.conversionRate.toFixed(1)}%`}
          subtitle="Inquiries to projects"
        />
        <MetricCard
          title="Potential Revenue"
          value={formatCurrency(stats.potentialRevenue)}
          subtitle="From active quotes"
        />
      </div>

      {/* Funnel and Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ConversionFunnel funnel={funnelData.funnel} total={funnelData.total} />
        <ConversionRates rates={funnelData.rates} />
      </div>

      {/* Status Breakdown */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Current Pipeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-400">
              {stats.newInquiries}
            </div>
            <div className="text-sm text-zinc-400 mt-1">New</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-3xl font-bold text-yellow-400">
              {stats.reviewedInquiries}
            </div>
            <div className="text-sm text-zinc-400 mt-1">Reviewed</div>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-3xl font-bold text-green-400">
              {stats.quotedInquiries}
            </div>
            <div className="text-sm text-zinc-400 mt-1">Quoted</div>
          </div>
          <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="text-3xl font-bold text-purple-400">
              {stats.convertedInquiries}
            </div>
            <div className="text-sm text-zinc-400 mt-1">Converted</div>
          </div>
        </div>
      </div>
    </div>
  );
}
