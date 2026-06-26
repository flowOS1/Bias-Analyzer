import { useState } from "react";
import { BookOpen, Search, Sparkles, ShieldCheck } from "lucide-react";
import { BiasDefinition } from "../types";

interface EncyclopediaProps {
  definitions: BiasDefinition[];
}

export default function Encyclopedia({ definitions }: EncyclopediaProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Media Slant", "Rhetorical", "Cognitive/Media", "Cognitive", "Logical Fallacy"];

  const filteredDefinitions = definitions.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.example.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col space-y-6" id="bias-encyclopedia-container">
      {/* Search and Category Filter Banner */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-2xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-slate-500" />
              Bias & Fallacy Encyclopedia
            </h2>
            <p className="text-xs text-slate-500">
              An educational reference detailing cognitive fallacies, partisan slants, and media framing patterns.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search bias or fallacy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none transition-all shadow-3xs"
              id="encyclopedia-search"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-50 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-3xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              id={`cat-filter-${cat.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {cat === "all" ? "All categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List of Definitions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2" id="encyclopedia-grid">
        {filteredDefinitions.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-slate-50">
            <p className="text-sm font-medium text-slate-500">No definitions found matching your criteria.</p>
            <p className="mt-1 text-xs text-slate-400">Try modifying your search query or selecting a different category filter.</p>
          </div>
        ) : (
          filteredDefinitions.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-2xs hover:shadow-xs transition-shadow"
              id={`encyclopedia-item-${idx}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                <span className="rounded-full bg-slate-100 border border-slate-200/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider font-mono text-slate-600">
                  {item.category}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {/* Example box */}
              <div className="mt-4 rounded-xl bg-rose-50/50 border border-rose-100/30 p-3 text-xs">
                <span className="font-semibold text-rose-800 uppercase tracking-wider font-mono block mb-1">
                  Example Concept:
                </span>
                <p className="text-slate-700 italic">
                  {item.example}
                </p>
              </div>

              {/* Mitigation / Neutral Rephrase */}
              <div className="mt-3 rounded-xl bg-emerald-50/40 border border-emerald-100/30 p-3 text-xs">
                <span className="font-semibold text-emerald-800 uppercase tracking-wider font-mono flex items-center gap-1 mb-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Neutral Correction:
                </span>
                <p className="text-slate-700">
                  {item.mitigation}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
