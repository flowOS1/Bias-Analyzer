interface GaugeProps {
  score: number; // 0 to 100
  grade: string;
}

export default function Gauge({ score, grade }: GaugeProps) {
  // Determine color theme based on score
  let strokeColor = "stroke-emerald-500";
  let textColor = "text-emerald-700";
  let bgColor = "bg-emerald-50";
  let ringBg = "stroke-emerald-100";
  let description = "Objective & Fair";

  if (score > 70) {
    strokeColor = "stroke-rose-500";
    textColor = "text-rose-700";
    bgColor = "bg-rose-50";
    ringBg = "stroke-rose-100";
    description = "Extremely Biased / One-Sided";
  } else if (score > 45) {
    strokeColor = "stroke-amber-500";
    textColor = "text-amber-700";
    bgColor = "bg-amber-50";
    ringBg = "stroke-amber-100";
    description = "Moderately Opinionated";
  } else if (score > 20) {
    strokeColor = "stroke-yellow-500";
    textColor = "text-yellow-700";
    bgColor = "bg-yellow-50";
    ringBg = "stroke-yellow-100";
    description = "Mildly Slanted / Leaning";
  }

  // Radial calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 shadow-2xs" id="bias-gauge-container">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-4">
        Overall Bias Score
      </h3>

      <div className="relative flex items-center justify-center">
        {/* SVG Circle */}
        <svg className="h-32 w-32 -rotate-90" id="gauge-svg">
          <circle
            cx="64"
            cy="64"
            r={radius}
            className={`fill-transparent ${ringBg} stroke-[10]`}
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            className={`fill-transparent ${strokeColor} stroke-[10] transition-all duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tracking-tight text-slate-900" id="gauge-score-value">
            {score}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${bgColor} ${textColor} border border-current/10 shadow-3xs`}>
          {grade || description}
        </span>
        <p className="mt-2 text-xs text-slate-500 max-w-[180px]">
          {score <= 20
            ? "Presents factual arguments neutrally with well-balanced contexts."
            : score <= 45
            ? "Contains some emotional wording or slight emphasis on particular viewpoints."
            : score <= 70
            ? "Presents a skewed viewpoint using selectively highlighted facts and emotional framing."
            : "Strongly one-sided presentation utilizing polarizing framing or emotional loaded language."}
        </p>
      </div>
    </div>
  );
}
