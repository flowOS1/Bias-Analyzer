import { useState, useEffect } from "react";
import Header from "./components/Header";
import Gauge from "./components/Gauge";
import BiasOverlayEditor from "./components/BiasOverlayEditor";
import Encyclopedia from "./components/Encyclopedia";
import { EXAMPLE_ARTICLES, BIAS_ENCYCLOPEDIA } from "./data";
import { AnalysisResult, BiasHighlight } from "./types";
import { Info, Sparkles, BookOpen, AlertCircle, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("analyzer");
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<BiasHighlight | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Set default text on load
  useEffect(() => {
    // Load the sensational article by default to invite interaction
    const defaultArticle = EXAMPLE_ARTICLES.find((a) => a.id === "sensational");
    if (defaultArticle) {
      setText(defaultArticle.text);
    }
  }, []);

  // Run real-time/on-demand AI audit on user text
  const handleAnalyzeText = async (focus: string) => {
    if (!text.trim() || text.trim().length < 10) {
      setError("Please paste a text segment of at least 10 characters.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setSelectedHighlight(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, focus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze the text. Please try again.");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      if (data.highlights && data.highlights.length > 0) {
        setSelectedHighlight(data.highlights[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred while communicating with the analysis server.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Grammarly action: replaces selected biased text with neutral suggestion
  const handleApplyHighlightRewrite = (highlight: BiasHighlight) => {
    // Find the highlighted text and replace it with the suggested rewrite
    const originalText = text;
    const occurrenceIndex = originalText.indexOf(highlight.matchedText);

    if (occurrenceIndex !== -1) {
      const updatedText =
        originalText.substring(0, occurrenceIndex) +
        highlight.suggestedRewrite +
        originalText.substring(occurrenceIndex + highlight.matchedText.length);

      setText(updatedText);

      // Remove the highlight from the active list
      if (result) {
        const updatedHighlights = result.highlights.filter(
          (h) => h.matchedText !== highlight.matchedText
        );

        // Recalculate basic metrics gently to reflect positive neutral progression
        const newScore = Math.max(0, result.overallScore - Math.ceil(40 / (result.highlights.length || 1)));
        let newGrade = result.neutralityGrade;
        if (newScore <= 15) newGrade = "Highly Objective";
        else if (newScore <= 35) newGrade = "Mostly Balanced";

        setResult({
          ...result,
          overallScore: newScore,
          neutralityGrade: newGrade,
          highlights: updatedHighlights,
        });

        // Highlight next item in line or clear selection
        if (updatedHighlights.length > 0) {
          setSelectedHighlight(updatedHighlights[0]);
        } else {
          setSelectedHighlight(null);
        }
      }
    }
  };

  // Reset work inputs
  const handleClearText = () => {
    setText("");
    setResult(null);
    setSelectedHighlight(null);
    setError(null);
  };

  const handleLoadExample = (exampleText: string) => {
    setText(exampleText);
    setResult(null);
    setSelectedHighlight(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" id="app-root">
      {/* App header component */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onShowHelp={() => setShowHelpModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        {activeTab === "analyzer" ? (
          <div className="space-y-8" id="analyzer-tab-content">
            
            {/* Split top stats row when result is ready */}
            {result && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3" id="analysis-dashboard-widgets">
                {/* Dial Score Gauge */}
                <div className="md:col-span-1">
                  <Gauge score={result.overallScore} grade={result.neutralityGrade} />
                </div>

                {/* Categories Bar Charts widget */}
                <div className="md:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-4">
                      Slant Vector Profile
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Sensationalism */}
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-slate-700">Sensationalism & Fear-mongering</span>
                          <span className="font-mono">{result.categories.sensationalism}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                            style={{ width: `${result.categories.sensationalism}%` }}
                          />
                        </div>
                      </div>

                      {/* Framing Bias */}
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-slate-700">Framing Bias (Skewed Context)</span>
                          <span className="font-mono">{result.categories.framing}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                            style={{ width: `${result.categories.framing}%` }}
                          />
                        </div>
                      </div>

                      {/* Loaded Language */}
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-slate-700">Emotional or Loaded Language</span>
                          <span className="font-mono">{result.categories.loadedLanguage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                            style={{ width: `${result.categories.loadedLanguage}%` }}
                          />
                        </div>
                      </div>

                      {/* Perspective Balance */}
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-slate-700">Unbalanced Argumentation</span>
                          <span className="font-mono">{result.categories.perspectiveBalance}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-slate-700 rounded-full transition-all duration-1000"
                            style={{ width: `${result.categories.perspectiveBalance}%` }}
                          />
                        </div>
                      </div>

                      {/* Cognitive Bias */}
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-slate-700">Cognitive Bias Indicators</span>
                          <span className="font-mono">{result.categories.cognitiveBias}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                            style={{ width: `${result.categories.cognitiveBias}%` }}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Summary paragraph */}
                  <div className="mt-5 border-t border-slate-50 pt-4 bg-slate-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
                      AI Synthesis Overview
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {result.summary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message banner */}
            {error && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 flex items-start space-x-3 text-rose-800" id="error-banner">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Analysis Interrupted</h4>
                  <p className="text-xs mt-1 text-rose-700">{error}</p>
                </div>
              </div>
            )}

            {/* Main Interactive Work Area */}
            <BiasOverlayEditor
              text={text}
              setText={setText}
              highlights={result?.highlights || []}
              onApplyHighlightRewrite={handleApplyHighlightRewrite}
              selectedHighlight={selectedHighlight}
              setSelectedHighlight={setSelectedHighlight}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyzeText}
              onClear={handleClearText}
              onLoadExample={handleLoadExample}
              exampleArticles={EXAMPLE_ARTICLES}
            />

          </div>
        ) : (
          /* Encyclopedia Tab Content */
          <div id="encyclopedia-tab-content">
            <Encyclopedia definitions={BIAS_ENCYCLOPEDIA} />
          </div>
        )}
      </main>

      {/* How It Works Modal overlay */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" id="help-modal-overlay">
          <div className="w-full max-w-xl rounded-2xl border border-slate-100 bg-white p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
              id="btn-close-modal"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
              <HelpCircle className="h-5 w-5 text-slate-500" />
              How Bias Analyzer Works
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Much like standard spell-checkers analyze spelling and syntax, <strong>Bias Analyzer</strong> uses advanced language intelligence to detect cognitive biases, emotionally loaded framing, logical fallacies, and sensationalism.
            </p>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white font-bold">1</div>
                <div>
                  <h4 className="font-bold text-slate-900">Paste & Analyze</h4>
                  <p className="text-slate-500 mt-0.5">Enter custom paragraphs or load pre-populated biased narratives to scrutinize framing slants.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white font-bold">2</div>
                <div>
                  <h4 className="font-bold text-slate-900">Inspect High-lighting</h4>
                  <p className="text-slate-500 mt-0.5">Biased assertions are color-coded based on severity (Low, Medium, High) with interactive diagnostic explanations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white font-bold">3</div>
                <div>
                  <h4 className="font-bold text-slate-900">Apply suggestions in 1-Click</h4>
                  <p className="text-slate-500 mt-0.5">Click "Apply Suggestion" to automatically substitute slanted, polarizing text with balanced, objective equivalents.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-900 transition-colors cursor-pointer"
                id="btn-confirm-modal"
              >
                Let's Start Analyzing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Humble Footer */}
      <footer className="border-t border-slate-100 bg-white py-6 mt-12 text-center text-xs text-slate-400 font-mono">
        BIAS ANALYZER CORE v1.0.0 &bull; SYSTEM RUNNING ON SECURE CLOUD SANDBOX
      </footer>
    </div>
  );
}
