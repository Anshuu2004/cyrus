"use client";
/* ══ shared bits for the Artifacts (/tools) pages ═══════════════════ */
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { useStored } from "@/lib/util";
import type { Tool } from "@/lib/tools/types";
import { fillTool } from "@/lib/tools/fill";
import { toolPath } from "@/lib/tools/data";

export const CatIcon = ({ d, className = "" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

export function Bread({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap font-mono text-[11px] tracking-[.08em] uppercase text-dim">
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="text-line">/</span>}
          {it.to ? (
            <Link to={it.to} className="hover:text-accent transition-colors">{it.label}</Link>
          ) : (
            <span className="text-cocoa">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* clipboard with visible confirmation */
export function CopyBtn({ text, label = "Copy", extra = "" }: { text: string; label?: string; extra?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <button onClick={copy} className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${done ? "border-leaf text-leaf bg-leaf/5" : "border-line text-cocoa hover:border-accent hover:text-rust"} ${extra}`} aria-live="polite">
      {done ? (
        <><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m5 13 4 4L19 7" /></svg>Copied</>
      ) : (
        <><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>{label}</>
      )}
    </button>
  );
}

export function CodeBlock({ code, tabs, active }: { code: string; tabs?: Record<string, string>; active?: string }) {
  const [key, setKey] = useState(active ?? Object.keys(tabs ?? {})[0] ?? "");
  const body = tabs && key ? tabs[key] : code;
  return (
    <div className="rounded-[14px] border border-line bg-coffee overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-roast/60">
        {(tabs ? Object.keys(tabs) : ["CSS"]).map((t) => (
          <button key={t} onClick={() => setKey(t)} className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${t === key ? "bg-roast text-foam" : "text-steam hover:text-foam"}`}>
            {t}
          </button>
        ))}
        <span className="ml-auto pr-1"><CopyBtn text={body} extra="!border-roast !text-steam hover:!border-ember hover:!text-foam" /></span>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-[12px] leading-[1.7] text-foam whitespace-pre">{body}</pre>
    </div>
  );
}

/* the live demo surface: filled CSS + filled markup inside .demo-root */
export function DemoFrame({ css, html, compact = false }: { css: string; html: string; compact?: boolean }) {
  return (
    <div className={`rounded-[16px] border border-line overflow-hidden ${compact ? "h-[128px]" : "min-h-[340px]"}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className={`demo-root relative w-full h-full flex items-center justify-center p-6 ${compact ? "scale-[.72] p-3" : ""}`} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/* small preview shown on subcategory cards (visual tools only) */
export function MiniPreview({ tool }: { tool: Tool }) {
  const filled = useMemo(() => fillTool(tool, {}), [tool]);
  if (!tool.cssTemplate || !tool.demoHtml) return <CardTile tool={tool} />;
  return (
    <div className="h-[128px] overflow-hidden rounded-[14px] border border-line pointer-events-none">
      <DemoFrame css={filled.css} html={filled.demoHtml} compact />
    </div>
  );
}

const TONES = ["from-peach to-sand", "from-clay to-sand", "from-[#e8e0f4] to-sand", "from-[#dcebe2] to-sand", "from-[#f3e3da] to-clay"];
export function CardTile({ tool }: { tool: Tool }) {
  const tone = TONES[Math.abs(tool.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % TONES.length];
  return (
    <div className={`h-[128px] rounded-[14px] border border-line bg-gradient-to-br ${tone} grid place-items-center`}>
      <span className="font-mono text-[11px] tracking-[.14em] uppercase text-cocoa/70 px-4 text-center">{tool.tags.slice(0, 3).join(" · ") || tool.name}</span>
    </div>
  );
}

/* favourites (localStorage) - hidden until mount to avoid hydration flips */
export function useFavs() {
  const [favs, setFavs] = useStored<string[]>("agenthub.tools.favs", []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const toggle = (id: string) => setFavs(favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]);
  return { favs, toggle, mounted };
}

export function FavBtn({ tool, onToggle, isFav, compact = false }: { tool: Tool; onToggle: () => void; isFav: boolean; compact?: boolean }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
      aria-label={isFav ? `Remove ${tool.name} from favourites` : `Save ${tool.name} to favourites`}
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono text-[11px] font-semibold transition-colors ${compact ? "px-2 py-1" : "px-3 py-1.5"} ${isFav ? "border-honey text-honey bg-honey/10" : "border-line text-cocoa hover:border-accent hover:text-rust"}`}
    >
      <svg viewBox="0 0 24 24" width="13" height="13" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.9z" /></svg>
      {isFav ? "Saved" : "Save"}
    </button>
  );
}

export const toolHref = toolPath;

export function ToolCard({ tool, fav }: { tool: Tool; fav?: { toggle: (id: string) => void; isFav: boolean; mounted: boolean } }) {
  return (
    <Link
      to={toolPath(tool)}
      className="group block min-w-0 overflow-hidden bg-card border border-line rounded-[18px] p-3.5 shadow-soft hover:shadow-lift hover:border-ember transition-all"
    >
      <MiniPreview tool={tool} />
      <div className="mt-3 flex items-start justify-between gap-2 px-1">
        <div className="min-w-0">
          <b className="block text-[15px] leading-snug group-hover:text-rust transition-colors">{tool.name}</b>
          <span className="block text-[12.5px] text-cocoa leading-[1.45] mt-1 line-clamp-2">{tool.summary}</span>
          <span className="flex gap-1.5 mt-2.5 flex-wrap">
            {tool.tags.slice(0, 3).map((t) => (
              <span key={t} className="font-mono text-[10px] tracking-[.06em] uppercase text-dim border border-liness rounded-full px-2 py-[3px]">{t}</span>
            ))}
          </span>
        </div>
        {fav?.mounted && (
          <FavBtn compact tool={tool} isFav={fav.isFav} onToggle={() => fav.toggle(tool.id)} />
        )}
      </div>
    </Link>
  );
}
