"use client";
/* ══ shared bits for the Artifacts (/tools) pages ═══════════════════ */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@/lib/router";
import { useStored } from "@/lib/util";
import type { Tool } from "@/lib/tools/types";
import { findCategory } from "@/lib/tools/types";
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

/* small preview shown on subcategory cards (visual tools only).
   The demo is laid out on a fixed 680px stage and scaled into the tile,
   so tall demos never clip their own headline. */
export function MiniPreview({ tool }: { tool: Tool }) {
  const filled = useMemo(() => fillTool(tool, {}), [tool]);
  if (!tool.cssTemplate || !tool.demoHtml) return <CardTile tool={tool} />;
  return (
    <div className="h-[128px] overflow-hidden rounded-[14px] border border-line pointer-events-none bg-sand">
      <style dangerouslySetInnerHTML={{ __html: filled.css }} />
      <div
        className="demo-root w-[680px] h-[278px] origin-top-left scale-[.46] flex items-start justify-center overflow-hidden pt-6 px-8"
        dangerouslySetInnerHTML={{ __html: filled.demoHtml }}
      />
    </div>
  );
}

const TONES = ["from-peach to-sand", "from-clay to-sand", "from-[#e8e0f4] to-sand", "from-[#dcebe2] to-sand", "from-[#f3e3da] to-clay"];

/* Cover for artifacts that are written guides rather than CSS demos:
   a tinted plate with the category mark, the name set in the display
   face, and what you actually get inside. Deterministic per id. */
export function CardTile({ tool }: { tool: Tool }) {
  const h = Math.abs(tool.id.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
  const tone = TONES[h % TONES.length];
  const cat = findCategory(tool.category);
  const hasDemo = Boolean(tool.cssTemplate && tool.demoHtml);
  return (
    <div className={`relative h-[128px] overflow-hidden rounded-[14px] border border-line bg-gradient-to-br ${tone}`}>
      <span aria-hidden className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(90,60,38,.14) 1px, transparent 1px)", backgroundSize: "13px 13px" }} />
      <span aria-hidden className="absolute -right-6 -top-8 w-24 h-24 rounded-full border border-cocoa/10" />
      <span aria-hidden className="absolute -right-2 -top-4 w-16 h-16 rounded-full border border-cocoa/10" />
      <div className="relative h-full flex flex-col justify-between p-3.5">
        <span className="w-8 h-8 rounded-[10px] bg-card/85 border border-line grid place-items-center text-rust">
          <CatIcon d={cat?.icon ?? ""} className="w-4 h-4" />
        </span>
        <div>
          <b className="font-display block text-[15.5px] font-bold leading-[1.15] text-cocoa line-clamp-2">{tool.name}</b>
          <span className="mt-1.5 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[.12em] text-cocoa/70">
            {hasDemo ? "live demo" : "plain-english guide"}
            <span aria-hidden className="w-[3px] h-[3px] rounded-full bg-cocoa/40" />
            {tool.difficulty}
          </span>
        </div>
      </div>
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

/* ══ finder: the filter + sort + show-more logic shared by the
   subcategory shelves and /tools/browse. One hook, one control bar. ══ */
export type SortKey = "curated" | "az" | "level";
const LEVEL = { beginner: 0, intermediate: 1, advanced: 2 } as const;

export function useFinder(all: Tool[]) {
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState("all");
  const [tag, setTag] = useState("all");
  const [kind, setKind] = useState("all");
  const [sort, setSort] = useState<SortKey>("curated");
  const [limit, setLimit] = useState(24);

  const tags = useMemo(() => [...new Set(all.flatMap((t) => t.tags))].sort(), [all]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const words = needle.split(/\s+/).filter(Boolean);
    const out = all.filter((t) =>
      (diff === "all" || t.difficulty === diff) &&
      (tag === "all" || t.tags.includes(tag)) &&
      (kind === "all" || (kind === "demo" ? Boolean(t.cssTemplate && t.demoHtml) : !t.cssTemplate)) &&
      (words.length === 0 || words.every((w) =>
        t.name.toLowerCase().includes(w) || t.summary.toLowerCase().includes(w) || t.description.toLowerCase().includes(w) ||
        t.aliases.some((a) => a.toLowerCase().includes(w)) || t.tags.some((g) => g.includes(w)))),
    );
    if (sort === "az") out.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "level") out.sort((a, b) => LEVEL[a.difficulty] - LEVEL[b.difficulty] || a.name.localeCompare(b.name));
    return out;
  }, [all, q, diff, tag, kind, sort]);

  useEffect(() => setLimit(24), [q, diff, tag, kind, sort]);

  const dirty = q !== "" || diff !== "all" || tag !== "all" || kind !== "all";
  const reset = () => { setQ(""); setDiff("all"); setTag("all"); setKind("all"); setSort("curated"); };

  return { q, setQ, diff, setDiff, tag, setTag, kind, setKind, sort, setSort, tags, shown, limit, more: () => setLimit((n) => n + 24), dirty, reset };
}

export type Finder = ReturnType<typeof useFinder>;

const PILL = "text-[12.5px] font-semibold rounded-full px-3.5 py-[7px] border transition-colors";
const pillOn = "bg-coffee text-foam border-coffee";
const pillOff = "bg-card text-cocoa border-line hover:border-accent";

export function FilterBar({ f, searchLabel, children }: { f: Finder; searchLabel: string; children?: ReactNode }) {
  const active = (n: string) => (n === "all" ? "Any level" : n);
  return (
    <div className="rounded-[18px] border border-line bg-cream/70 p-3 md:p-3.5">
      {children}
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="flex items-center gap-2 bg-card border border-line rounded-full px-4 py-2 w-full sm:w-[250px] focus-within:border-accent transition-colors">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-dim shrink-0" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            value={f.q} onChange={(e) => f.setQ(e.target.value)} aria-label={searchLabel} placeholder="Filter by name, tag or plain words…"
            className="flex-1 min-w-0 border-0 outline-none bg-transparent text-[13.5px] placeholder:text-dim" autoComplete="off"
          />
        </label>
        <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Difficulty">
          {["all", "beginner", "intermediate", "advanced"].map((d) => (
            <button key={d} onClick={() => f.setDiff(d)} aria-pressed={f.diff === d} className={`${PILL} ${f.diff === d ? pillOn : pillOff}`}>{active(d)}</button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap" role="group" aria-label="What is inside">
          {[["all", "Anything"], ["demo", "Live demo"], ["guide", "Written guide"]].map(([v, l]) => (
            <button key={v} onClick={() => f.setKind(v)} aria-pressed={f.kind === v} className={`${PILL} ${f.kind === v ? pillOn : pillOff}`}>{l}</button>
          ))}
        </div>
        {f.tags.length > 1 && (
          <select value={f.tag} onChange={(e) => f.setTag(e.target.value)} aria-label="Tag filter"
            className="bg-card border border-line rounded-full px-3.5 py-[8px] text-[12.5px] font-semibold text-cocoa outline-none focus:border-accent max-w-[46vw] sm:max-w-[170px]">
            <option value="all">All tags</option>
            {f.tags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
        <select value={f.sort} onChange={(e) => f.setSort(e.target.value as SortKey)} aria-label="Sort artifacts"
          className="bg-card border border-line rounded-full px-3.5 py-[8px] text-[12.5px] font-semibold text-cocoa outline-none focus:border-accent max-w-[46vw]">
          <option value="curated">Curated order</option>
          <option value="level">Easiest first</option>
          <option value="az">A to Z</option>
        </select>
        <span className="ml-auto flex items-center gap-2.5 max-sm:w-full max-sm:justify-between">
          <span aria-live="polite" className="font-mono text-[11px] text-dim">{f.shown.length} match{f.shown.length === 1 ? "" : "es"}</span>
          {f.dirty && (
            <button onClick={f.reset} className="font-mono text-[11px] font-semibold text-rust hover:underline">Clear</button>
          )}
        </span>
      </div>
    </div>
  );
}

/* show-more: the shelves hold hundreds of cards, nobody scrolls that */
const btnShell = "inline-flex items-center justify-center";

export function ShowMore({ f }: { f: Finder }) {
  const left = f.shown.length - f.limit;
  if (left <= 0) return null;
  return (
    <div className="mt-8 flex flex-col items-center gap-2.5">
      <button onClick={f.more} className={`${btnShell} gap-2 px-6 py-3 rounded-full border-2 border-coffee text-[14px] font-semibold hover:bg-coffee hover:text-foam transition-colors`}>
        Show {Math.min(24, left)} more
      </button>
      <span className="font-mono text-[11px] text-dim">Showing {Math.min(f.limit, f.shown.length)} of {f.shown.length}</span>
    </div>
  );
}

export function ToolGrid({ f, fav }: { f: Finder; fav?: { toggle: (id: string) => void; isFav: (id: string) => boolean; mounted: boolean } }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {f.shown.slice(0, f.limit).map((t) => (
        <ToolCard key={t.id} tool={t} fav={fav?.mounted ? { toggle: fav.toggle, isFav: fav.isFav(t.id), mounted: true } : undefined} />
      ))}
    </div>
  );
}
