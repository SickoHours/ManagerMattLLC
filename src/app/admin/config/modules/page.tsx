"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useState } from "react";

type Module = {
  _id: Id<"moduleCatalog">;
  moduleId: string;
  name: string;
  description: string;
  category: string;
  baseHours: number;
  baseTokens: number;
  riskWeight: number;
  dependencies: string[];
  architectReviewTrigger?: boolean;
};

function ModuleRow({
  module,
  onEdit,
}: {
  module: Module;
  onEdit: (module: Module) => void;
}) {
  return (
    <tr className="hover:bg-zinc-800/50 transition-colors">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-white">{module.name}</div>
        <div className="text-xs text-zinc-500 font-mono">{module.moduleId}</div>
      </td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded">
          {module.category}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-zinc-300 max-w-xs truncate">
        {module.description}
      </td>
      <td className="px-6 py-4 text-sm text-white text-right">
        {module.baseHours}h
      </td>
      <td className="px-6 py-4 text-sm text-zinc-400 text-right">
        {(module.baseTokens / 1000).toFixed(0)}K
      </td>
      <td className="px-6 py-4 text-sm text-zinc-400 text-right">
        {(module.riskWeight * 100).toFixed(0)}%
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onEdit(module)}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}

function EditModuleModal({
  module,
  onClose,
}: {
  module: Module;
  onClose: () => void;
}) {
  const updateModule = useMutation(api.admin.updateModule);
  const [formData, setFormData] = useState({
    name: module.name,
    description: module.description,
    baseHours: module.baseHours,
    baseTokens: module.baseTokens,
    riskWeight: module.riskWeight,
    architectReviewTrigger: module.architectReviewTrigger || false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateModule({
      id: module._id,
      updates: formData,
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg mx-4">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Edit Module</h3>
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
              Module ID
            </label>
            <div className="text-sm text-zinc-500 font-mono">{module.moduleId}</div>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Base Hours
              </label>
              <input
                type="number"
                value={formData.baseHours}
                onChange={(e) => setFormData({ ...formData, baseHours: parseFloat(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Base Tokens (K)
              </label>
              <input
                type="number"
                value={formData.baseTokens / 1000}
                onChange={(e) => setFormData({ ...formData, baseTokens: parseFloat(e.target.value) * 1000 })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Risk Weight (%)
              </label>
              <input
                type="number"
                value={formData.riskWeight * 100}
                onChange={(e) => setFormData({ ...formData, riskWeight: parseFloat(e.target.value) / 100 })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="architectReview"
              checked={formData.architectReviewTrigger}
              onChange={(e) => setFormData({ ...formData, architectReviewTrigger: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700"
            />
            <label htmlFor="architectReview" className="text-sm text-zinc-300">
              Requires architect review
            </label>
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

export default function ModulesConfigPage() {
  const modules = useQuery(api.admin.getModuleCatalog);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  // Group modules by category
  const groupedModules = modules?.reduce(
    (acc, module) => {
      if (!acc[module.category]) {
        acc[module.category] = [];
      }
      acc[module.category].push(module as Module);
      return acc;
    },
    {} as Record<string, Module[]>
  );

  if (!modules) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-zinc-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const categories = Object.keys(groupedModules || {}).sort();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Module Catalog</h1>
        <p className="text-zinc-400 mt-1">
          Configure module pricing and complexity factors
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Total Modules</div>
          <div className="text-2xl font-bold text-white">{modules.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Categories</div>
          <div className="text-2xl font-bold text-white">{categories.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Avg Base Hours</div>
          <div className="text-2xl font-bold text-white">
            {(modules.reduce((sum, m) => sum + m.baseHours, 0) / modules.length).toFixed(1)}h
          </div>
        </div>
      </div>

      {/* Module Tables by Category */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white capitalize">
                {category}
              </h3>
              <p className="text-sm text-zinc-500">
                {groupedModules![category].length} modules
              </p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase">
                    Tokens
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase">
                    Risk
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {groupedModules![category].map((module) => (
                  <ModuleRow
                    key={module._id}
                    module={module}
                    onEdit={setEditingModule}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingModule && (
        <EditModuleModal
          module={editingModule}
          onClose={() => setEditingModule(null)}
        />
      )}
    </div>
  );
}
