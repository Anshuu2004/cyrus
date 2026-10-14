/* ══ hf.ts — server-side calls to an open-source model ════════════
   Hugging Face Inference (router.huggingface.co) with a Llama chat
   model by default - open weights, served by the community's own
   router. Needs HF_TOKEN (an "hf_..." access token) in the server
   environment; without it every caller falls back to the built-in
   demo replies so the UI still works end to end.                  ═ */

export const HF_MODEL = (process.env.HF_MODEL ?? "meta-llama/Llama-3.1-8B-Instruct").trim();

export function hfReady(): boolean {
  return Boolean(process.env.HF_TOKEN?.trim());
}

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

/** chat completion -> assistant text, or null when HF rejects/offline */
export async function hfChat(messages: ChatMsg[]): Promise<string | null> {
  const token = process.env.HF_TOKEN?.trim();
  if (!token) return null;
  try {
    const r = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: HF_MODEL,
        messages,
        max_tokens: 700,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!r.ok) return null;
    const j = await r.json().catch(() => null);
    const text: unknown = j?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}
