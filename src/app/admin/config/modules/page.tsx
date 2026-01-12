"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useState, useMemo } from "react";

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

// Complexity indicator based on risk weight
function ComplexityBadge({ riskWeight }: { riskWeight: number }) {
  if (riskWeight >= 0.3) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2zm0 4l7.5 14h-15L12 6z" />
        </svg>
        Complex
      </span>
    );
  } else if (riskWeight >= 0.15) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Moderate
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" />
      </svg>
      Simple
    </span>
  );
}

function ModuleCard({
  module,
  allModules,
  onEdit,
}: {
  module: Module;
  allModules: Module[];
  onEdit: (module: Module) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  // Find modules that depend on this one
  const dependentModules = allModules.filter((m) =>
    m.dependencies.includes(module.moduleId)
  );

  // Find modules this one depends on
  const dependencyModules = module.dependencies
    .map((depId) => allModules.find((m) => m.moduleId === depId))
    .filter(Boolean) as Module[];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-medium text-white">{module.name}</h3>
          <span className="text-xs text-zinc-500 font-mono">{module.moduleId}</span>
        </div>
        <div className="flex items-center gap-2">
          <ComplexityBadge riskWeight={module.riskWeight} />
          <button
            onClick={() => onEdit(module)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className={`text-sm text-zinc-400 mb-4 ${expanded ? "" : "line-clamp-2"}`}>
        {module.description}
      </p>
      {module.description.length > 100 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-400 hover:text-blue-300 mb-4"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-zinc-800/50 rounded-lg p-2 text-center">
          <div className="text-xs text-zinc-500 flex items-center justify-center">
            Estimated Hours
            <Tooltip text="The typical number of development hours needed for this feature. This is used to calculate labor costs." />
          </div>
          <div className="text-lg font-semibold text-white">{module.baseHours}h</div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-2 text-center">
          <div className="text-xs text-zinc-500 flex items-center justify-center">
            AI Processing
            <Tooltip text="Estimated AI tokens used for this feature. Higher values mean more AI assistance is needed." />
          </div>
          <div className="text-lg font-semibold text-white">{(module.baseTokens / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-2 text-center">
          <div className="text-xs text-zinc-500 flex items-center justify-center">
            Risk Buffer
            <Tooltip text="Additional time buffer for uncertainty. Higher complexity means more potential for unexpected issues." />
          </div>
          <div className="text-lg font-semibold text-white">{(module.riskWeight * 100).toFixed(0)}%</div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded capitalize">
          {module.category}
        </span>
        {module.architectReviewTrigger && (
          <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Requires Expert Review
          </span>
        )}
      </div>

      {/* Dependencies */}
      {(dependencyModules.length > 0 || dependentModules.length > 0) && (
        <div className="border-t border-zinc-800 pt-3 mt-3">
          {dependencyModules.length > 0 && (
            <div className="mb-2">
              <span className="text-xs text-zinc-500">Requires: </span>
              <span className="text-xs text-zinc-400">
                {dependencyModules.map((m) => m.name).join(", ")}
              </span>
            </div>
          )}
          {dependentModules.length > 0 && (
            <div>
              <span className="text-xs text-zinc-500">Used by: </span>
              <span className="text-xs text-zinc-400">
                {dependentModules.map((m) => m.name).join(", ")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.baseHours < 0) newErrors.baseHours = "Hours cannot be negative";
    if (formData.baseTokens < 0) newErrors.baseTokens = "Tokens cannot be negative";
    if (formData.riskWeight < 0 || formData.riskWeight > 1)
      newErrors.riskWeight = "Risk must be 0-100%";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900">
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
            <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
              Module ID
              <Tooltip text="Unique identifier for this module. Cannot be changed." />
            </label>
            <div className="text-sm text-zinc-500 font-mono bg-zinc-800/50 px-3 py-2 rounded-lg">
              {module.moduleId}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
              Display Name
              <Tooltip text="How this module appears to users in the estimator." />
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

          <div>
            <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
              Description
              <Tooltip text="Detailed explanation of what this module includes and how it affects the project." />
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
              <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
                Est. Hours
                <Tooltip text="Typical development hours needed. This directly affects the labor cost portion of estimates." />
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.baseHours}
                onChange={(e) => setFormData({ ...formData, baseHours: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-zinc-800 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 ${
                  errors.baseHours ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.baseHours && <p className="text-red-400 text-xs mt-1">{errors.baseHours}</p>}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
                AI Tokens (K)
                <Tooltip text="Estimated AI processing tokens in thousands. Higher values increase materials cost." />
              </label>
              <input
                type="number"
                min="0"
                value={Math.round(formData.baseTokens / 1000)}
                onChange={(e) => setFormData({ ...formData, baseTokens: (parseInt(e.target.value) || 0) * 1000 })}
                className={`w-full bg-zinc-800 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 ${
                  errors.baseTokens ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.baseTokens && <p className="text-red-400 text-xs mt-1">{errors.baseTokens}</p>}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-zinc-400 mb-1">
                Risk (%)
                <Tooltip text="Uncertainty buffer (0-100%). Complex features should have higher risk to account for unknowns." />
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round(formData.riskWeight * 100)}
                onChange={(e) => setFormData({ ...formData, riskWeight: (parseInt(e.target.value) || 0) / 100 })}
                className={`w-full bg-zinc-800 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 ${
                  errors.riskWeight ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.riskWeight && <p className="text-red-400 text-xs mt-1">{errors.riskWeight}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-lg">
            <input
              type="checkbox"
              id="architectReview"
              checked={formData.architectReviewTrigger}
              onChange={(e) => setFormData({ ...formData, architectReviewTrigger: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="architectReview" className="text-sm text-zinc-300 flex items-center">
              Requires expert review
              <Tooltip text="When enabled, estimates including this module will be flagged for manual review before being finalized." />
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
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [complexityFilter, setComplexityFilter] = useState<"all" | "simple" | "moderate" | "complex">("all");

  // Filter modules
  const filteredModules = useMemo(() => {
    if (!modules) return [];
    return (modules as Module[]).filter((module) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        module.name.toLowerCase().includes(searchLower) ||
        module.description.toLowerCase().includes(searchLower) ||
        module.moduleId.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory = !selectedCategory || module.category === selectedCategory;

      // Complexity filter
      let matchesComplexity = true;
      if (complexityFilter === "simple") matchesComplexity = module.riskWeight < 0.15;
      else if (complexityFilter === "moderate") matchesComplexity = module.riskWeight >= 0.15 && module.riskWeight < 0.3;
      else if (complexityFilter === "complex") matchesComplexity = module.riskWeight >= 0.3;

      return matchesSearch && matchesCategory && matchesComplexity;
    });
  }, [modules, search, selectedCategory, complexityFilter]);

  // Get categories
  const categories = useMemo(() => {
    if (!modules) return [];
    return [...new Set((modules as Module[]).map((m) => m.category))].sort();
  }, [modules]);

  if (!modules) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-zinc-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          Module Catalog
          <Tooltip text="Modules are the building blocks of project estimates. Each module represents a feature or component that can be included in a project." />
        </h1>
        <p className="text-zinc-400 mt-1">
          Configure feature pricing and complexity factors for accurate estimates
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Total Modules</div>
          <div className="text-2xl font-bold text-white">{modules.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Categories</div>
          <div className="text-2xl font-bold text-white">{categories.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Avg Hours/Module</div>
          <div className="text-2xl font-bold text-white">
            {((modules as Module[]).reduce((sum, m) => sum + m.baseHours, 0) / modules.length).toFixed(1)}h
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400">Complex Modules</div>
          <div className="text-2xl font-bold text-white">
            {(modules as Module[]).filter((m) => m.riskWeight >= 0.3).length}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">Category:</span>
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Complexity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">Complexity:</span>
            <select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value as typeof complexityFilter)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
            >
              <option value="all">All</option>
              <option value="simple">Simple</option>
              <option value="moderate">Moderate</option>
              <option value="complex">Complex</option>
            </select>
          </div>
        </div>

        {/* Filter summary */}
        <div className="mt-3 text-sm text-zinc-500">
          Showing {filteredModules.length} of {modules.length} modules
          {(search || selectedCategory || complexityFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory(null);
                setComplexityFilter("all");
              }}
              className="ml-2 text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Module Cards Grid */}
      {filteredModules.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-1">No modules found</h3>
          <p className="text-zinc-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((module) => (
            <ModuleCard
              key={module._id}
              module={module}
              allModules={modules as Module[]}
              onEdit={setEditingModule}
            />
          ))}
        </div>
      )}

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
