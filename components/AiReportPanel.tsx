import { useEffect, useState } from "react";
import { IndustryDataBundle, Region, Scenario, TimeHorizon } from "../lib/domainTypes";
import { runOpenRouterAnalysis } from "../lib/openrouterClient";
import classNames from "classnames";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  bundle: IndustryDataBundle;
  region: Region;
  timeHorizon: TimeHorizon;
  scenario: Scenario;
}

const defaultPrompt = `Focus on:
- Executive summary
- Opportunities
- Risks
- KPIs to watch over next 12-24 months`;

export default function AiReportPanel({ bundle, region, timeHorizon, scenario }: Props) {
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://openrouter.ai/api/v1");
  const [model, setModel] = useState("anthropic/claude-3.5-sonnet");
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [basketSeries, setBasketSeries] = useState<BasketPoint[]>([]);
  const [companyTrends, setCompanyTrends] = useState<CompanyTrend[]>([]);
  const [topStories, setTopStories] = useState<TopStory[]>([]);

  interface BasketPoint {
    label: string;
    value: number;
  }

  interface CompanyTrend {
    name: string;
    ticker?: string;
    direction: "up" | "down";
    changePct: number;
    driver?: string;
  }

  interface TopStory {
    headline: string;
    summary?: string;
    impact?: string;
    source?: string;
  }

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

  const persistSettings = () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage;
    stored.setItem("openrouter_api_key", apiKey);
    stored.setItem("openrouter_base_url", baseUrl);
    stored.setItem("openrouter_model", model);
  };

  const buildUserPayload = () => {
    return JSON.stringify(
      {
        industry: bundle.industry,
        demographics: bundle.demographics,
        macro: bundle.macro,
        indicators: bundle.indicators,
        riskProfile: bundle.riskProfile,
        context: { region, timeHorizon, scenario, question }
      },
      null,
      2
    );
  };

  const buildStructuredTrendPrompt = () =>
    `
Create an illustrative market snapshot for the ${bundle.industry.name} industry. Use the context to stay grounded in the industry, but fabricate plausible example data when real-time data is unavailable.

Return ONLY valid JSON (no markdown). Shape:
{
  "basketIndex": [{"label": "T-10", "value": 98}, {"label": "Today", "value": 104}],
  "companies": [
    {"name": "Company A", "ticker": "AAA", "direction": "up", "changePct": 1.7, "driver": "Strong guidance"},
    ...
  ],
  "stories": [
    {"headline": "Descriptive headline", "summary": "1-2 sentence why it matters", "impact": "High|Medium|Low", "source": "Illustrative"}
  ]
}

Rules:
- Include 15 companies with unique names; direction must be "up" or "down"; changePct negative if direction is down.
- Provide 8-12 basketIndex points to show a trend line for an equal-weighted industry basket (start near 100).
- Include 5 concise stories for today's date with why they matter. Mark as illustrative if not certain.
- Do not add prose or code fences; output JSON only.

Industry context:
${buildUserPayload()}
`.trim();

  const parseStructuredInsights = (raw: string) => {
    try {
      const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleaned) as {
        basketIndex?: BasketPoint[];
        companies?: CompanyTrend[];
        stories?: TopStory[];
      };

      const basket = Array.isArray(parsed.basketIndex)
        ? parsed.basketIndex
            .map((p) => ({
              label: typeof p.label === "string" ? p.label : "",
              value: typeof p.value === "number" ? p.value : Number(p.value)
            }))
            .filter((p) => p.label && !Number.isNaN(p.value))
        : [];

      const companies = Array.isArray(parsed.companies)
        ? parsed.companies
            .map((c) => {
              const change = typeof c.changePct === "number" ? c.changePct : Number(c.changePct);
              const direction =
                typeof c.direction === "string" && c.direction.toLowerCase() === "down" ? "down" : "up";
              return {
                name: typeof c.name === "string" ? c.name : "",
                ticker: typeof c.ticker === "string" ? c.ticker : undefined,
                direction,
                changePct: Number.isNaN(change) ? 0 : change,
                driver: typeof c.driver === "string" ? c.driver : undefined
              } as CompanyTrend;
            })
            .filter((c) => c.name)
            .slice(0, 15)
        : [];

      const stories = Array.isArray(parsed.stories)
        ? parsed.stories
            .map((s) => ({
              headline: typeof s.headline === "string" ? s.headline : "",
              summary: typeof s.summary === "string" ? s.summary : undefined,
              impact: typeof s.impact === "string" ? s.impact : undefined,
              source: typeof s.source === "string" ? s.source : undefined
            }))
            .filter((s) => s.headline)
            .slice(0, 5)
        : [];

      if (!basket.length && !companies.length && !stories.length) {
        throw new Error("Empty structured snapshot");
      }

      setBasketSeries(basket);
      setCompanyTrends(companies);
      setTopStories(stories);
      setInsightsError(null);
    } catch (err) {
      setInsightsError("Could not parse structured trend/story data from OpenRouter.");
      setBasketSeries([]);
      setCompanyTrends([]);
      setTopStories([]);
      console.error("Failed to parse structured insights", err);
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    setInsightsError(null);
    setBasketSeries([]);
    setCompanyTrends([]);
    setTopStories([]);
    setStatus("Requesting analysis...");
    persistSettings();
    try {
      const normalizedModel = model.startsWith("openrouter/") ? model.replace(/^openrouter\//, "") : model;
      const systemPrompt = "You are a senior market analyst. Produce concise, decision-useful insights.";
      const userPrompt = `${prompt}\n\nIndustry data:\n${buildUserPayload()}`;
      const [content, structuredRaw] = await Promise.all([
        runOpenRouterAnalysis({
          model: normalizedModel,
          apiKey,
          baseUrl,
          systemPrompt,
          userPrompt
        }),
        runOpenRouterAnalysis({
          model: normalizedModel,
          apiKey,
          baseUrl,
          systemPrompt: "You are a data-only market snapshot generator. Respond with JSON only.",
          userPrompt: buildStructuredTrendPrompt()
        })
      ]);
      setResult(content);
      parseStructuredInsights(structuredRaw);
      setStatus("Success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setStatus("Testing connection...");
    setError(null);
    persistSettings();
    try {
      const normalizedModel = model.startsWith("openrouter/") ? model.replace(/^openrouter\//, "") : model;
      await runOpenRouterAnalysis({
        model: normalizedModel,
        apiKey,
        baseUrl,
        systemPrompt: "You are a ping responder.",
        userPrompt: "Reply with 'pong'."
      });
      setStatus("Connection ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm uppercase tracking-wide text-slate-500">AI Reports & Scenarios</div>
          <div className="text-sm text-slate-600">
            Region: {region} • Horizon: {timeHorizon} • Scenario: {scenario}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={testConnection}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            disabled={loading}
          >
            Test connection
          </button>
          <button
            onClick={runAnalysis}
            className={classNames(
              "rounded-lg px-4 py-2 text-sm font-semibold text-white",
              loading ? "bg-primary/60" : "bg-primary hover:bg-primary/90"
            )}
            disabled={loading}
          >
            {loading ? "Working..." : "Generate AI Report"}
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-3 md:col-span-1">
          <div className="text-sm font-semibold text-slate-800">OpenRouter Settings</div>
          <label className="block text-xs font-medium text-slate-600">
            API Key
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="sk-or-..."
            />
          </label>
          <label className="block text-xs font-medium text-slate-600">
            Base URL
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="https://openrouter.ai/api/v1"
            />
          </label>
          <label className="block text-xs font-medium text-slate-600">
            Model
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="anthropic/claude-3.5-sonnet (no 'openrouter/' prefix)"
            />
          </label>
        </div>
        <div className="space-y-3 md:col-span-2">
          <label className="block text-xs font-medium text-slate-600">
            Prompt template
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-xs font-medium text-slate-600">
            Q&A mode (optional question)
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Ask the model a question about this industry"
            />
          </label>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
            <div className="font-semibold text-slate-800">Payload preview</div>
            <pre className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-[11px]">
              {buildUserPayload()}
            </pre>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-100 bg-white p-3 lg:col-span-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-slate-800">Basket trend (top 15 companies)</div>
              <div className="text-xs text-slate-500">AI-generated, illustrative only.</div>
            </div>
            {insightsError && <span className="text-xs text-red-600">{insightsError}</span>}
          </div>
          <div className="mt-3 h-56">
            {basketSeries.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={basketSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} />
                  <YAxis tickLine={false} width={50} />
                  <Tooltip
                    formatter={(value: number) => [`${Number(value).toFixed(2)}`, "Basket"]}
                    labelFormatter={(label) => `Point: ${label}`}
                  />
                  <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">
                Run an analysis to populate the basket trend.
              </div>
            )}
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {companyTrends.length ? (
              companyTrends.map((company, idx) => {
                const formattedChange = `${company.direction === "down" ? "" : "+"}${company.changePct.toFixed(1)}%`;
                const badgeColor =
                  company.direction === "down"
                    ? "bg-rose-50 text-rose-700 border border-rose-100"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-100";
                return (
                  <div key={`${company.name}-${idx}`} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {company.name} {company.ticker && <span className="text-xs font-normal text-slate-500">{company.ticker}</span>}
                      </div>
                      {company.driver && <div className="text-xs text-slate-500">{company.driver}</div>}
                    </div>
                    <div className={classNames("rounded-full px-3 py-1 text-xs font-semibold", badgeColor)}>
                      <span className="mr-1 uppercase">{company.direction}</span>
                      <span>{formattedChange}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-500">Top company movers will appear here after running an analysis.</div>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-slate-800">Top 5 stories (today)</div>
              <div className="text-xs text-slate-500">Summarized via OpenRouter.</div>
            </div>
          </div>
          <div className="mt-3 space-y-3">
            {topStories.length ? (
              topStories.map((story, idx) => (
                <div key={`${story.headline}-${idx}`} className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="text-sm font-semibold text-slate-800">{story.headline}</div>
                  {story.summary && <div className="text-xs text-slate-600">{story.summary}</div>}
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    {story.impact && <span className="rounded-full bg-slate-200 px-2 py-0.5 uppercase">{story.impact}</span>}
                    {story.source && <span className="rounded-full bg-slate-200 px-2 py-0.5">{story.source}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">Run an analysis to fetch today&apos;s industry stories.</div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-slate-100 bg-white p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-800">AI Response</div>
          {status && <span className="text-xs text-green-600">{status}</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
        <div className="mt-2 min-h-[120px] whitespace-pre-wrap text-sm text-slate-800">
          {result || "Run an analysis to see the model output."}
        </div>
      </div>
    </div>
  );
}
