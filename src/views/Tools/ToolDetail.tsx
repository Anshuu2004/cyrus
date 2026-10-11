"use client";
/* ══ /tools/[category]/[subcategory]/[tool] - the tool page ═════════
   One control panel drives three things at once: the live demo, the
   generated code, and all five AI prompt tabs (exact chosen values). */
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { Eyebrow, btn } from "@/components/ui";
import type { Control, ControlValues } from "@/lib/tools/types";
import { findCategory, findSubcategory } from "@/lib/tools/types";
import { relatedTools, toolById } from "@/lib/tools/data";
import { defaultValues, fillTool } from "@/lib/tools/fill";
import { Bread, CodeBlock, CopyBtn, DemoFrame, FavBtn, ToolCard, useFavs } from "./shared";

const DIFF_TONE: Record<string, string> = {
  beginner: "text-leaf border-leaf/40 bg-leaf/5",
  intermediate: "text-honey border-honey/40 bg-honey/5",
  advanced: "text-brick border-brick/40 bg-brick/5",
};

function ControlInput({ c, value, onChange }: { c: Control; value: string | number | boolean; onChange: (v: string | number | boolean) => void }) {
  if (c.type === "color") {
    return (
      <div className="flex items-center gap-2">
        <input type="color" value={String(value)} onChange={(e) => onChange(e.target.value)} aria-label={c.label + " picker"}
          className="w-9 h-9 rounded-[10px] border border-line bg-transparent p-1 cursor-pointer" />
        <input type="text" value={String(value)} onChange={(e) => onChange(e.target.value)} aria-label={c.label + " hex"}
          pattern="^#?[0-9a-fA-F]{6}$"
          className="font-mono text-[12px] bg-card border border-line rounded-lg px-2.5 py-2 w-[104px] outline-none focus:border-accent" />
      </div>
    );
  }
  if (c.type === "slider") {
    return (
      <div className="flex items-center gap-3 w-full">
        <input type="range" min={c.min} max={c.max} step={c.step ?? 1} value={Number(value)} onChange={(e) => onChange(Number(e.target.value))} aria-label={c.label}
          className="flex-1 min-w-0 accent-accent" />
        <span className="font-mono text-[11.5px] text-cocoa w-[54px] text-right shrink-0">{String(value)}{c.unit ?? ""}</span>
      </div>
    );
  }
  if (c.type === "toggle") {
    return (
      <button role="switch" aria-checked={Boolean(value)} aria-label={c.label} onClick={() => onChange(!value)}
        className={`relative w-[44px] h-[26px] rounded-full transition-colors ${value ? "bg-accent" : "bg-line"}`}>
        <span className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-card shadow-soft transition-transform ${value ? "translate-x-[18px]" : ""}`} />
      </button>
    );
  }
  return (
    <select value={String(value)} onChange={(e) => onChange(e.target.value)} aria-label={c.label}
      className="bg-card border border-line rounded-lg px-2.5 py-2 text-[12.5px] font-medium text-cocoa outline-none focus:border-accent w-full">
      {c.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export default function ToolDetail({ toolId }: { toolId: string }) {
  const tool = toolById(toolId);
  const [values, setValues] = useState<ControlValues>(() => (tool ? defaultValues(tool) : {}));
  const [surface, setSurface] = useState<"light" | "dark">("light");
  const [promptTab, setPromptTab] = useState<keyof typeof PROMPT_LABELS>("cursor");
  const [mounted, setMounted] = useState(false);
  const { favs, toggle } = useFavs();
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      setRecent(JSON.parse(localStorage.getItem("agenthub.tools.recent") ?? "[]"));
    } catch { /* first visit */ }
  }, []);

  const filled = useMemo(() => (tool ? fillTool(tool, values) : null), [tool, values]);
  if (!tool || !filled) {
    return (
      <div className="max-w-[760px] mx-auto px-5 py-24 text-center">
        <h1 className="font-display font-extrabold text-[28px]">That artifact moved.</h1>
        <p className="text-cocoa mt-2">Browse the shelves instead - <Link to="/tools" className="text-rust font-semibold hover:underline">all Artifacts ›</Link></p>
      </div>
    );
  }

  const cat = findCategory(tool.category)!;
  const sub = findSubcategory(tool.category, tool.subcategory)!;
  const related = relatedTools(tool);
  const reset = () => setValues(defaultValues(tool));
  const setValue = (id: string, v: string | number | boolean) => setValues((prev) => ({ ...prev, [id]: v }));

  const rememberPrompt = (text: string) => {
    const next = [text, ...recent.filter((r) => r !== text)].slice(0, 8);
    setRecent(next);
    try { localStorage.setItem("agenthub.tools.recent", JSON.stringify(next)); } catch { /* private mode */ }
  };

  const codeTabs: Record<string, string> = {};
  if (filled.css) codeTabs["CSS"] = filled.css;
  for (const [k, v] of Object.entries(filled.snippets)) codeTabs[k] = v;
  const isVisual = Boolean(tool.cssTemplate && tool.demoHtml);

  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-8 pt-10 pb-24">
      <Bread items={[
        { label: "Home", to: "/" }, { label: "Artifacts", to: "/tools" },
        { label: cat.label, to: `/tools/${cat.id}` }, { label: sub.label, to: `/tools/${cat.id}/${sub.id}` },
        { label: tool.name },
      ]} />

      {/* 1 · header */}
      <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Eyebrow>{cat.label} · {sub.label}</Eyebrow>
          <h1 className="font-display font-extrabold tracking-[-.02em] text-[clamp(28px,4vw,44px)] leading-[1.06] mt-2">{tool.name}</h1>
          {tool.aliases.length > 0 && (
            <p className="text-[13.5px] text-dim mt-2">Also called {tool.aliases.map((a, i) => <span key={a}>"{a}"{i < tool.aliases.length - 1 ? ", " : ""}</span>)}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className={`font-mono text-[11px] uppercase tracking-[.08em] border rounded-full px-2.5 py-1 ${DIFF_TONE[tool.difficulty]}`}>{tool.difficulty}</span>
            {tool.tags.map((t) => (
              <span key={t} className="font-mono text-[10.5px] uppercase tracking-[.06em] text-dim border border-liness rounded-full px-2 py-[4px]">{t}</span>
            ))}
          </div>
        </div>
        {mounted && <FavBtn tool={tool} isFav={favs.includes(tool.id)} onToggle={() => toggle(tool.id)} />}
      </header>

      {/* 2 · what it is */}
      <section className="mt-8 max-w-[720px]">
        <h2 className="text-[12px] font-mono uppercase tracking-[.12em] text-dim">What it is</h2>
        <p className="text-[16px] leading-[1.7] text-ink mt-3">{tool.description}</p>
      </section>

      {/* 3 · where / where not */}
      <section className="mt-8 grid md:grid-cols-2 gap-4 max-w-[900px]">
        <div className="bg-cream border border-liness rounded-[16px] p-5">
          <h3 className="text-[13px] font-bold text-leaf uppercase font-mono tracking-[.08em]">Use it when</h3>
          <ul className="mt-3 space-y-2">{tool.whenToUse.map((w) => (
            <li key={w} className="text-[13.5px] leading-[1.55] text-cocoa flex gap-2.5"><span className="text-leaf mt-[2px] shrink-0"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m5 13 4 4L19 7" /></svg></span>{w}</li>
          ))}</ul>
        </div>
        <div className="bg-cream border border-liness rounded-[16px] p-5">
          <h3 className="text-[13px] font-bold text-brick uppercase font-mono tracking-[.08em]">Skip it when</h3>
          <ul className="mt-3 space-y-2">{tool.whenNotToUse.map((w) => (
            <li key={w} className="text-[13.5px] leading-[1.55] text-cocoa flex gap-2.5"><span className="text-brick mt-[2px] shrink-0"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg></span>{w}</li>
          ))}</ul>
        </div>
      </section>

      {/* 4 · live demo + 5 · controls */}
      {isVisual ? (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <h2 className="text-[12px] font-mono uppercase tracking-[.12em] text-dim">Live demo - drag the controls, everything below updates</h2>
            <div className="flex items-center gap-1.5" role="group" aria-label="Demo surface">
              <span className="font-mono text-[10.5px] text-dim mr-1">Backdrop:</span>
              {(["light", "dark"] as const).map((s) => (
                <button key={s} onClick={() => setSurface(s)} aria-pressed={surface === s}
                  className={`text-[11.5px] font-semibold rounded-full px-2.5 py-1 border transition-colors ${surface === s ? "bg-coffee text-foam border-coffee" : "bg-card text-cocoa border-line hover:border-accent"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
            <div className={`rounded-[20px] p-3 border ${surface === "dark" ? "bg-coffee border-roast" : "bg-sand border-line"}`}>
              <DemoFrame css={filled.css} html={filled.demoHtml} />
            </div>
            <aside className="bg-card border border-line rounded-[20px] p-5 lg:sticky lg:top-[92px] shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold">Controls</h3>
                <button onClick={reset} className="text-[11.5px] font-semibold text-cocoa hover:text-rust transition-colors">Reset to defaults</button>
              </div>
              <div className="mt-4 space-y-4">
                {tool.controls.map((c) => (
                  <label key={c.id} className="block">
                    <span className="flex items-center justify-between text-[12.5px] font-semibold text-ink mb-1.5">
                      {c.label}
                      {c.type === "slider" && <span className="font-mono text-[10.5px] text-dim">{String(values[c.id] ?? c.def)}{c.unit ?? ""}</span>}
                    </span>
                    <ControlInput c={c} value={values[c.id] ?? c.def} onChange={(v) => setValue(c.id, v)} />
                  </label>
                ))}
              </div>
              {filled.missing.length > 0 && (
                <p className="mt-4 text-[11.5px] font-mono text-brick">Template tokens not filled: {filled.missing.join(", ")}</p>
              )}
            </aside>
          </div>
        </section>
      ) : tool.controls.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h2 className="text-[12px] font-mono uppercase tracking-[.12em] text-dim">Settings - your choices fill the code and prompts below</h2>
            <button onClick={reset} className="text-[11.5px] font-semibold text-cocoa hover:text-rust">Reset to defaults</button>
          </div>
          <div className="bg-card border border-line rounded-[20px] p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 shadow-soft">
            {tool.controls.map((c) => (
              <label key={c.id} className="block">
                <span className="block text-[12.5px] font-semibold text-ink mb-1.5">{c.label}</span>
                <ControlInput c={c} value={values[c.id] ?? c.def} onChange={(v) => setValue(c.id, v)} />
              </label>
            ))}
          </div>
        </section>
      )}

      {/* 5 · generated code */}
      {Object.keys(codeTabs).length > 0 && (
        <section className="mt-10 max-w-[880px]">
          <h2 className="text-[12px] font-mono uppercase tracking-[.12em] text-dim mb-4">Generated code <span className="text-cocoa normal-case tracking-normal font-sans text-[12px]">- live, from your controls</span></h2>
          <CodeBlock code={Object.values(codeTabs)[0]} tabs={codeTabs} />
        </section>
      )}

      {/* 6 · AI prompts */}
      <section className="mt-10">
        <h2 className="text-[12px] font-mono uppercase tracking-[.12em] text-dim mb-1.5">Ask an AI to build it</h2>
        <p className="text-[13px] text-cocoa mb-4 max-w-[640px]">Pick the tool you use. The prompt already contains your exact values - copy, paste, done.</p>
        <div className="flex gap-1.5 flex-wrap mb-0" role="tablist" aria-label="Prompt format">
          {(Object.keys(PROMPT_LABELS) as (keyof typeof PROMPT_LABELS)[]).map((k) => (
            <button key={k} role="tab" aria-selected={promptTab === k} onClick={() => setPromptTab(k)}
              className={`px-3.5 py-2 rounded-t-[12px] text-[12.5px] font-semibold transition-colors border border-b-0 ${promptTab === k ? "bg-coffee text-foam border-coffee" : "bg-card text-cocoa border-line hover:text-rust"}`}>
              {PROMPT_LABELS[k]}
            </button>
          ))}
        </div>
        <div className="bg-coffee rounded-b-[14px] rounded-tr-[14px] border border-coffee p-5" role="tabpanel">
          <pre className="font-mono text-[12.5px] leading-[1.75] text-foam whitespace-pre-wrap">{filled.prompts[promptTab]}</pre>
          <div className="flex items-center gap-2 mt-4">
            <CopyBtn text={filled.prompts[promptTab]} label={`Copy ${PROMPT_LABELS[promptTab]} prompt`} extra="!border-roast !text-steam hover:!border-ember hover:!text-foam" />
            <button onClick={() => rememberPrompt(filled.prompts[promptTab])} className="font-mono text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-roast text-steam hover:border-ember hover:text-foam transition-colors">
              Keep in recent prompts
            </button>
          </div>
        </div>
        {recent.length > 0 && (
          <div className="mt-5">
            <h3 className="text-[11px] font-mono uppercase tracking-[.1em] text-dim mb-2.5">Recent prompts on this device ({recent.length})</h3>
            <div className="space-y-2">
              {recent.slice(0, 4).map((r, i) => (
                <div key={i} className="flex items-start gap-3 bg-cream border border-liness rounded-[12px] px-3.5 py-2.5">
                  <p className="font-mono text-[11.5px] text-cocoa leading-[1.6] line-clamp-2 flex-1">{r}</p>
                  <CopyBtn text={r} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 7 · mistakes + tips */}
      <section className="mt-12 grid md:grid-cols-2 gap-5">
        <div>
          <h2 className="font-display font-bold text-[18px] mb-3.5">Common mistakes</h2>
          <ul className="space-y-3">
            {tool.mistakes.map((m, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-[1.6] text-cocoa">
                <span className="font-mono text-[11px] text-brick mt-[3px] shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p>{m}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display font-bold text-[18px] mb-3.5">Tips that actually help</h2>
          <ul className="space-y-3">
            {tool.tips.map((t, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-[1.6] text-cocoa">
                <span className="text-accent mt-[2px] shrink-0"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M6.3 6.3l2.1 2.1m7.2 7.2 2.1 2.1" /><circle cx="12" cy="12" r="3.5" /></svg></span>
                <p>{t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 · related + learn more */}
      {(related.length > 0 || tool.learnMore.length > 0) && (
        <section className="mt-12">
          {related.length > 0 && (
            <>
              <h2 className="font-display font-bold text-[18px] mb-4">Pairs well with</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((r) => <ToolCard key={r.id} tool={r} />)}
              </div>
            </>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <span className="text-[12px] font-mono uppercase tracking-[.1em] text-dim">Learn more</span>
            {tool.learnMore.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={btn("outline", "sm")}>
                {l.label} <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="ml-1.5 inline"><path d="M7 17 17 7M9 7h8v8" /></svg>
              </a>
            ))}
          </div>
          {tool.source && (
            <p className="mt-5 text-[11.5px] text-dim font-mono">
              Based on material by {tool.source.author} · {tool.source.licence} · <a href={tool.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-cocoa">source</a>
            </p>
          )}
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-3 items-center">
        <Link to={`/tools/${cat.id}/${sub.id}`} className={btn("outline", "sm")}>‹ All {sub.label.toLowerCase()}</Link>
        <Link to="/tools/builder" className={btn("dark", "sm")}>Combine it in the prompt builder ›</Link>
      </div>
    </div>
  );
}

const PROMPT_LABELS = {
  cursor: "Cursor",
  claude: "Claude",
  chatgpt: "ChatGPT / Codex",
  lovable: "Lovable / v0",
  generic: "Generic",
} as const;
