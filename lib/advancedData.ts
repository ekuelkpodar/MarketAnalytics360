// Mocked advanced datasets to scaffold the Market 360° OS experience.

export type ViewMode = "Beginner" | "Analyst" | "Executive" | "Quant";
export type LayoutMode = "Dashboard" | "Research" | "Executive" | "Quant";

export interface IndicatorDatum {
  name: string;
  value: number;
  change: number;
  direction: "up" | "down";
  sensitivity: "Low" | "Medium" | "High";
  category: string;
  series: { label: string; value: number }[];
  why: string;
}

export interface ShockItem {
  name: string;
  score: number; // 0-100
  explanation: string;
}

export interface StructuralTrend {
  name: string;
  description: string;
  likelihood: number;
  impact: number;
  horizon: "Short" | "Medium" | "Long";
  implication: string;
}

export interface Opportunity {
  name: string;
  category: string;
  rationale: string;
  dependencies: string[];
  enablers: string[];
  difficulty: number; // 1-5
  roi: string;
}

export interface RiskItem {
  name: string;
  type: string;
  probability: number;
  severity: number;
  mitigation: string;
  signals: string;
}

export interface Scenario {
  name: string;
  narrative: string;
  impact: string;
  opportunities: string[];
  risks: string[];
  kpis: string[];
  actions: string[];
}

export interface CompareIndustry {
  id: string;
  name: string;
  growth: number;
  margin: number;
  capex: number;
  risk: number;
  complexity: number;
}

export interface Agent {
  id: string;
  title: string;
  systemPrompt: string;
  focus: string;
}

export const viewModes: ViewMode[] = ["Beginner", "Analyst", "Executive", "Quant"];
export const layoutModes: LayoutMode[] = ["Dashboard", "Research", "Executive", "Quant"];

export const indicatorHub: IndicatorDatum[] = [
  {
    name: "GDP (YoY)",
    value: 2.4,
    change: 0.3,
    direction: "up",
    sensitivity: "High",
    category: "Macro",
    series: Array.from({ length: 8 }).map((_, idx) => ({ label: `Q${idx + 1}`, value: 1.5 + idx * 0.2 })),
    why: "Core growth driver influencing capital allocation and demand."
  },
  {
    name: "PMI",
    value: 52.1,
    change: 1.2,
    direction: "up",
    sensitivity: "High",
    category: "Macro",
    series: Array.from({ length: 8 }).map((_, idx) => ({ label: `M${idx + 1}`, value: 48 + idx * 0.7 })),
    why: "Forward-looking demand and production signal."
  },
  {
    name: "CPI",
    value: 3.1,
    change: -0.2,
    direction: "down",
    sensitivity: "Medium",
    category: "Macro",
    series: Array.from({ length: 8 }).map((_, idx) => ({ label: `M${idx + 1}`, value: 4.5 - idx * 0.2 })),
    why: "Cost pressure and pricing power proxy."
  },
  {
    name: "Sector Demand Index",
    value: 64,
    change: 2.5,
    direction: "up",
    sensitivity: "High",
    category: "Leading",
    series: Array.from({ length: 8 }).map((_, idx) => ({ label: `W${idx + 1}`, value: 55 + idx * 1.2 })),
    why: "Tracks orders and backlog momentum."
  },
  {
    name: "Hiring Intent",
    value: 58,
    change: -1.5,
    direction: "down",
    sensitivity: "Medium",
    category: "Sentiment",
    series: Array.from({ length: 8 }).map((_, idx) => ({ label: `W${idx + 1}`, value: 62 - idx * 0.9 })),
    why: "Talent appetite as leading indicator of confidence."
  },
  {
    name: "Commodity Basket",
    value: 88,
    change: 3.4,
    direction: "up",
    sensitivity: "High",
    category: "Commodity",
    series: Array.from({ length: 8 }).map((_, idx) => ({ label: `W${idx + 1}`, value: 70 + idx * 2.1 })),
    why: "Input cost pressure exposure."
  }
];

export const shockRadar: ShockItem[] = [
  { name: "Geopolitical", score: 72, explanation: "Supply rerouting risk and tariffs." },
  { name: "Supply Chain", score: 68, explanation: "Tier-2 fragility and logistics delays." },
  { name: "Commodity Volatility", score: 74, explanation: "Input price swings compress margins." },
  { name: "Labor Shortage", score: 55, explanation: "Specialized talent scarcity." },
  { name: "Regulatory", score: 63, explanation: "Licensing and compliance tightening." },
  { name: "Tech Disruption", score: 77, explanation: "AI/automation re-shaping value capture." },
  { name: "Consumer Sentiment", score: 52, explanation: "Demand elasticity in downturns." },
  { name: "FX Risk", score: 48, explanation: "Currency mismatches on sourcing." }
];

export const structuralTrends: StructuralTrend[] = [
  {
    name: "AI automation",
    description: "Software and robotics replacing repetitive workflows.",
    likelihood: 87,
    impact: 92,
    horizon: "Medium",
    implication: "Margin expansion for early adopters; workforce reskilling imperative."
  },
  {
    name: "Electrification",
    description: "Shift to electric platforms and supporting infrastructure.",
    likelihood: 78,
    impact: 88,
    horizon: "Long",
    implication: "Capex-heavy transition with supply chain rewiring."
  },
  {
    name: "Regulatory tightening",
    description: "ESG and safety mandates increasing compliance burden.",
    likelihood: 72,
    impact: 76,
    horizon: "Medium",
    implication: "Higher operating cost; barrier to entry advantage for scaled players."
  },
  {
    name: "Cloud-native stacks",
    description: "Full-stack modernization enabling speed and observability.",
    likelihood: 82,
    impact: 80,
    horizon: "Short",
    implication: "Faster product cycles; legacy drag for incumbents."
  }
];

export const opportunities: Opportunity[] = [
  {
    name: "Vertical AI copilot",
    category: "Product",
    rationale: "Automate workflows with domain-tuned models.",
    dependencies: ["Data access", "Model selection"],
    enablers: ["APIs", "Security review"],
    difficulty: 3,
    roi: "High"
  },
  {
    name: "Aftermarket services",
    category: "Revenue",
    rationale: "Sticky, higher-margin service bundles.",
    dependencies: ["Service network", "Telemetry"],
    enablers: ["IoT stack", "Support ops"],
    difficulty: 2,
    roi: "Medium-High"
  },
  {
    name: "Low-carbon premium line",
    category: "Positioning",
    rationale: "Win ESG-driven demand and pricing power.",
    dependencies: ["Supply chain", "Certification"],
    enablers: ["Green inputs", "Lifecycle data"],
    difficulty: 4,
    roi: "Medium"
  },
  {
    name: "Usage-based pricing",
    category: "Model",
    rationale: "Align price with realized value; reduce adoption friction.",
    dependencies: ["Metering", "Billing"],
    enablers: ["Data platform", "RevOps"],
    difficulty: 2,
    roi: "High"
  }
];

export const riskGrid: RiskItem[] = [
  {
    name: "Operational downtime",
    type: "Operational",
    probability: 42,
    severity: 78,
    mitigation: "Redundancy, SRE playbooks, tabletop exercises.",
    signals: "MTTR/MTBF drift; spike in SEV2 incidents."
  },
  {
    name: "Margin compression",
    type: "Financial",
    probability: 55,
    severity: 82,
    mitigation: "Hedge inputs, dynamic pricing, product mix shift.",
    signals: "Input cost index up; ASP down; attach slipping."
  },
  {
    name: "Share loss to disruptors",
    type: "Competitive",
    probability: 48,
    severity: 75,
    mitigation: "Faster roadmap, partnerships, targeted M&A.",
    signals: "Win-rate decline; NPS gap; deal cycle elongates."
  },
  {
    name: "Regulatory action",
    type: "Regulatory",
    probability: 38,
    severity: 70,
    mitigation: "Compliance-by-design, proactive engagement.",
    signals: "Draft bills; negative guidance; enforcement uptick."
  },
  {
    name: "Supply disruption",
    type: "Supply chain",
    probability: 46,
    severity: 79,
    mitigation: "Dual sourcing, inventory buffers, nearshoring pilots.",
    signals: "Lead times widen; vendor health downgrades."
  }
];

export const scenarios: Scenario[] = [
  {
    name: "Baseline",
    narrative: "Steady demand, gradual cost normalization.",
    impact: "Modest growth, stable margins.",
    opportunities: ["Expand service mix", "Selective price increases"],
    risks: ["Input volatility returns", "Labor attrition"],
    kpis: ["Bookings growth", "Gross margin", "Retention"],
    actions: ["Lock key suppliers", "Double down on top segments"]
  },
  {
    name: "Demand surge",
    narrative: "Macro tailwinds and stimulus boost consumption.",
    impact: "Revenue accelerates; capacity strain risk.",
    opportunities: ["Capacity expansion", "Premium packaging"],
    risks: ["Stockouts", "Service degradation"],
    kpis: ["Fill rate", "Backlog days", "NPS"],
    actions: ["Flexible staffing", "Prioritize high-margin SKUs"]
  },
  {
    name: "Regulatory clampdown",
    narrative: "New standards increase compliance cost.",
    impact: "Margin pressure; moat for compliant players.",
    opportunities: ["Compliance-as-a-service", "Eco product line"],
    risks: ["Penalties", "Delayed launches"],
    kpis: ["Compliance cost", "Audit findings"],
    actions: ["Embed controls", "Cross-functional tiger team"]
  }
];

export const compareSet: CompareIndustry[] = [
  { id: "auto", name: "Automotive", growth: 5, margin: 14, capex: 18, risk: 62, complexity: 76 },
  { id: "semis", name: "Semiconductors", growth: 9, margin: 28, capex: 35, risk: 58, complexity: 88 },
  { id: "supply", name: "Supply Chain Tech", growth: 11, margin: 22, capex: 12, risk: 53, complexity: 64 },
  { id: "energy", name: "Energy Storage", growth: 13, margin: 25, capex: 40, risk: 66, complexity: 82 }
];

export const agentPresets: Agent[] = [
  {
    id: "analyst",
    title: "Agent Analyst",
    focus: "Explain fundamentals",
    systemPrompt: "You are an industry analyst. Explain fundamentals clearly and concisely."
  },
  {
    id: "quant",
    title: "Agent Quant",
    focus: "Forecast numbers",
    systemPrompt: "You are a quantitative forecaster. Provide directional estimates and rationale."
  },
  {
    id: "strategist",
    title: "Agent Strategist",
    focus: "Explore scenarios",
    systemPrompt: "You are a strategist. Explore scenarios and strategic options."
  },
  {
    id: "storyteller",
    title: "Agent Storyteller",
    focus: "Craft narratives",
    systemPrompt: "You are a storyteller. Craft persuasive narratives and summaries."
  },
  {
    id: "risk",
    title: "Agent Risk Officer",
    focus: "Map vulnerabilities",
    systemPrompt: "You are a risk officer. Map vulnerabilities and mitigations."
  }
];
