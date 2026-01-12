"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useState, useMemo } from "react";

type RateCard = {
  _id: Id<"rateCards">;
  name: string;
  hourlyRate: number;
  tokenRateIn: number;
  tokenRateOut: number;
  markup: number;
  isActive: boolean;
};

// Tooltip component for field explanations
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors"
      >
        <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      {show && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg text-xs text-zinc-300">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800" />
        </div>
      )}
    </span>
  );
}

function formatCurrency(amount: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
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
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {!rateCard.isActive && (
            <button
              onClick={() => onSetActive(rateCard._id)}
              className="text-xs text-green-400 hover:text-green-300 px-2 py-1 bg-green-500/10 hover:bg-green-500/20 rounded transition-colors"
            >
              Set Active
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-zinc-500 flex items-center">
            Development Rate
            <Tooltip text="Cost charged per hour of development work." />
          </div>
          <div className="text-xl font-bold text-white">
            {formatCurrency(rateCard.hourlyRate)}/hr
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500 flex items-center">
            Business Overhead
            <Tooltip text="Markup percentage added to cover tools, support, and other business costs." />
          </div>
          <div className="text-xl font-bold text-white">
            {(rateCard.markup * 100).toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500 flex items-center">
            AI Input Cost
            <Tooltip text="Cost per 1,000 tokens of AI input (sending prompts to the AI)." />
          </div>
          <div className="text-sm text-zinc-300">
            {formatCurrency(rateCard.tokenRateIn, 4)}/1K tokens
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500 flex items-center">
            AI Output Cost
            <Tooltip text="Cost per 1,000 tokens of AI output (receiving responses from the AI)." />
          </div>
          <div className="text-sm text-zinc-300">
            {formatCurrency(rateCard.tokenRateOut, 4)}/1K tokens
          </div>
        </div>
      </div>

      {/* Effective rate */}
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-500">Effective hourly rate (with markup)</span>
          <span className="text-lg font-bold text-blue-400">
            {formatCurrency(rateCard.hourlyRate * (1 + rateCard.markup))}/hr
          </span>
        </div>
      </div>
    </div>
  );
}

// Confirmation dialog
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {confirmLabel}
          </button>
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.hourlyRate < 0) newErrors.hourlyRate = "Rate cannot be negative";
    if (formData.tokenRateIn < 0) newErrors.tokenRateIn = "Rate cannot be negative";
    if (formData.tokenRateOut < 0) newErrors.tokenRateOut = "Rate cannot be negative";
    if (formData.markup < 0) newErrors.markup = "Markup cannot be negative";
    if (formData.markup > 5) newErrors.markup = "Markup seems unusually high (>500%)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    await updateRateCard({
      id: rateCard._id,
      updates: formData,
    });
    setIsSaving(false);
    onClose();
  };

  // Calculate effective rates for preview
  const effectiveHourly = formData.hourlyRate * (1 + formData.markup);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900">
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
            <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
              Rate Card Name
              <Tooltip text="A descriptive name to identify this rate configuration." />
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full bg-zinc-800 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 ${
                errors.name ? "border-red-500" : "border-zinc-700"
              }`}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
                Development Rate ($)
                <Tooltip text="Base cost charged per hour of development work before markup is applied." />
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-zinc-800 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 ${
                  errors.hourlyRate ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.hourlyRate && <p className="text-red-400 text-xs mt-1">{errors.hourlyRate}</p>}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
                Business Overhead (%)
                <Tooltip text="Percentage markup added to cover business costs like tools, insurance, support, etc." />
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={Math.round(formData.markup * 100)}
                onChange={(e) => setFormData({ ...formData, markup: (parseInt(e.target.value) || 0) / 100 })}
                className={`w-full bg-zinc-800 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 ${
                  errors.markup ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.markup && <p className="text-red-400 text-xs mt-1">{errors.markup}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
                AI Input Cost ($/1K)
                <Tooltip text="Cost per 1,000 tokens when sending prompts to AI. Based on your AI provider's pricing." />
              </label>
              <input
                type="number"
                min="0"
                step="0.0001"
                value={formData.tokenRateIn}
                onChange={(e) => setFormData({ ...formData, tokenRateIn: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-zinc-800 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 ${
                  errors.tokenRateIn ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.tokenRateIn && <p className="text-red-400 text-xs mt-1">{errors.tokenRateIn}</p>}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
                AI Output Cost ($/1K)
                <Tooltip text="Cost per 1,000 tokens when receiving AI responses. Usually higher than input cost." />
              </label>
              <input
                type="number"
                min="0"
                step="0.0001"
                value={formData.tokenRateOut}
                onChange={(e) => setFormData({ ...formData, tokenRateOut: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-zinc-800 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 ${
                  errors.tokenRateOut ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.tokenRateOut && <p className="text-red-400 text-xs mt-1">{errors.tokenRateOut}</p>}
            </div>
          </div>

          {/* Live preview */}
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center">
              Live Preview
              <Tooltip text="See how your changes will affect pricing in real-time." />
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-500">Effective hourly rate:</span>
                <span className="block text-lg font-bold text-blue-400">
                  {formatCurrency(effectiveHourly)}/hr
                </span>
              </div>
              <div>
                <span className="text-zinc-500">Example 40hr project:</span>
                <span className="block text-lg font-bold text-white">
                  {formatCurrency(effectiveHourly * 40)}
                </span>
              </div>
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

// Live pricing calculator
function PricingCalculator({ rateCards }: { rateCards: RateCard[] }) {
  const [hours, setHours] = useState(40);
  const [tokensIn, setTokensIn] = useState(100);
  const [tokensOut, setTokensOut] = useState(50);

  const calculations = useMemo(() => {
    return rateCards.map((card) => {
      const laborCost = hours * card.hourlyRate * (1 + card.markup);
      const aiCost = (tokensIn * card.tokenRateIn + tokensOut * card.tokenRateOut) * (1 + card.markup);
      const total = laborCost + aiCost;
      return { card, laborCost, aiCost, total };
    });
  }, [rateCards, hours, tokensIn, tokensOut]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        Pricing Calculator
        <Tooltip text="Compare how different rate cards would price the same project. Enter estimated hours and AI tokens to see the difference." />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="flex items-center text-sm text-zinc-400 mb-1">
            Development Hours
            <Tooltip text="Estimated total hours of development work." />
          </label>
          <input
            type="number"
            min="0"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value) || 0)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
          />
        </div>
        <div>
          <label className="flex items-center text-sm text-zinc-400 mb-1">
            AI Input (K tokens)
            <Tooltip text="Thousands of tokens sent to AI during development." />
          </label>
          <input
            type="number"
            min="0"
            value={tokensIn}
            onChange={(e) => setTokensIn(parseInt(e.target.value) || 0)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
          />
        </div>
        <div>
          <label className="flex items-center text-sm text-zinc-400 mb-1">
            AI Output (K tokens)
            <Tooltip text="Thousands of tokens received from AI during development." />
          </label>
          <input
            type="number"
            min="0"
            value={tokensOut}
            onChange={(e) => setTokensOut(parseInt(e.target.value) || 0)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs font-medium text-zinc-500 uppercase py-2 px-3">Rate Card</th>
              <th className="text-right text-xs font-medium text-zinc-500 uppercase py-2 px-3">Labor</th>
              <th className="text-right text-xs font-medium text-zinc-500 uppercase py-2 px-3">AI Costs</th>
              <th className="text-right text-xs font-medium text-zinc-500 uppercase py-2 px-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {calculations.map(({ card, laborCost, aiCost, total }) => (
              <tr
                key={card._id}
                className={`border-b border-zinc-800 ${card.isActive ? "bg-green-500/5" : ""}`}
              >
                <td className="py-3 px-3">
                  <span className="text-white font-medium">{card.name}</span>
                  {card.isActive && (
                    <span className="ml-2 text-xs text-green-400">(Active)</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right text-zinc-300">{formatCurrency(laborCost)}</td>
                <td className="py-3 px-3 text-right text-zinc-300">{formatCurrency(aiCost)}</td>
                <td className="py-3 px-3 text-right text-lg font-bold text-white">{formatCurrency(total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RatesConfigPage() {
  const rateCards = useQuery(api.admin.getRateCards);
  const setActiveRateCard = useMutation(api.admin.setActiveRateCard);
  const [editingRateCard, setEditingRateCard] = useState<RateCard | null>(null);
  const [confirmActivate, setConfirmActivate] = useState<Id<"rateCards"> | null>(null);

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

  const handleSetActive = (id: Id<"rateCards">) => {
    setConfirmActivate(id);
  };

  const confirmSetActive = async () => {
    if (confirmActivate) {
      await setActiveRateCard({ id: confirmActivate });
      setConfirmActivate(null);
    }
  };

  const activeCard = rateCards.find((r) => r.isActive);
  const cardToActivate = confirmActivate
    ? rateCards.find((r) => r._id === confirmActivate)
    : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          Rate Cards
          <Tooltip text="Rate cards define how projects are priced. The active rate card is used for all new estimates." />
        </h1>
        <p className="text-zinc-400 mt-1">
          Configure pricing rates for project estimates
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
              <div className="text-xs text-zinc-500 flex items-center">
                Development Rate
                <Tooltip text="Base hourly cost before markup." />
              </div>
              <div className="text-lg font-bold text-white">
                {formatCurrency(activeCard.hourlyRate)}/hr
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 flex items-center">
                Business Overhead
                <Tooltip text="Markup percentage for business costs." />
              </div>
              <div className="text-lg font-bold text-white">
                {(activeCard.markup * 100).toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 flex items-center">
                Effective Rate
                <Tooltip text="Final hourly rate including markup." />
              </div>
              <div className="text-lg font-bold text-blue-400">
                {formatCurrency(activeCard.hourlyRate * (1 + activeCard.markup))}/hr
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">AI Token Costs</div>
              <div className="text-sm text-zinc-300">
                In: {formatCurrency(activeCard.tokenRateIn, 4)}/1K<br />
                Out: {formatCurrency(activeCard.tokenRateOut, 4)}/1K
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Calculator */}
      <PricingCalculator rateCards={rateCards as RateCard[]} />

      {/* Rate Cards Grid */}
      <h2 className="text-lg font-semibold text-white mb-4">All Rate Cards</h2>
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

      {/* Confirmation Dialog */}
      {confirmActivate && cardToActivate && (
        <ConfirmDialog
          title="Change Active Rate Card"
          message={`Are you sure you want to set "${cardToActivate.name}" as the active rate card? This will affect all new estimates.`}
          confirmLabel="Set Active"
          onConfirm={confirmSetActive}
          onCancel={() => setConfirmActivate(null)}
        />
      )}
    </div>
  );
}
