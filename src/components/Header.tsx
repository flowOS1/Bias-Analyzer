import { ShieldAlert, Info, HelpCircle } from "lucide-react";

interface HeaderProps {
  onShowHelp: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ onShowHelp, activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-white" id="app-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Title and Logo */}
        <div className="flex items-center space-x-3">
          {/* Breaking Bad Style Barium Element Block */}
          <div className="relative flex h-14 w-14 flex-col justify-between border-2 border-emerald-400 bg-emerald-950 p-1 text-white shadow-md font-mono rounded-xs" id="bb-logo">
            <span className="text-[9px] font-bold leading-none text-emerald-400">56</span>
            <span className="text-2xl font-bold leading-none text-center text-emerald-50 -mt-1 tracking-tight">Ba</span>
            <div className="flex justify-between items-center text-[7px] leading-none text-emerald-400">
              <span className="uppercase">Bias</span>
              <span>137.33</span>
            </div>
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold tracking-tight text-slate-900 leading-none">
              <span className="text-emerald-700 font-extrabold font-mono mr-0.5">Ba</span>n_alyzer
            </h1>
            <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mt-1">
              Cognitive, Fallacy & Claim Audit
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 rounded-lg bg-slate-100 p-1 text-sm">
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === "analyzer"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
            id="nav-analyzer-tab"
          >
            Bias Analyzer
          </button>
          <button
            onClick={() => setActiveTab("encyclopedia")}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === "encyclopedia"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
            id="nav-encyclopedia-tab"
          >
            Bias Encyclopedia
          </button>
        </nav>

        {/* Help Action Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onShowHelp}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-2xs hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            id="btn-help"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">How It Works</span>
          </button>
        </div>
      </div>
    </header>
  );
}
