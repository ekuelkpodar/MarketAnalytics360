import industries from "../data/industries.json";
import demographics from "../data/demographics.json";
import macro from "../data/macro.json";
import indicators from "../data/indicators.json";
import risks from "../data/risks.json";
import {
  DemographicsProfile,
  IndicatorSet,
  Industry,
  IndustryDataBundle,
  MacroEnvironment,
  Region,
  RiskOpportunityProfile
} from "./domainTypes";

type AnyRecord = Record<string, unknown>;

export function getIndustriesList(): Industry[] {
  return industries as Industry[];
}

export function getIndustryData(industryId: string): IndustryDataBundle {
  const industry =
    (industries as Industry[]).find((i) => i.id === industryId) ??
    (industries as Industry[])[0];

  return {
    industry,
    demographics:
      (demographics as DemographicsProfile[]).find((d) => d.industryId === industryId) ??
      buildDemographicFallback(industry),
    macro:
      (macro as MacroEnvironment[]).find((m) => m.industryId === industryId) ??
      buildMacroFallback(industry),
    indicators:
      (indicators as IndicatorSet[]).find((m) => m.industryId === industryId) ??
      buildIndicatorFallback(industry),
    riskProfile:
      (risks as RiskOpportunityProfile[]).find((r) => r.industryId === industryId) ??
      buildRiskFallback(industry)
  };
}

function buildDemographicFallback(industry: Industry): DemographicsProfile {
  return {
    industryId: industry.id,
    customerSegments: [
      { name: "Mass market consumers", type: "B2C", share: 50 },
      { name: "Enterprises/SMBs", type: "B2B", share: 40 },
      { name: "Public sector", type: "Government", share: 10 }
    ],
    regions: [
      { name: "North America", importance: "High" },
      { name: "Europe", importance: "High" },
      { name: "Asia-Pacific", importance: "High" }
    ],
    notes: "Fallback demographic profile; replace with domain data."
  };
}

function buildMacroFallback(industry: Industry): MacroEnvironment {
  return {
    industryId: industry.id,
    political: ["Stable policy backdrop, watch trade rules"],
    economic: ["Moderately cyclical, sensitive to credit and GDP"],
    social: ["Evolving consumer preferences and digital adoption"],
    technological: ["Automation and analytics adoption rising"],
    environmental: ["Pressure to decarbonize and improve efficiency"],
    legal: ["Standard compliance, IP, and liability exposure"],
    macroRisks: [
      { name: "Demand slowdown", severity: 6 },
      { name: "Input cost volatility", severity: 5 }
    ]
  };
}

function buildIndicatorFallback(industry: Industry): IndicatorSet {
  return {
    industryId: industry.id,
    leadingIndicators: [
      {
        name: "New orders",
        description: "Forward bookings across major segments",
        rationale: "Signals demand before revenue",
        category: "Demand"
      },
      {
        name: "Capex intentions",
        description: "Planned investments by customers",
        rationale: "Precedes deployment and revenue",
        category: "Financial"
      }
    ],
    laggingIndicators: [
      {
        name: "Revenue growth",
        description: "Reported sales across units",
        rationale: "Reflects past demand",
        category: "Financial"
      },
      {
        name: "Employment levels",
        description: "Headcount across the industry",
        rationale: "Adjusts after activity changes",
        category: "Supply"
      }
    ]
  };
}

function buildRiskFallback(industry: Industry): RiskOpportunityProfile {
  return {
    industryId: industry.id,
    risks: [
      { item: "Demand shocks", impact: "High" },
      { item: "Supply chain disruption", impact: "Medium" }
    ],
    opportunities: [
      "Digital efficiencies",
      "New customer segments",
      "Product mix shift"
    ],
    structuralTrends: ["Technology adoption", "Regulatory evolution"],
    competitiveIntensity: { level: "Medium", notes: "Fragmented incumbents" }
  };
}

export function listRegions(): Region[] {
  return [
    "Global",
    "North America",
    "Europe",
    "Asia-Pacific",
    "Latin America",
    "Africa"
  ];
}
