export type Sensitivity = "Low" | "Medium" | "High";
export type ImpactDirection = "Positive" | "Negative" | "Mixed";
export type Horizon = "Short" | "Medium" | "Long";

export interface MarketOverview {
  sector: string;
  marketSize: string;
  cagr: string;
  geography: { region: string; share: number }[];
  structure: { b2b: number; b2c: number };
  valueChain: { stage: string; margin: "Low" | "Medium" | "High"; bottleneck?: string }[];
}

export interface DemographicLayer {
  customerSegments: { name: string; share: number; adoption: string }[];
  demandByRegion: { region: string; intensity: string }[];
  spendingPower: { tier: string; notes: string }[];
  digitalAdoption: { level: string; notes: string };
  ageIncome?: { ageGroup: string; income: string }[];
}

export interface CompetitiveStructure {
  concentration: string;
  fiveForces: { force: string; rating: number; note: string }[];
  players: { name: string; role: string; strength: string }[];
  disruptionRisk: "Low" | "Medium" | "High";
  moats: string[];
  vulnerabilities: string[];
}

export interface MacroLinkage {
  name: string;
  sensitivity: Sensitivity;
  exposure: string;
  why: string;
}

export interface Indicator {
  name: string;
  type: "Leading" | "Lagging" | "Sentiment" | "Macro";
  description: string;
  impact: ImpactDirection;
  sensitivity: Sensitivity;
  history: { label: string; value: number }[];
  commentary: string;
}

export interface Opportunity {
  name: string;
  segment: string;
  rationale: string;
  enablers: string[];
  difficulty: number;
  roi: string;
}

export interface Risk {
  name: string;
  category: string;
  probability: number;
  impact: number;
  warnings: string;
  mitigation: string;
}

export interface Trend {
  name: string;
  description: string;
  likelihood: number;
  impact: number;
  horizon: Horizon;
  implication: string;
}

export interface Scenario {
  name: string;
  narrative: string;
  direction: string;
  amplifiedRisks: string[];
  opportunities: string[];
  recommendations: string[];
  kpis: string[];
}

export interface ValueChainMap {
  industryId: string;
  nodes: { id: string; label: string; stage: string; margin: string }[];
  edges: { from: string; to: string; constraint?: string }[];
}

export interface PlayerProfile {
  industryId: string;
  players: { name: string; category: string; position: string; advantage: string }[];
}
