export interface StudentOpportunity {
  id: number;
  title: string;
  exactExtension: string;
  targetedPerformanceMetric: string;
  recommendedTechStack: string[];
  difficulty: 'Accessible for 3rd Year' | 'Intermediate' | 'Advanced';
  estimatedWeeks: string;
  resumeBullet: string;
  roadmap: string[];
}

export interface CoreConceptData {
  problemStatement: string;
  primaryMethodology: string;
  keyBreakthroughs: string;
  fullSummary: string;
  wordCount: number;
}

export interface PaperStructuredData {
  paperTitle: string;
  paperAuthors: string[];
  paperYear: string;
  arxivId?: string;
  coreConcept: CoreConceptData;
  mermaidGraph: string;
  studentOpportunities: StudentOpportunity[];
}

export interface TokenMetrics {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  maxBudget: number;
  withinBudget: boolean;
  percentBudgetUsed: string;
}

export interface PaperAnalysisResponse {
  success: boolean;
  verbatimOutput: string;
  structuredData: PaperStructuredData;
  mermaidGraph: string;
  tokenMetrics: TokenMetrics;
  grounding?: {
    queries: string[];
    sourcesCount: number;
  };
}

export interface CuratedPaper {
  id: string;
  title: string;
  authors: string[];
  year: string;
  url: string;
  category: string;
  tagline: string;
}

export interface ScaffoldFile {
  path: string;
  code: string;
}

export interface ProjectScaffold {
  repoName: string;
  tagline: string;
  architectureOverview: string;
  files: ScaffoldFile[];
  resumeBulletPoints: string[];
}

export interface SavedAnalysis {
  id: string;
  timestamp: number;
  title: string;
  url: string;
  data: PaperAnalysisResponse;
}
