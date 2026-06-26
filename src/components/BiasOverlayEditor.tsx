import { useState } from "react";
import { AlertTriangle, Check, Undo, Sparkles, Trash2, HelpCircle } from "lucide-react";
import { BiasHighlight } from "../types";

interface BiasOverlayEditorProps {
  text: string;
  setText: (text: string) => void;
  highlights: BiasHighlight[];
  onApplyHighlightRewrite: (highlight: BiasHighlight) => void;
  selectedHighlight: BiasHighlight | null;
  setSelectedHighlight: (highlight: BiasHighlight | null) => void;
  isAnalyzing: boolean;
  onAnalyze: (focus: string) => void;
  onClear: () => void;
  onLoadExample: (text: string) => void;
  exampleArticles: Array<{ id: string; title: string; category: string; description: string; text: string }>;
}

export default function BiasOverlayEditor({
  text,
  setText,
  highlights,
  onApplyHighlightRewrite,
  selectedHighlight,
  setSelectedHighlight,
  isAnalyzing,
  onAnalyze,
  onClear,
  onLoadExample,
  exampleArticles,
}: BiasOverlayEditorProps) {
  const [focusMode, setFocusMode] = useState("general");
  const [editorMode, setEditorMode] = useState<"edit" | "interactive">("edit");

  // Switch to interactive view when analysis completes with highlights
  const hasHighlights = highlights.length > 0;

  // We can render the text with inline highlighted spans
  // This is a custom parser that takes the original text and finds the occurrences of highlights.
  // To avoid overlapping issues, we can extract non-overlapping indices or highlight them sequentially.
  const renderHighlightedText = () => {
    if (!text) return <p className="text-slate-400 italic font-sans">No text analyzed yet. Paste some text above or load an example to start.</p>;
    if (highlights.length === 0) {
      return <p className="whitespace-pre-wrap text-slate-800 font-sans leading-relaxed">{text}</p>;
    }

    // Sort highlights by where they appear in the text to prevent corrupting indices
    // We only highlight exact substring matches.
    // Let's create an array of fragments: { text: string, highlight?: BiasHighlight }
    let fragments: Array<{ text: string; highlight?: BiasHighlight }> = [];
    let lastIndex = 0;

    // To prevent overlapping matches, we'll build matches strictly in order of appearance
    const sortedMatches = [...highlights]
      .map((h) => {
        const index = text.indexOf(h.matchedText);
        return { index, highlight: h };
      })
      .filter((m) => m.index !== -1)
      .sort((a, b) => a.index - b.index);

    let currentPos = 0;
    for (const match of sortedMatches) {
      if (match.index < currentPos) {
        // Overlap or duplicates - skip to keep layout stable
        continue;
      }

      // Add text before the match
      if (match.index > currentPos) {
        fragments.push({ text: text.substring(currentPos, match.index) });
      }

      // Add the matched text segment
      fragments.push({
        text: match.highlight.matchedText,
        highlight: match.highlight,
      });

      currentPos = match.index + match.highlight.matchedText.length;
    }

    if (currentPos < text.length) {
      fragments.push({ text: text.substring(currentPos) });
    }

    return (
      <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-800 text-base" id="highlighted-text-area">
        {fragments.map((frag, idx) => {
          if (!frag.highlight) {
            return <span key={idx}>{frag.text}</span>;
          }

          const isSelected = selectedHighlight && selectedHighlight.matchedText === frag.highlight.matchedText;
          const group = frag.highlight.biasGroup || "Cognitive Bias";
          
          let highlightStyle = "";
          if (group === "Cognitive Bias") {
            highlightStyle = isSelected
              ? "bg-teal-200 border-b-2 border-teal-500 text-teal-950 font-medium px-1 shadow-xs rounded-sm"
              : "bg-teal-100/80 border-b border-teal-400 hover:bg-teal-200/90 text-teal-950 px-0.5 rounded-xs";
          } else if (group === "Logical Fallacy") {
            highlightStyle = isSelected
              ? "bg-amber-200 border-b-2 border-amber-500 text-amber-950 font-medium px-1 shadow-xs rounded-sm"
              : "bg-amber-100/80 border-b border-amber-400 hover:bg-amber-200/90 text-amber-950 px-0.5 rounded-xs";
          } else { // Unsupported Claim
            highlightStyle = isSelected
              ? "bg-rose-200 border-b-2 border-rose-500 text-rose-950 font-medium px-1 shadow-xs rounded-sm"
              : "bg-rose-100/80 border-b border-rose-400 hover:bg-rose-200/90 text-rose-950 px-0.5 rounded-xs";
          }

          const borderStyle = "cursor-pointer transition-all duration-150 py-0.25";

          return (
            <span
              key={idx}
              onClick={() => setSelectedHighlight(frag.highlight!)}
              className={`${borderStyle} ${highlightStyle}`}
              title={`${frag.highlight.biasGroup || "Cognitive Bias"}: ${frag.highlight.biasType}`}
              id={`highlight-segment-${idx}`}
            >
              {frag.text}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6" id="bias-editor-workspace">
      {/* Top Controls / Example Loader */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Choose an analysis target</h2>
            <p className="text-xs text-slate-500">Paste an article below or load a benchmark example to explore slants.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {exampleArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => {
                  onLoadExample(article.text);
                  setEditorMode("edit");
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                id={`btn-example-${article.id}`}
              >
                {article.category}: <span className="font-normal text-slate-500">{article.title.substring(0, 16)}...</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor & Highlight Display Side-by-Side or Toggleable Container */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Input/Interactive Panel */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-100 bg-white shadow-2xs overflow-hidden">
          {/* Panel Header Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
            <div className="flex space-x-1 rounded-md bg-slate-200/70 p-0.5 text-xs font-medium">
              <button
                onClick={() => setEditorMode("edit")}
                className={`rounded px-2.5 py-1 transition-colors ${
                  editorMode === "edit" ? "bg-white text-slate-950 shadow-3xs" : "text-slate-600 hover:text-slate-950"
                }`}
                id="tab-edit-mode"
              >
                Draft / Edit
              </button>
              <button
                disabled={!hasHighlights}
                onClick={() => setEditorMode("interactive")}
                className={`rounded px-2.5 py-1 transition-colors ${
                  !hasHighlights ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  editorMode === "interactive" ? "bg-white text-slate-950 shadow-3xs" : "text-slate-600 hover:text-slate-950"
                }`}
                id="tab-interactive-mode"
              >
                Bias Review {hasHighlights && `(${highlights.length})`}
              </button>
            </div>

            {/* Clear state Button */}
            {text && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                id="btn-clear-text"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* Core Input / Reading Workspace */}
          <div className="relative min-h-[360px] p-6 flex-1 flex flex-col">
            {editorMode === "edit" ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste news articles, editorial opinions, or political texts here to run the audit (at least 10 characters)..."
                className="w-full flex-1 resize-none bg-transparent font-sans text-slate-800 text-base leading-relaxed placeholder-slate-400 focus:outline-none min-h-[280px]"
                id="text-input-field"
              />
            ) : (
              <div className="flex-1 overflow-y-auto">
                {renderHighlightedText()}
              </div>
            )}

            {/* Word count & instructions */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4 text-xs text-slate-400 font-mono">
              <span>{text.trim() ? text.trim().split(/\s+/).length : 0} WORDS</span>
              <span>{text.length} CHARACTERS</span>
            </div>
          </div>

          {/* Bottom Settings and Analyzer Launcher */}
          <div className="border-t border-slate-100 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Focus Select dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  Lens Focus:
                </span>
                <select
                  value={focusMode}
                  onChange={(e) => setFocusMode(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-3xs focus:border-slate-400 focus:outline-none cursor-pointer"
                  id="focus-lens-select"
                >
                  <option value="general">Comprehensive Lens (General)</option>
                  <option value="media">Journalistic & Media Framing</option>
                  <option value="political">Political & Partisan Bias</option>
                  <option value="cognitive">Psychological Cognitive Biases</option>
                </select>
              </div>

              {/* Action Trigger Button */}
              <button
                disabled={isAnalyzing || text.trim().length < 10}
                onClick={() => {
                  onAnalyze(focusMode);
                  setEditorMode("interactive");
                }}
                className={`flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 active:scale-98 transition-all cursor-pointer ${
                  (isAnalyzing || text.trim().length < 10) ? "opacity-50 cursor-not-allowed" : ""
                }`}
                id="btn-trigger-analysis"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Auditing Text...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Bias & Slant
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Highlights/Grammarly-Style Side Inspector */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-slate-500" />
              Bias Inspector
            </h3>
            <p className="text-xs text-slate-500">
              Grammarly-style interactive correction feedback. Click highlights to view suggestions and click Check to apply the neutral version!
            </p>
          </div>

          {/* Highlights container */}
          <div className="flex-1 space-y-3 max-h-[460px] overflow-y-auto pr-1" id="bias-inspector-cards">
            {highlights.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-200/10">
                <p className="text-sm font-medium text-slate-500">No active bias annotations.</p>
                <p className="mt-1 text-xs text-slate-400">Pasted or loaded texts with slant indicators will appear here once analyzed.</p>
              </div>
            ) : (
              highlights.map((item, index) => {
                const isSelected = selectedHighlight && selectedHighlight.matchedText === item.matchedText;
                const group = item.biasGroup || "Cognitive Bias";
                
                let groupBadgeColor = "";
                if (group === "Cognitive Bias") {
                  groupBadgeColor = "bg-teal-50 text-teal-700 border-teal-200";
                } else if (group === "Logical Fallacy") {
                  groupBadgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                } else { // Unsupported Claim
                  groupBadgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                }

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedHighlight(item);
                      setEditorMode("interactive");
                    }}
                    className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-slate-900 bg-slate-950/5 shadow-xs"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                    id={`bias-card-${index}`}
                  >
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase font-mono ${groupBadgeColor}`}>
                          {group}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100">
                          {item.biasType}
                        </span>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Severity: {item.severity}
                      </span>
                    </div>

                    <div className="mt-2 text-xs">
                      <span className="text-slate-400 uppercase font-bold tracking-wider font-mono block mb-1">
                        Pasted Slant:
                      </span>
                      <p className="line-through text-slate-500 italic bg-rose-50/50 p-1.5 rounded-sm border border-rose-100/50">
                        "{item.matchedText}"
                      </p>
                    </div>

                    <div className="mt-3 text-xs">
                      <span className="text-emerald-700 uppercase font-bold tracking-wider font-mono flex items-center gap-1 mb-1">
                        <Check className="h-3 w-3" /> Neutral Suggestion:
                      </span>
                      <p className="font-semibold text-slate-900 bg-emerald-50/30 p-1.5 rounded-sm border border-emerald-100/50">
                        "{item.suggestedRewrite}"
                      </p>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                      {item.explanation}
                    </p>

                    {/* Correction actions */}
                    <div className="mt-4 flex items-center justify-end space-x-2 border-t border-slate-50 pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyHighlightRewrite(item);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-slate-900 transition-colors cursor-pointer"
                        id={`btn-apply-suggestion-${index}`}
                      >
                        <Check className="h-3 w-3" />
                        Apply Suggestion
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
