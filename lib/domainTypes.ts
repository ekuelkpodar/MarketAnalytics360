export type Region =
  | "Global"
  | "North America"
  | "Europe"
  | "Asia-Pacific"
  | "Latin America"
  | "Africa";

export type TimeHorizon = "Short-term" | "Medium-term" | "Long-term";
export type Scenario = "Baseline" | "Optimistic" | "Pessimistic";

export interface Industry {
  id: string;
  name: string;
  category: string;
  description: string;
  businessModels: string[];
  revenueDrivers: string[];
  costDrivers: string[];
  valueChain: ValueChainStage[];
  segments: string[];
}

export interface ValueChainStage {
  stage: string;
  description: string;
  marginProfile: "Low" | "Medium" | "High";
}

export interface DemographicsProfile {
  industryId: string;
  customerSegments: { name: string; type: "B2C" | "B2B" | "Government"; share: number }[];
  regions: { name: Region | string; importance: "High" | "Medium" | "Low" }[];
  incomeBrackets?: string[];
  ageGroups?: string[];
  urbanVsRural?: { urban: number; rural: number };
  notes?: string;
}

export interface MacroEnvironment {
  industryId: string;
  political: string[];
  economic: string[];
  social: string[];
  technological: string[];
  environmental: string[];
  legal: string[];
  macroRisks: { name: string; severity: number; notes?: string }[];
}

export interface Indicator {
  name: string;
  description: string;
  rationale: string;
  proxy?: string;
  category: "Demand" | "Supply" | "Financial" | "Sentiment";
}

export interface IndicatorSet {
  industryId: string;
  leadingIndicators: Indicator[];
  laggingIndicators: Indicator[];
}

export interface RiskOpportunityProfile {
  industryId: string;
  risks: { item: string; impact: "Low" | "Medium" | "High" }[];
  opportunities: string[];
  structuralTrends: string[];
  competitiveIntensity: { level: "Low" | "Medium" | "High"; notes?: string };
}

export interface IndustryDataBundle {
  industry: Industry;
  demographics: DemographicsProfile;
  macro: MacroEnvironment;
  indicators: IndicatorSet;
  riskProfile: RiskOpportunityProfile;
}
