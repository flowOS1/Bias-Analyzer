export interface BiasHighlight {
  id?: string; // assigned on client side or generated dynamically
  matchedText: string;
  biasType: string;
  biasGroup?: string; // Cognitive Bias, Logical Fallacy, Unsupported Claim
  severity: "low" | "medium" | "high";
  explanation: string;
  suggestedRewrite: string;
}

export interface BiasCategories {
  sensationalism: number; // 0-100
  framing: number; // 0-100
  loadedLanguage: number; // 0-100
  perspectiveBalance: number; // 0-100
  cognitiveBias: number; // 0-100
}

export interface AnalysisResult {
  overallScore: number; // 0-100
  neutralityGrade: string;
  summary: string;
  categories: BiasCategories;
  highlights: BiasHighlight[];
}

export interface ExampleArticle {
  id: string;
  title: string;
  category: "Political" | "Sensational" | "One-Sided" | "Balanced";
  description: string;
  text: string;
}

export interface BiasDefinition {
  name: string;
  category: string;
  description: string;
  example: string;
  mitigation: string;
}
