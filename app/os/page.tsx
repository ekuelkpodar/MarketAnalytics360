"use client";

import { useEffect, useMemo, useState } from "react";
import {
  agentPresets,
  compareSet,
  indicatorHub,
  layoutModes,
  opportunities,
  riskGrid,
  scenarios,
  shockRadar,
  structuralTrends,
  viewModes,
  IndicatorDatum,
  LayoutMode,
  ViewMode
} from "../../lib/advancedData";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { runMultiAgent } from "../../lib/openrouterAgents";
import classNames from "classnames";
import CommandPalette from "../../components/CommandPalette";

interface AgentResult {
  id: string;
  title: string;
  content: string;
  error?: string;
}

export default function AdvancedOS() {
  const [viewMode, setViewMode] = useState<ViewMode>("Executive");
  const [layout, setLayout] = useState<LayoutMode>("Dashboard");
  const [selectedIndustries, setSelectedIndustries] = useState(() => compareSet.slice(0, 3).map((i) => i.id));
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("anthropic/claude-3.5-sonnet");
  const [baseUrl, setBaseUrl] = useState("https://openrouter.ai/api/v1");
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage : null;
    if (!stored) return;
    const savedKey = stored.getItem("openrouter_api_key");
    const savedBase = stored.getItem("openrouter_base_url");
    const savedModel = stored.getItem("openrouter_model");
    if (savedKey) setApiKey(savedKey);
    if (savedBase) setBaseUrl(savedBase);
    if (savedModel) setModel(savedModel);
  }, []);

  const selectedIndustryData = useMemo(
    () => compareSet.filter((c) => selectedIndustries.includes(c.id)),
    [selectedIndustries]
  );

  const comparisonRadar = useMemo(
    () =>
      selectedIndustryData.map((item) => ({
        industry: item.name,
        Growth: item.growth,
        Margin: item.margin,
        "CAPEX Intensity": item.capex,
        "Risk Level": item.risk,
        Complexity: item.complexity
      })),
    [selectedIndustryData]
  );

  const runAgents = async () => {
    setAgentLoading(true);
    setAgentError(null);
    try {
      const runs = await runMultiAgent({
        agents: agentPresets.map((a) => ({ ...a, model })),
        userPrompt: buildAgentUserPrompt(),
        apiKey,
        baseUrl
      });
      setAgentResults(runs as AgentResult[]);
    } catch (err) {
      setAgentError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setAgentLoading(false);
    }
  };

  const buildAgentUserPrompt = () => {
    return `Mode: ${viewMode}\nLayout: ${layout}\nProvide concise, decision-grade output with bullet structure and clear calls to action.`;
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <CommandPalette
        commands={[
          { id: "run-agents", label: "Run AI agents", action: runAgents },
          { id: "scroll-indicators", label: "Go to Indicators", action: () => scrollTo("indicators") },
          { id: "scroll-risk", label: "Go to Risk grid", action: () => scrollTo("risk-grid") },
          { id: "scroll-compare", label: "Go to Comparison", action: () => scrollTo("comparison") },
          { id: "scroll-scenarios", label: "Go to Scenarios", action: () => scrollTo("scenarios") }
        ]}
      />
      <div className="bg-slate-900 text-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Market 360° OS</div>
              <h1 className="text-3xl font-semibold text-white">Advanced AI Intelligence System</h1>
              <p className="text-sm text-slate-300">Macro → micro, multi-agent, scenario-grade workspace.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {viewModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={classNames(
                    "rounded-full px-3 py-2 text-xs font-semibold",
                    viewMode === mode ? "bg-emerald-500 text-white" : "bg-white/10 text-emerald-100"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span>Layout:</span>
            {layoutModes.map((mode) => (
              <button
                key={mode}
                onClick={() => setLayout(mode)}
                className={classNames(
                  "rounded-full px-3 py-1 font-semibold",
                  layout === mode ? "bg-white text-slate-900" : "bg-white/10 text-white"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <section className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Industry Intelligence Hub</div>
                <div className="text-lg font-semibold text-slate-900">Macro → Micro</div>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Modes: {viewMode}</div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <IntelligenceCard title="Demographics & Segmentation" items={["Customer mix", "Region weight", "Buyer roles"]} />
              <IntelligenceCard title="Value Chain" items={["Upstream", "Midstream", "Downstream"]} />
              <IntelligenceCard title="Unit Economics" items={["COGS", "Gross margin", "CAC / LTV"]} />
              <IntelligenceCard title="Market Structure" items={["Fragmentation", "Pricing power", "Switching costs"]} />
              <IntelligenceCard title="Regulatory & ESG" items={["Reg pressure index", "Compliance hotspots"]} />
              <IntelligenceCard title="Talent & Labor" items={["Skill gaps", "Wage pressure", "Attrition risk"]} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Command & Search</div>
                <div className="text-lg font-semibold text-slate-900">Command palette</div>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">⌘K</div>
            </div>
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="Search industries, indicators, risks..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">
                Try: "Show leading indicators", "Compare semis vs energy storage", "Generate extreme scenario".
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm font-semibold text-slate-900">Layout presets</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="rounded-full bg-slate-100 px-3 py-1">Dashboard</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">Research</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">Executive</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">Quant</span>
              </div>
            </div>
          </div>
        </section>

        <section id="indicators" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Indicator Intelligence Center</div>
              <div className="text-lg font-semibold text-slate-900">Macro, Leading, Lagging, Sentiment</div>
            </div>
            <div className="text-xs text-slate-500">Why this matters: AI annotations per indicator</div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {indicatorHub.map((ind) => (
              <IndicatorCard key={ind.name} datum={ind} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Macro Shock Radar</div>
                <div className="text-lg font-semibold text-slate-900">Vulnerability heatmap</div>
              </div>
              <div className="text-xs text-slate-500">AI: “Here is why this industry is vulnerable to X.”</div>
            </div>
            <div className="mt-3 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={shockRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={45} domain={[0, 100]} />
                  <Radar dataKey="score" stroke="#0f766e" fill="#0f766e" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {shockRadar.slice(0, 4).map((item) => (
                <div key={item.name} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-slate-600">{item.explanation}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Structural Trends Engine</div>
                  <div className="text-lg font-semibold text-slate-900">Long-term forces</div>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  AI scored
                </div>
              </div>
              <div className="mt-3 space-y-3">
                {structuralTrends.map((trend) => (
                  <div key={trend.name} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{trend.name}</div>
                        <div className="text-xs text-slate-600">{trend.description}</div>
                      </div>
                      <div className="text-right text-xs text-slate-600">
                        <div>Likelihood: {trend.likelihood}</div>
                        <div>Impact: {trend.impact}</div>
                        <div>Horizon: {trend.horizon}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-700">Implication: {trend.implication}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Opportunity Radar</div>
                  <div className="text-lg font-semibold text-slate-900">White space map</div>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  AI suggested
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {opportunities.map((opp) => (
                  <div key={opp.name} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                      <span>{opp.name}</span>
                      <span className="text-xs text-slate-600">{opp.category}</span>
                    </div>
                    <div className="text-xs text-slate-700">{opp.rationale}</div>
                    <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-slate-600">
                      <span className="rounded-full bg-white px-2 py-0.5">Enablers: {opp.enablers.join(", ")}</span>
                      <span className="rounded-full bg-white px-2 py-0.5">ROI: {opp.roi}</span>
                      <span className="rounded-full bg-white px-2 py-0.5">Difficulty: {opp.difficulty}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="risk-grid" className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Risk Grid</div>
                <div className="text-lg font-semibold text-slate-900">AI-driven mitigations & signals</div>
              </div>
              <div className="text-xs text-slate-500">Probability / Severity</div>
            </div>
            <div className="mt-3 space-y-2">
              {riskGrid.map((risk) => (
                <div key={risk.name} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">{risk.name}</div>
                    <div className="text-xs text-slate-600">{risk.type}</div>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-700">
                    <span className="rounded-full bg-white px-2 py-0.5">Prob: {risk.probability}</span>
                    <span className="rounded-full bg-white px-2 py-0.5">Severity: {risk.severity}</span>
                    <span className="rounded-full bg-white px-2 py-0.5">Signals: {risk.signals}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-700">Mitigation: {risk.mitigation}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Scenario Generator</div>
                <div className="text-lg font-semibold text-slate-900">Baseline, stress, disruption</div>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{scenarios.length} presets</div>
            </div>
            <div className="mt-3 space-y-3">
              {scenarios.map((scenario) => (
                <div key={scenario.name} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">{scenario.name}</div>
                    <div className="text-xs text-slate-600">{scenario.impact}</div>
                  </div>
                  <div className="text-xs text-slate-700">{scenario.narrative}</div>
                  <div className="mt-2 grid gap-1 text-[11px] text-slate-700 sm:grid-cols-2">
                    <div>Opportunities: {scenario.opportunities.join("; ")}</div>
                    <div>Risks: {scenario.risks.join("; ")}</div>
                    <div>KPIs: {scenario.kpis.join(", ")}</div>
                    <div>Actions: {scenario.actions.join(", ")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="comparison" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Multi-Industry Comparison</div>
              <div className="text-lg font-semibold text-slate-900">Benchmark engine</div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {compareSet.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setSelectedIndustries((prev) =>
                      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                    )
                  }
                  className={classNames(
                    "rounded-full px-3 py-1 font-semibold",
                    selectedIndustries.includes(item.id) ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={comparisonRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="industry" />
                <PolarRadiusAxis angle={45} domain={[0, 100]} />
                <Radar dataKey="Growth" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                <Radar dataKey="Margin" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
                <Radar dataKey="CAPEX Intensity" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                <Radar dataKey="Risk Level" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
                <Radar dataKey="Complexity" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {selectedIndustryData.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-slate-600">
                  Growth {item.growth}% • Margin {item.margin}% • CAPEX {item.capex}% • Risk {item.risk} • Complexity{" "}
                  {item.complexity}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">AI Market Copilot</div>
              <div className="text-lg font-semibold text-slate-900">Multi-agent analysis (OpenRouter)</div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-700">
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="OpenRouter API key"
                className="rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              />
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                type="text"
                className="rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              />
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                type="text"
                className="rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={runAgents}
                disabled={agentLoading}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-400"
              >
                {agentLoading ? "Running..." : "Run agents"}
              </button>
            </div>
          </div>
          {agentError && <div className="mt-2 text-sm text-red-600">{agentError}</div>}
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {agentResults.length === 0 && (
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Provide your API key and model, then run agents to see outputs.
              </div>
            )}
            {agentResults.map((result) => (
              <div key={result.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">{result.title}</div>
                  <div className="text-xs text-slate-600">{agentPresets.find((a) => a.id === result.id)?.focus}</div>
                </div>
                {result.error ? (
                  <div className="mt-2 text-xs text-red-600">{result.error}</div>
                ) : (
                  <div className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">{result.content}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="scenarios" className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Report Generator</div>
                <div className="text-lg font-semibold text-slate-900">Templates & exports</div>
              </div>
              <div className="text-xs text-slate-500">PDF / Markdown / HTML</div>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {[
                "Market summary",
                "Competitive landscape",
                "Risk report",
                "Executive briefing",
                "Scenario pack",
                "Investor pitch style"
              ].map((t) => (
                <div key={t} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {t}
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">Export PDF</button>
              <button className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-800">Export Markdown</button>
              <button className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-800">Export HTML</button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Data & Extensibility</div>
                <div className="text-lg font-semibold text-slate-900">Real-time hooks</div>
              </div>
              <div className="text-xs text-slate-500">FRED, World Bank, News, Prices</div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <div className="font-semibold text-slate-900">APIs</div>
                <div className="text-xs text-slate-600">FRED, World Bank, News sentiment, Stock/Commodity feeds, Hiring, Search trends</div>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <div className="font-semibold text-slate-900">Widget framework</div>
                <div className="text-xs text-slate-600">Drag-and-drop, save custom dashboards, user bundles (e.g., Energy Pack).</div>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <div className="font-semibold text-slate-900">Assistant</div>
                <div className="text-xs text-slate-600">Minimizable AI assistant with command palette triggers.</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function IntelligenceCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <ul className="mt-1 space-y-1 text-xs text-slate-700">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function IndicatorCard({ datum }: { datum: IndicatorDatum }) {
  const badge =
    datum.direction === "up"
      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
      : "bg-rose-100 text-rose-700 border border-rose-200";

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">{datum.name}</div>
          <div className="text-xs text-slate-600">{datum.category}</div>
        </div>
        <div className={classNames("rounded-full px-3 py-1 text-xs font-semibold", badge)}>
          {datum.direction === "up" ? "↑" : "↓"} {datum.change}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <span className="font-semibold text-slate-900">{datum.value}</span>
        <span className="text-xs text-slate-600">Sensitivity: {datum.sensitivity}</span>
      </div>
      <div className="mt-2 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={datum.series}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" hide />
            <YAxis hide />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#0f766e" fill="#a7f3d0" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-slate-700">Why this matters: {datum.why}</div>
    </div>
  );
}
