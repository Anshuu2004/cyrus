/* ══ POST /api/assistant — chat with the open-source helper model ══
   Routes to Hugging Face Inference (Llama by default) when HF_TOKEN
   is set; otherwise answers from the built-in offline helper so the
   UI stays usable. Two modes: "assistant" (site help) and "builder"
   (prompt coaching that can emit a ```cyrus-plan block).          ═ */
import { HF_MODEL, hfChat, hfReady, type ChatMsg } from "@/lib/server/hf";
import { demoReply } from "@/lib/server/assistant-demo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE = `You are the built-in helper of cyrus.ai, a directory for hackathons, open-source programs, projects and design/prompt artifacts.
Pages you can point people to: /hackathons (calendar with live deadlines), /dashboard and one page per feature (/dashboard/saved, /orgs, /matcher, /watchlist, /mentors, /compare, /artifacts, /deadlines, /reading, /activity, /stack), /projects, /organizations, /opensource (program project archive), /resources, /tools (artifact directory with live demos and copy-paste prompts), /tools/builder (assembles one combined prompt for Cursor, Claude, ChatGPT or Lovable), /apis (free API directory), /nova (matching engine).
Style rules: answer in at most 120 words, plain sentences, no emoji, no arrow symbols, use hyphens not em dashes, name the exact page or button instead of describing it vaguely. If asked something off-site, answer briefly and steer back.`;

const BUILDER = (context: string) => `You are the prompt coach inside cyrus.ai's master prompt builder. The builder assembles one combined prompt from artifact picks across slots: style, layout, type, colour, backend, auth, hosting.
Current state: ${context}
Job: help the user shape a great prompt. Ask at most ONE clarifying question per reply, then make a concrete recommendation. When you recommend slot choices, include a fenced block exactly like:
\`\`\`cyrus-plan
{"slots":{"style":"glassmorphism","layout":"bento-grid"}}
\`\`\`
Only use these artifact ids: style soft-flat|editorial-serif|glassmorphism|neumorphism|brutalism; layout hero-section|bento-grid|sidebar-app-shell|landing-page-flow|pricing-compare; type font-pairing|type-scale|display-vs-body|variable-fonts|reading-line-height; colour hsl-color-system|accessible-contrast|semantic-color-tokens|dark-mode-palette|tailwind-color-tokens; backend supabase-hosted-postgres|postgres-first-db|nextjs-route-handlers|rest-api-basics|vercel-blob; auth google-sign-in|github-oauth-signin|magic-link-email|clerk-drop-in|jwt-vs-session-cookies; hosting vercel-deploy|cloudflare-pages|github-pages-static|render-long-running|docker-one-command.
Rules: under 110 words, no emoji, no arrow symbols, hyphens not em dashes.`;

export async function POST(req: Request) {
  let body: { messages?: { role?: string; content?: string }[]; mode?: string; context?: string };
  try { body = await req.json(); } catch { body = {}; }

  const chat: ChatMsg[] = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role as "user" | "assistant", content: (m.content as string).slice(0, 4000) }))
    .slice(-14);
  if (!chat.length) return Response.json({ error: "no messages" }, { status: 400 });

  const mode = body.mode === "builder" ? "builder" : "assistant";
  const system: ChatMsg = {
    role: "system",
    content: mode === "builder"
      ? BUILDER((body.context ?? "no picks yet").slice(0, 1200))
      : SITE,
  };

  if (hfReady()) {
    const reply = await hfChat([system, ...chat]);
    if (reply) return Response.json({ reply, model: HF_MODEL, demo: false });
    return Response.json({
      reply: demoReply(mode as "assistant" | "builder", chat) + "\n\n(the open-source model didn't answer just now - that was the offline helper)",
      model: "offline helper", demo: true,
    });
  }
  return Response.json({ reply: demoReply(mode as "assistant" | "builder", chat), model: "offline helper", demo: true });
}
