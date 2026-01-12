"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

type InquiryStatus = "new" | "reviewed" | "quoted" | "converted";

const statusColors: Record<InquiryStatus, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  reviewed: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  quoted: "bg-green-500/10 text-green-400 border-green-500/20",
  converted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const statusLabels: Record<InquiryStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
  quoted: "Quoted",
  converted: "Converted",
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
  });
}

function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function FilterTabs({
  activeStatus,
  counts,
}: {
  activeStatus: InquiryStatus | null;
  counts: Record<InquiryStatus | "all", number>;
}) {
  const router = useRouter();

  const tabs = [
    { key: null, label: "All", count: counts.all },
    { key: "new" as const, label: "New", count: counts.new },
    { key: "reviewed" as const, label: "Reviewed", count: counts.reviewed },
    { key: "quoted" as const, label: "Quoted", count: counts.quoted },
    { key: "converted" as const, label: "Converted", count: counts.converted },
  ];

  return (
    <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.key ?? "all"}
          onClick={() => {
            if (tab.key) {
              router.push(`/admin/inquiries?status=${tab.key}`);
            } else {
              router.push("/admin/inquiries");
            }
          }}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeStatus === tab.key
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          }`}
        >
          {tab.label}
          {tab.count > 0 && (
            <span className="ml-2 text-xs text-zinc-500">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function InquiriesPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") as InquiryStatus | null;

  const inquiries = useQuery(api.admin.listInquiries, {
    status: statusFilter || undefined,
  });

  const allInquiries = useQuery(api.admin.listInquiries, {});

  // Calculate counts for filter tabs
  const counts = {
    all: allInquiries?.length ?? 0,
    new: allInquiries?.filter((i) => i.status === "new").length ?? 0,
    reviewed: allInquiries?.filter((i) => i.status === "reviewed").length ?? 0,
    quoted: allInquiries?.filter((i) => i.status === "quoted").length ?? 0,
    converted: allInquiries?.filter((i) => i.status === "converted").length ?? 0,
  };

  if (!inquiries) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded mb-6" />
        <div className="h-12 bg-zinc-800 rounded mb-4" />
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Inquiries</h1>
          <p className="text-zinc-400 mt-1">
            Manage project inquiries and estimates
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterTabs activeStatus={statusFilter} counts={counts} />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Estimate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  No inquiries found
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr
                  key={inquiry._id}
                  className="hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/inquiries/${inquiry._id}`}
                      className="block"
                    >
                      <div className="text-sm font-medium text-white">
                        {inquiry.email}
                      </div>
                      {inquiry.name && (
                        <div className="text-sm text-zinc-500">
                          {inquiry.name}
                        </div>
                      )}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/inquiries/${inquiry._id}`}
                      className="block"
                    >
                      <div className="text-sm text-zinc-300 max-w-md truncate">
                        {inquiry.description.slice(0, 100)}
                        {inquiry.description.length > 100 && "..."}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/inquiries/${inquiry._id}`}
                      className="block"
                    >
                      <div className="text-sm text-white">
                        {inquiry.estimateMin && inquiry.estimateMax
                          ? `${formatCurrency(inquiry.estimateMin)} - ${formatCurrency(inquiry.estimateMax)}`
                          : inquiry.roughMin && inquiry.roughMax
                            ? `${formatCurrency(inquiry.roughMin)} - ${formatCurrency(inquiry.roughMax)}`
                            : "—"}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/inquiries/${inquiry._id}`}
                      className="block"
                    >
                      <StatusBadge status={inquiry.status as InquiryStatus} />
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/inquiries/${inquiry._id}`}
                      className="block"
                    >
                      <div className="text-sm text-zinc-400">
                        {formatDate(inquiry.createdAt)}
                      </div>
                    </Link>
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
