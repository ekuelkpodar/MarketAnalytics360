import { useEffect, useState } from "react";
import { IndustryDataBundle, Region, Scenario, TimeHorizon } from "../lib/domainTypes";
import { runOpenRouterAnalysis } from "../lib/openrouterClient";
import classNames from "classnames";

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
  const [status, setStatus] = useState<string | null>(null);

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

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    setStatus("Requesting analysis...");
    persistSettings();
    try {
      const normalizedModel = model.startsWith("openrouter/") ? model.replace(/^openrouter\//, "") : model;
      const systemPrompt = "You are a senior market analyst. Produce concise, decision-useful insights.";
      const userPrompt = `${prompt}\n\nIndustry data:\n${buildUserPayload()}`;
      const content = await runOpenRouterAnalysis({
        model: normalizedModel,
        apiKey,
        baseUrl,
        systemPrompt,
        userPrompt
      });
      setResult(content);
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
