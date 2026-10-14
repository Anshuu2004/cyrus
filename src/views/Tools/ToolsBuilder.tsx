"use client";
/* ══ /tools/builder - the master prompt builder ══════════════════════
   Pick one artifact per slot, choose your AI tool and project type,
   get one combined prompt that already contains each artifact's exact
   default values (pulled from the same templates the tool pages use). */
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { Eyebrow, btn } from "@/components/ui";
import type { PromptTarget } from "@/lib/tools/types";
import { toolById } from "@/lib/tools/data";
import { defaultValues, fillTool } from "@/lib/tools/fill";
import AssistantChat from "@/components/AssistantChat";
import { Bread, CopyBtn } from "./shared";

interface Slot { key: string; label: string; help: string; picks: string[] }

const SLOTS: Slot[] = [
  { key: "style", label: "Visual style", help: "the overall look", picks: ["glassmorphism", "neumorphism", "brutalism", "soft-flat", "editorial-serif"] },
  { key: "layout", label: "Page layout", help: "how the page is arranged", picks: ["hero-section", "bento-grid", "sidebar-app-shell", "landing-page-flow", "pricing-compare"] },
  { key: "type", label: "Typography", help: "fonts and type scale", picks: ["font-pairing", "type-scale", "display-vs-body", "variable-fonts", "reading-line-height"] },
  { key: "colour", label: "Colour", help: "palette and contrast", picks: ["hsl-color-system", "accessible-contrast", "semantic-color-tokens", "dark-mode-palette", "tailwind-color-tokens"] },
  { key: "backend", label: "Backend", help: "data and APIs", picks: ["supabase-hosted-postgres", "postgres-first-db", "nextjs-route-handlers", "rest-api-basics", "vercel-blob"] },
  { key: "auth", label: "Sign-in", help: "who can log in", picks: ["google-sign-in", "github-oauth-signin", "magic-link-email", "clerk-drop-in", "jwt-vs-session-cookies"] },
  { key: "hosting", label: "Hosting", help: "where it goes live", picks: ["vercel-deploy", "cloudflare-pages", "github-pages-static", "render-long-running", "docker-one-command"] },
];

const PROJECT_TYPES = ["Landing page", "SaaS dashboard", "Portfolio", "Blog / content site", "Mobile web app", "Internal tool"];
const TARGETS: { id: PromptTarget; label: string }[] = [
  { id: "cursor", label: "Cursor" },
  { id: "claude", label: "Claude" },
  { id: "chatgpt", label: "ChatGPT / Codex" },
  { id: "lovable", label: "Lovable / v0" },
  { id: "generic", label: "Generic" },
];

const TARGET_OPEN: Record<PromptTarget, string> = {
  cursor: "You are working inside my repository. Follow the repo's existing conventions, file structure and styling. Build this:",
  claude: "Act as a careful senior front-end and full-stack engineer. Think step by step, ask no questions, state assumptions, then build this:",
  chatgpt: "Help me build this project the way pair programming would. Explain as you go in plain English. Here is the brief:",
  lovable: "Build this app:",
  generic: "Build the following project. Be explicit about every design and technical choice:",
};

export default function ToolsBuilder() {
  const [choice, setChoice] = useState<Record<string, string>>({
    style: "glassmorphism", layout: "hero-section", type: "font-pairing", colour: "hsl-color-system",
  });
  const [target, setTarget] = useState<PromptTarget>("cursor");
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [extra, setExtra] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  const available = useMemo(() => {
    const out: Record<string, { id: string; name: string; exists: boolean }[]> = {};
    for (const s of SLOTS) out[s.key] = s.picks.map((id) => ({ id, name: toolById(id)?.name ?? id, exists: Boolean(toolById(id)) }));
    return out;
  }, []);

  const prompt = useMemo(() => {
    const lines: string[] = [];
    lines.push(TARGET_OPEN[target]);
    lines.push("");
    lines.push(`Project: a ${projectType.toLowerCase()}${extra.trim() ? ` - ${extra.trim()}` : ""}.`);
    for (const slot of SLOTS) {
      const id = choice[slot.key];
      if (!id) continue;
      const tool = toolById(id);
      if (!tool) continue;
      const filled = fillTool(tool, defaultValues(tool));
      lines.push("");
      lines.push(`## ${slot.label}: ${tool.name}`);
      lines.push(filled.prompts[target]);
    }
    lines.push("");
    lines.push("Deliver working code, not explanations. Keep the design tokens consistent across every section.");
    return lines.join("\n");
  }, [choice, target, projectType, extra]);

  /* recents of combinations, localStorage */
  const [recents, setRecents] = useState<{ label: string; prompt: string }[]>([]);
  useEffect(() => {
    try { setRecents(JSON.parse(localStorage.getItem("agenthub.tools.recents") ?? "[]")); } catch { /* fresh */ }
  }, []);
  const keep = () => {
    const label = `${projectType} · ${SLOTS.map((s) => toolById(choice[s.key])?.name).filter(Boolean).slice(0, 3).join(", ")}…`;
    const next = [{ label, prompt }, ...recents].slice(0, 6);
    setRecents(next);
    try { localStorage.setItem("agenthub.tools.recents", JSON.stringify(next)); } catch { /* private mode */ }
  };

  const download = () => {
    const blob = new Blob([`# cyrus.ai artifact prompt\n\n${prompt}\n`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cyrus-prompt-${projectType.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1600);
  };

  return (
    <div className="max-w-[1080px] mx-auto px-5 md:px-8 pt-10 pb-24">
      <Bread items={[{ label: "Home", to: "/" }, { label: "Artifacts", to: "/tools" }, { label: "Prompt builder" }]} />
      <div className="mt-5">
        <Eyebrow>Master builder</Eyebrow>
        <h1 className="font-display font-extrabold tracking-[-.02em] text-[clamp(28px,4.2vw,46px)] leading-[1.06] mt-2">
          One prompt, <span className="text-accent">your whole app</span>
        </h1>
        <p className="text-cocoa text-[15.5px] leading-[1.65] mt-3 max-w-[620px]">
          Pick one artifact per slot - or leave a slot empty. The prompt assembles in your AI tool's own format, with each artifact's
          exact values baked in.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-6 mt-10 items-start">
        {/* choices */}
        <div className="space-y-5">
          <div className="bg-card border border-line rounded-[18px] p-5 shadow-soft">
            <h3 className="text-[13px] font-bold mb-3">What are you building?</h3>
            <div className="flex flex-wrap gap-2">
              {PROJECT_TYPES.map((p) => (
                <button key={p} onClick={() => setProjectType(p)} aria-pressed={projectType === p}
                  className={`text-[12.5px] font-semibold rounded-full px-3.5 py-2 border transition-colors ${projectType === p ? "bg-coffee text-foam border-coffee" : "bg-cream text-cocoa border-line hover:border-accent"}`}>
                  {p}
                </button>
              ))}
            </div>
            <input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="One sentence about it (optional): what it does, who it's for"
              aria-label="Project details"
              className="mt-3.5 w-full bg-cream border border-line rounded-[12px] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-accent placeholder:text-dim" />
          </div>

          <div className="bg-card border border-line rounded-[18px] p-5 shadow-soft">
            <h3 className="text-[13px] font-bold mb-1">Pick your AI tool</h3>
            <p className="text-[12px] text-dim mb-3">Formats the entire prompt for how that tool likes to be spoken to.</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Target AI tool">
              {TARGETS.map((t) => (
                <button key={t.id} role="radio" aria-checked={target === t.id} onClick={() => setTarget(t.id)}
                  className={`text-[12.5px] font-semibold rounded-full px-3.5 py-2 border transition-colors ${target === t.id ? "bg-peach text-rust border-accent" : "bg-cream text-cocoa border-line hover:border-accent"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-line rounded-[18px] p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold">Choose one per slot</h3>
              <button className="text-[11.5px] font-semibold text-cocoa hover:text-rust" onClick={() => setChoice({})}>Clear all</button>
            </div>
            <div className="space-y-4">
              {SLOTS.map((s) => (
                <div key={s.key}>
                  <p className="text-[11px] font-mono uppercase tracking-[.1em] text-dim mb-1.5">{s.label} <span className="normal-case tracking-normal font-sans text-[10.5px]">- {s.help}</span></p>
                  <div className="flex flex-wrap gap-1.5">
                    {available[s.key].map((opt) => (
                      <button key={opt.id} disabled={!opt.exists} onClick={() => setChoice((c) => ({ ...c, [s.key]: opt.id }))} aria-pressed={choice[s.key] === opt.id}
                        title={opt.exists ? opt.name : "Being written right now"}
                        className={`text-[12px] font-semibold rounded-full px-3 py-1.5 border transition-colors ${choice[s.key] === opt.id ? "bg-coffee text-foam border-coffee" : opt.exists ? "bg-cream text-cocoa border-line hover:border-accent" : "bg-cream text-dim border-dashed border-line cursor-not-allowed"}`}>
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {recents.length > 0 && (
            <div className="bg-cream border border-liness rounded-[18px] p-5">
              <h3 className="text-[12px] font-bold uppercase font-mono tracking-[.08em] text-dim mb-3">Saved combinations</h3>
              <div className="flex flex-wrap gap-2">
                {recents.map((r, i) => (
                  <button key={i} onClick={() => navigator.clipboard.writeText(r.prompt)} className="text-[12px] font-semibold bg-card border border-line rounded-full px-3 py-1.5 hover:border-accent transition-colors">
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* prompt coach - same open-source model as the site assistant */}
          <div className="bg-card border border-line rounded-[18px] p-5 shadow-soft">
            <div className="flex items-center gap-2.5 mb-3">
              <h3 className="text-[13px] font-bold">Prompt coach</h3>
              <span className="font-mono text-[9.5px] font-bold uppercase tracking-[.1em] text-dim ml-auto">open-source model</span>
            </div>
            <p className="text-[12px] text-dim mb-2 leading-[1.55]">
              Describe the app you want - the coach recommends artifact picks for the slots above and you apply them in one tap.
            </p>
            <AssistantChat
              mode="builder"
              compact
              context={`Project: ${projectType}${extra.trim() ? ` - ${extra.trim()}` : ""}. Target tool: ${TARGETS.find((t) => t.id === target)?.label}. Picked so far: ${SLOTS.map((s) => choice[s.key] ? `${s.key}=${choice[s.key]}` : s.key + "=empty").join(", ")}.`}
              starters={["Make it a SaaS dashboard with charts", "A portfolio that feels editorial", "What should a landing page pick?"]}
              placeholder="Tell the coach what you're building…"
              onApplyPlan={(plan) => setChoice((c) => ({ ...c, ...plan.slots }))}
            />
          </div>
        </div>

        {/* output */}
        <div className="lg:sticky lg:top-[92px]">
          <div className="bg-coffee rounded-[18px] shadow-dark overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-roast">
              <span className="font-mono text-[11px] uppercase tracking-[.12em] text-steam">Your {TARGETS.find((t) => t.id === target)?.label} prompt</span>
              <span className="font-mono text-[10.5px] text-dimdk">{prompt.length.toLocaleString()} chars</span>
            </div>
            <pre className="p-4 max-h-[430px] overflow-y-auto font-mono text-[11.5px] leading-[1.7] text-foam whitespace-pre-wrap">{prompt}</pre>
            <div className="flex items-center gap-2 px-4 py-3 border-t border-roast">
              <CopyBtn text={prompt} label="Copy prompt" extra="!border-roast !text-steam hover:!border-ember hover:!text-foam" />
              <button onClick={keep} className="font-mono text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-roast text-steam hover:border-ember hover:text-foam transition-colors">Save combo</button>
              <button onClick={download} className={`font-mono text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${downloaded ? "border-leaf text-leaf" : "border-roast text-steam hover:border-ember hover:text-foam"}`}>
                {downloaded ? "Saved" : "Download .md"}
              </button>
            </div>
          </div>
          <p className="text-[12px] text-dim mt-3 leading-[1.6]">
            Values here are each artifact's defaults - open a tool page to tune exact values, then copy its tailored prompt. <Link to="/tools" className="text-rust font-semibold hover:underline">All Artifacts ›</Link>
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Link to="/tools" className={btn("outline", "sm")}>‹ Back to Artifacts</Link>
      </div>
    </div>
  );
}
