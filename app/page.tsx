/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import IndustrySidebar from "../components/IndustrySidebar";
import FilterBar from "../components/FilterBar";
import OverviewPanel from "../components/OverviewPanel";
import DemographicsPanel from "../components/DemographicsPanel";
import BusinessValueChainPanel from "../components/BusinessValueChainPanel";
import MacroEnvironmentPanel from "../components/MacroEnvironmentPanel";
import LeadingIndicatorsPanel from "../components/LeadingIndicatorsPanel";
import LaggingIndicatorsPanel from "../components/LaggingIndicatorsPanel";
import AiReportPanel from "../components/AiReportPanel";
import { getIndustriesList, getIndustryData } from "../lib/dataLoader";
import { Region, Scenario, TimeHorizon } from "../lib/domainTypes";
import AuthModal from "../components/AuthModal";

const industries = getIndustriesList();

export default function Page() {
  const [selectedIndustryId, setSelectedIndustryId] = useState(industries[0]?.id ?? "automotive");
  const [region, setRegion] = useState<Region>("Global");
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("Short-term");
  const [scenario, setScenario] = useState<Scenario>("Baseline");
  const [filterText, setFilterText] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const bundle = useMemo(() => getIndustryData(selectedIndustryId), [selectedIndustryId]);

  const proofPoints = [
    { label: "Coverage", value: "25+ industries", detail: "Value chains, macro, indicators" },
    { label: "AI-ready", value: "Structured context", detail: "Clean payloads for copilots" },
    { label: "Speed", value: "<2 min setup", detail: "No data wrangling required" }
  ];

  const strengths = [
    { title: "Executive clarity", body: "Board-ready narratives plus scenario pivots you can run live." },
    { title: "Signal-driven", body: "Leading/lagging indicators and AI summaries tuned to decisions, not noise." },
    { title: "Enterprise posture", body: "Configurable OpenRouter settings, zero data persistence in the UI." }
  ];

  const steps = [
    { title: "Pick a sector", body: "Select an industry and region to load curated structures instantly." },
    { title: "Stress scenarios", body: "Shift horizon and scenarios to see how KPIs and risks reshape." },
    { title: "Generate & share", body: "Use AI Reports for memos, trends, and daily story rollups." }
  ];

  const topSegment = useMemo(() => {
    const seg = [...bundle.demographics.customerSegments].sort((a, b) => (b.share ?? 0) - (a.share ?? 0))[0];
    return seg ? `${seg.name} (${seg.type})` : "N/A";
  }, [bundle.demographics.customerSegments]);

  const topRegion = useMemo(() => {
    const priority = { High: 3, Medium: 2, Low: 1 } as const;
    const regionEntry = [...bundle.demographics.regions].sort(
      (a, b) => (priority[b.importance as keyof typeof priority] ?? 0) - (priority[a.importance as keyof typeof priority] ?? 0)
    )[0];
    return regionEntry ? `${regionEntry.name} • ${regionEntry.importance}` : "N/A";
  }, [bundle.demographics.regions]);

  const riskSpotlight = useMemo(() => {
    const impactRank = { High: 3, Medium: 2, Low: 1 } as const;
    const risk = [...bundle.riskProfile.risks].sort(
      (a, b) => (impactRank[b.impact as keyof typeof impactRank] ?? 0) - (impactRank[a.impact as keyof typeof impactRank] ?? 0)
    )[0];
    return risk ? `${risk.item} (${risk.impact})` : "N/A";
  }, [bundle.riskProfile.risks]);

  const marginScore = useMemo(() => {
    const map = { Low: 1, Medium: 2, High: 3 };
    const values = bundle.industry.valueChain.map((v) => map[v.marginProfile]);
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    if (avg >= 2.5) return "Margin mix: higher";
    if (avg >= 1.7) return "Margin mix: balanced";
    return "Margin mix: tighter";
  }, [bundle.industry.valueChain]);

  const indicatorCoverage = useMemo(
    () =>
      `${bundle.indicators.leadingIndicators.length} leading • ${bundle.indicators.laggingIndicators.length} lagging`,
    [bundle.indicators.leadingIndicators.length, bundle.indicators.laggingIndicators.length]
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ma360_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      setUser(null);
    }
  }, []);

  const handleAuth = (authed: { name: string; email: string }) => {
    setUser(authed);
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem("ma360_user");
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-slate-950 text-slate-50">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute right-[-80px] top-32 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 lg:pt-16">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-lg font-semibold text-emerald-200">
                360
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-emerald-200/80">MarketAnalytics360</div>
                <div className="text-xs text-slate-300">Industry intelligence that reads like a memo.</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <div className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-emerald-100">
                    {user.name} • {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="rounded-full border border-emerald-300/60 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-lg shadow-emerald-500/20 transition hover:border-emerald-200 hover:bg-emerald-400/20"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode("signin");
                      setAuthOpen(true);
                    }}
                    className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900/50"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthOpen(true);
                    }}
                    className="rounded-full border border-emerald-300/60 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-lg shadow-emerald-500/20 transition hover:border-emerald-200 hover:bg-emerald-400/20"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </header>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr,1fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                AI-ready sector intelligence
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Built for faster M&A, strategy, GTM
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Executive-grade insight,
                  <br />
                  without analyst busywork.
                </h1>
                <p className="max-w-2xl text-lg text-slate-200">
                  MarketAnalytics360 blends curated industry structures with on-demand AI reporting. See value chains,
                  indicators, and daily narratives in minutes—ready for leadership decks, ICs, or board prep.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    if (user) {
                      const el = document.getElementById("live-console");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    } else {
                      setAuthMode("signup");
                      setAuthOpen(true);
                    }
                  }}
                  className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {user ? "Open the dashboard" : "Get started free"}
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("why");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900/50"
                >
                  Why teams choose us
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {proofPoints.map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-800 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-wide text-emerald-200/80">{item.label}</div>
                    <div className="text-lg font-semibold text-white">{item.value}</div>
                    <div className="text-sm text-slate-300">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-emerald-500/10 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Live snapshot</span>
                <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  AI + curated data
                </span>
              </div>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-300">Current focus</div>
                      <div className="text-lg font-semibold text-white">{bundle.industry.name}</div>
                    </div>
                    <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                      {region} • {timeHorizon}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm text-slate-200">
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
                      <span>Leading indicators</span>
                      <span className="text-emerald-200">Demand, Capex, Pricing</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
                      <span>Macro drivers</span>
                      <span className="text-emerald-200">Policy, Credit, Supply</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
                      <span>AI output</span>
                      <span className="text-emerald-200">Report + trendline + stories</span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-4">
                    <div className="text-xs uppercase tracking-wide text-emerald-100/80">Decision time</div>
                    <div className="text-2xl font-semibold text-white">Hours → Minutes</div>
                    <div className="text-sm text-slate-200">No manual modeling before you brief leadership.</div>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                    <div className="text-xs uppercase tracking-wide text-emerald-100/80">Ready for AI</div>
                    <div className="text-2xl font-semibold text-white">Structured payloads</div>
                    <div className="text-sm text-slate-200">Pipe context straight into OpenRouter to narrate trends.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="why" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Why MarketAnalytics360</p>
              <h2 className="text-3xl font-semibold text-slate-900">Built for strategy, finance, and GTM leaders.</h2>
              <p className="text-lg text-slate-600">
                Every section is structured: demographics, value chain, macro, indicators, risk/opportunity, and AI reports.
                No guesswork about what to ask—just pick a sector and press go.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:w-1/2">
              {strengths.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <div className="mt-2 text-sm text-slate-600">{item.body}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">Step {idx + 1}</div>
                <div className="text-lg font-semibold text-slate-900">{step.title}</div>
                <div className="text-sm text-slate-600">{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="live-console" className="bg-slate-100 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Live console</p>
            <h2 className="text-3xl font-semibold text-slate-900">Explore the industry intelligence workspace.</h2>
            <p className="max-w-3xl text-slate-600">
              Toggle industries, adjust horizon and scenarios, and generate AI reports with trend lines and daily story rollups
              using your OpenRouter key.
            </p>
          </div>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-emerald-500/10">
            <div className="relative flex min-h-[780px] overflow-hidden rounded-3xl border border-slate-100">
              {!user && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-white/70 p-6 text-center backdrop-blur-sm">
                  <div className="text-2xl font-semibold text-slate-900">Sign in to launch the console</div>
                  <div className="max-w-xl text-slate-600">
                    Create a free session to explore the industry dashboard, generate AI reports, and track trends.
                    Demo-only authentication; replace with your IDP when ready.
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => {
                        setAuthMode("signup");
                        setAuthOpen(true);
                      }}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700"
                    >
                      Sign up
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode("signin");
                        setAuthOpen(true);
                      }}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              )}
              <IndustrySidebar
                industries={industries}
                selectedId={selectedIndustryId}
                onSelect={setSelectedIndustryId}
                filterText={filterText}
                onFilterChange={setFilterText}
              />
              <div className="flex-1">
                <FilterBar
                  region={region}
                  timeHorizon={timeHorizon}
                  scenario={scenario}
                  onRegionChange={setRegion}
                  onTimeChange={setTimeHorizon}
                  onScenarioChange={setScenario}
                />
                <main className="space-y-4 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-white px-4 py-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-emerald-700">At a glance</div>
                      <div className="text-lg font-semibold text-slate-900">{bundle.industry.name}</div>
                      <div className="text-sm text-slate-600">
                        {region} • {timeHorizon} • {scenario}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-800">
                      <span className="rounded-full bg-slate-100 px-3 py-1">Top segment: {topSegment}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">Focus region: {topRegion}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">Risk: {riskSpotlight}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">{indicatorCoverage}</span>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                      <div className="text-xs uppercase tracking-wide text-emerald-700">Customer mix</div>
                      <div className="mt-1 text-xl font-semibold text-slate-900">{topSegment}</div>
                      <div className="text-sm text-slate-600">Dominant buyer cohort</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                      <div className="text-xs uppercase tracking-wide text-emerald-700">Geography</div>
                      <div className="mt-1 text-xl font-semibold text-slate-900">{topRegion}</div>
                      <div className="text-sm text-slate-600">Where demand is weighted</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                      <div className="text-xs uppercase tracking-wide text-emerald-700">Margin mix</div>
                      <div className="mt-1 text-xl font-semibold text-slate-900">{marginScore}</div>
                      <div className="text-sm text-slate-600">{bundle.industry.valueChain.length} value chain stages</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                      <div className="text-xs uppercase tracking-wide text-emerald-700">Indicator coverage</div>
                      <div className="mt-1 text-xl font-semibold text-slate-900">{indicatorCoverage}</div>
                      <div className="text-sm text-slate-600">Balanced leading/lagging signals</div>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <OverviewPanel industry={bundle.industry} />
                    <DemographicsPanel demographics={bundle.demographics} />
                  </div>
                  <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
                    <BusinessValueChainPanel industry={bundle.industry} />
                    <div className="space-y-4">
                      <MacroEnvironmentPanel macro={bundle.macro} />
                      <div className="card p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm uppercase tracking-wide text-slate-500">Risk & Opportunities</div>
                            <div className="text-sm text-slate-700">Condensed view for prioritization</div>
                          </div>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            {bundle.riskProfile.opportunities.length} opportunities
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {bundle.riskProfile.risks.slice(0, 3).map((risk) => (
                            <div
                              key={risk.item}
                              className="flex items-start justify-between rounded-lg border border-amber-100 bg-amber-50 px-3 py-2"
                            >
                              <div>
                                <div className="text-sm font-semibold text-amber-800">{risk.item}</div>
                                <div className="text-xs text-amber-700">Impact: {risk.impact}</div>
                              </div>
                              <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-amber-700">
                                Watch
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 grid gap-2">
                          {bundle.riskProfile.opportunities.slice(0, 3).map((opp) => (
                            <div key={opp} className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                              {opp}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <LeadingIndicatorsPanel indicators={bundle.indicators} />
                  <LaggingIndicatorsPanel indicators={bundle.indicators} />
                  <AiReportPanel bundle={bundle} region={region} timeHorizon={timeHorizon} scenario={scenario} />
                </main>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-8 text-slate-50 shadow-xl lg:px-10 lg:py-12">
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr] lg:items-center">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Ready when you are</p>
                <h3 className="text-3xl font-semibold leading-tight text-white">
                  Launch MarketAnalytics360 for your next IC, earnings prep, or board update.
                </h3>
                <p className="text-lg text-slate-200">
                  Bring your OpenRouter key, choose a sector, and generate professional-grade insight in a few clicks.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#live-console"
                    className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Enter the console
                  </a>
                  <a
                    href="mailto:hello@marketanalytics360.com"
                    className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
                  >
                    Talk to us
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Setup</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-300" />
                    Under 2 minutes
                  </span>
                </div>
                <ul className="mt-3 space-y-2 text-slate-100">
                  <li>• Paste your OpenRouter API key</li>
                  <li>• Pick model and region/horizon</li>
                  <li>• Generate report + trendline + top stories</li>
                </ul>
                <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-xs text-emerald-100">
                  No persistence of your prompts or outputs in the UI—bring your own key, keep control.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} onAuthed={handleAuth} />
    </div>
  );
}
