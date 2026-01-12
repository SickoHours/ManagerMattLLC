"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

function StatsCard({
  title,
  value,
  description,
  href,
}: {
  title: string;
  value: string | number;
  description?: string;
  href?: string;
}) {
  const content = (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
      <div className="text-sm font-medium text-zinc-400">{title}</div>
      <div className="mt-2 text-3xl font-bold text-white">{value}</div>
      {description && (
        <div className="mt-1 text-sm text-zinc-500">{description}</div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminDashboard() {
  const stats = useQuery(api.admin.getStats);
  const recentInquiries = useQuery(api.admin.getRecentInquiries, { limit: 5 });

  if (!stats) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-zinc-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          Overview of your Manager Matt business
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="New Inquiries"
          value={stats.newInquiries}
          description="Awaiting review"
          href="/admin/inquiries?status=new"
        />
        <StatsCard
          title="Total Inquiries"
          value={stats.totalInquiries}
          description="All time"
          href="/admin/inquiries"
        />
        <StatsCard
          title="Quotes Sent"
          value={stats.quotesSent}
          description={`${stats.quotesViewed} viewed`}
        />
        <StatsCard
          title="Potential Revenue"
          value={formatCurrency(stats.potentialRevenue)}
          description="From active quotes"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Inquiries</h2>
          <Link
            href="/admin/inquiries"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-zinc-800">
          {recentInquiries?.map((inquiry) => (
            <Link
              key={inquiry._id}
              href={`/admin/inquiries/${inquiry._id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-800/50 transition-colors"
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  inquiry.status === "new"
                    ? "bg-blue-500"
                    : inquiry.status === "reviewed"
                    ? "bg-yellow-500"
                    : inquiry.status === "quoted"
                    ? "bg-green-500"
                    : "bg-zinc-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {inquiry.email}
                </div>
                <div className="text-sm text-zinc-400 truncate">
                  {inquiry.description.slice(0, 80)}...
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white">
                  {inquiry.estimateMin && inquiry.estimateMax
                    ? `${formatCurrency(inquiry.estimateMin)} - ${formatCurrency(inquiry.estimateMax)}`
                    : inquiry.roughMin && inquiry.roughMax
                    ? `${formatCurrency(inquiry.roughMin)} - ${formatCurrency(inquiry.roughMax)}`
                    : "No estimate"}
                </div>
                <div className="text-xs text-zinc-500">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          )) ?? (
            <div className="px-6 py-8 text-center text-zinc-500">
              No inquiries yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
