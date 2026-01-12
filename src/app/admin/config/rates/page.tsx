"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useState } from "react";

type RateCard = {
  _id: Id<"rateCards">;
  name: string;
  hourlyRate: number;
  tokenRateIn: number;
  tokenRateOut: number;
  markup: number;
  isActive: boolean;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

function RateCardTile({
  rateCard,
  onEdit,
  onSetActive,
}: {
  rateCard: RateCard;
  onEdit: (rateCard: RateCard) => void;
  onSetActive: (id: Id<"rateCards">) => void;
}) {
  return (
    <div
      className={`bg-zinc-900 border rounded-xl p-6 ${
        rateCard.isActive
          ? "border-green-500/50 ring-1 ring-green-500/20"
          : "border-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{rateCard.name}</h3>
          {rateCard.isActive && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-400 rounded mt-1">
              Active
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(rateCard)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Edit
          </button>
          {!rateCard.isActive && (
            <button
              onClick={() => onSetActive(rateCard._id)}
              className="text-green-400 hover:text-green-300 text-sm"
            >
              Set Active
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-zinc-500 mb-1">Hourly Rate</div>
          <div className="text-xl font-bold text-white">
            {formatCurrency(rateCard.hourlyRate)}
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500 mb-1">Markup</div>
          <div className="text-xl font-bold text-white">
            {(rateCard.markup * 100).toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500 mb-1">Token Rate In</div>
          <div className="text-sm text-zinc-300">
            {formatCurrency(rateCard.tokenRateIn)}/1K
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500 mb-1">Token Rate Out</div>
          <div className="text-sm text-zinc-300">
            {formatCurrency(rateCard.tokenRateOut)}/1K
          </div>
        </div>
      </div>
    </div>
  );
}

function EditRateCardModal({
  rateCard,
  onClose,
}: {
  rateCard: RateCard;
  onClose: () => void;
}) {
  const updateRateCard = useMutation(api.admin.updateRateCard);
  const [formData, setFormData] = useState({
    name: rateCard.name,
    hourlyRate: rateCard.hourlyRate,
    tokenRateIn: rateCard.tokenRateIn,
    tokenRateOut: rateCard.tokenRateOut,
    markup: rateCard.markup,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateRateCard({
      id: rateCard._id,
      updates: formData,
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg mx-4">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Edit Rate Card</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Markup (%)
              </label>
              <input
                type="number"
                step="1"
                value={formData.markup * 100}
                onChange={(e) => setFormData({ ...formData, markup: parseFloat(e.target.value) / 100 })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Token Rate In ($ per 1K)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.tokenRateIn}
                onChange={(e) => setFormData({ ...formData, tokenRateIn: parseFloat(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Token Rate Out ($ per 1K)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.tokenRateOut}
                onChange={(e) => setFormData({ ...formData, tokenRateOut: parseFloat(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RatesConfigPage() {
  const rateCards = useQuery(api.admin.getRateCards);
  const setActiveRateCard = useMutation(api.admin.setActiveRateCard);
  const [editingRateCard, setEditingRateCard] = useState<RateCard | null>(null);

  if (!rateCards) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-zinc-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const handleSetActive = async (id: Id<"rateCards">) => {
    await setActiveRateCard({ id });
  };

  const activeCard = rateCards.find((r) => r.isActive);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Rate Cards</h1>
        <p className="text-zinc-400 mt-1">
          Configure pricing rates for estimates
        </p>
      </div>

      {/* Active Rate Summary */}
      {activeCard && (
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-400">
              Active Rate Card: {activeCard.name}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-zinc-500">Hourly Rate</div>
              <div className="text-lg font-bold text-white">
                {formatCurrency(activeCard.hourlyRate)}/hr
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Markup</div>
              <div className="text-lg font-bold text-white">
                {(activeCard.markup * 100).toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Effective Rate</div>
              <div className="text-lg font-bold text-white">
                {formatCurrency(activeCard.hourlyRate * (1 + activeCard.markup))}/hr
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Token Costs</div>
              <div className="text-sm text-zinc-300">
                In: {formatCurrency(activeCard.tokenRateIn)}/1K<br />
                Out: {formatCurrency(activeCard.tokenRateOut)}/1K
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rateCards.map((rateCard) => (
          <RateCardTile
            key={rateCard._id}
            rateCard={rateCard as RateCard}
            onEdit={setEditingRateCard}
            onSetActive={handleSetActive}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editingRateCard && (
        <EditRateCardModal
          rateCard={editingRateCard}
          onClose={() => setEditingRateCard(null)}
        />
      )}
    </div>
  );
}
