import { runOpenRouterAnalysis } from "./openrouterClient";

export interface AgentConfig {
  id: string;
  title: string;
  model: string;
  temperature?: number;
  systemPrompt: string;
}

export interface AgentRequest {
  agents: AgentConfig[];
  userPrompt: string;
  baseUrl?: string;
  apiKey: string;
}

export async function runMultiAgent(request: AgentRequest): Promise<{ id: string; title: string; content: string; error?: string }[]> {
  const { agents, userPrompt, apiKey, baseUrl } = request;
  const runs = agents.map(async (agent) => {
    try {
      const content = await runOpenRouterAnalysis({
        apiKey,
        baseUrl,
        model: normalizeModel(agent.model),
        systemPrompt: agent.systemPrompt,
        userPrompt,
        temperature: agent.temperature
      });
      return { id: agent.id, title: agent.title, content };
    } catch (err) {
      return {
        id: agent.id,
        title: agent.title,
        content: "",
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  });
  return Promise.all(runs);
}

function normalizeModel(model: string) {
  return model.startsWith("openrouter/") ? model.replace(/^openrouter\//, "") : model;
}
