interface RunOpenRouterParams {
  model: string;
  apiKey: string;
  baseUrl?: string;
  systemPrompt: string;
  userPrompt: string;
}

export async function runOpenRouterAnalysis({
  model,
  apiKey,
  baseUrl = "https://openrouter.ai/api/v1",
  systemPrompt,
  userPrompt
}: RunOpenRouterParams): Promise<string> {
  if (!apiKey) {
    throw new Error("OpenRouter API key is missing.");
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "market-360.local",
      "X-Title": "Market 360"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from OpenRouter.");
  }
  return content as string;
}
