"use client"
/* ══ Apis.tsx — the free API directory ════════════════════════════
   Every endpoint from the community public-apis catalog you can call
   today without paying: filter by category, auth and CORS, search
   across names and descriptions, open the docs in one click.     ══ */
import { useMemo, useState } from "react";
import { FREE_APIS, API_CATEGORIES } from "../data/freeApis";
import type { FreeApi } from "../data/freeApis";
import { fmt } from "../lib/util";
import { btn, Chip, Eyebrow, Word } from "../components/ui";

const W = "max-w-[1240px] mx-auto px-6";

const AUTH_META: Record<FreeApi["auth"], [string, string]> = {
  no: ["No key", "text-leaf border-leaf/35 bg-leaf/8"],
  oauth: ["OAuth", "text-honey border-honey/35 bg-honey/8"],
  apiKey: ["Free key", "text-denim border-denim/30 bg-denim/8"],
};

/* categories ordered by how many APIs they hold - biggest shelf first */
const CATS = API_CATEGORIES.slice().sort(
  (a, b) => FREE_APIS.filter((x) => x.cat === b).length - FREE_APIS.filter((x) => x.cat === a).length,
);

function ApiCard({ a }: { a: FreeApi }) {
  const [al, ac] = AUTH_META[a.auth];
  const host = (() => { try { return new URL(a.link).hostname.replace(/^www\./, ""); } catch { return a.link; } })();
  return (
    <article className="group flex flex-col gap-2.5 bg-card border border-line rounded-[18px] p-[18px] shadow-soft hover:-translate-y-1 hover:border-ember hover:shadow-lift transition-all">
      <div className="flex items-start gap-2.5 min-w-0">
        <span className="w-[34px] h-[34px] rounded-[10px] bg-cream border border-line grid place-items-center shrink-0 font-mono text-[12.5px] font-bold text-rust">
          {a.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <b className="block card-title text-[14.5px] truncate group-hover:text-rust transition-colors">{a.name}</b>
          <span className="font-mono text-[10.5px] text-dim truncate block">{host}</span>
        </div>
      </div>
      <p className="card-desc text-[13px] line-clamp-2">{a.desc}</p>
      <div className="flex items-center gap-1.5 flex-wrap mt-auto pt-1">
        <span className={`font-mono text-[9.5px] font-bold border rounded-full px-2 py-[3px] ${ac}`}>{al}</span>
        {a.cors && <Chip tone="green">CORS</Chip>}
        <Chip>{a.cat}</Chip>
        <a href={a.link} target="_blank" rel="noopener"
          className="ml-auto font-mono text-[10px] font-bold uppercase tracking-[.08em] text-accent hover:text-rust transition-colors shrink-0">
          Open docs
        </a>
      </div>
    </article>
  );
}

export default function Apis() {
  const [cat, setCat] = useState("All");
  const [auth, setAuth] = useState<"All" | FreeApi["auth"]>("All");
  const [corsOnly, setCorsOnly] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(60);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return FREE_APIS.filter((a) =>
      (cat === "All" || a.cat === cat) &&
      (auth === "All" || a.auth === auth) &&
      (!corsOnly || a.cors) &&
      (!t || (a.name + " " + a.desc + " " + a.cat).toLowerCase().includes(t)));
  }, [cat, auth, corsOnly, q]);

  const noKey = useMemo(() => FREE_APIS.filter((a) => a.auth === "no").length, []);
  const corsN = useMemo(() => FREE_APIS.filter((a) => a.cors).length, []);
  const authN = useMemo(() => {
    const c: Record<FreeApi["auth"], number> = { no: 0, oauth: 0, apiKey: 0 };
    for (const a of FREE_APIS) c[a.auth]++;
    return c;
  }, []);
  const catN = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of FREE_APIS) m.set(a.cat, (m.get(a.cat) ?? 0) + 1);
    return m;
  }, []);
  const pill = (on: boolean) => `font-mono text-[11px] font-bold tracking-[.05em] uppercase rounded-full px-3 py-[7px] border transition-all cursor-pointer inline-flex items-center gap-1.5 ${on ? "bg-coffee border-coffee text-foam shadow-soft" : "bg-card border-line text-cocoa hover:border-accent hover:text-rust"}`;
  const catPill = (on: boolean) => `font-mono text-[11px] font-semibold rounded-full px-3 py-[6px] border transition-all cursor-pointer inline-flex items-center gap-1.5 ${on ? "bg-accent border-accent text-foam shadow-soft" : "bg-cream border-line text-cocoa hover:border-accent hover:text-rust"}`;
  const num = "tabular-nums opacity-65 text-[10px]";
  const anyFilter = cat !== "All" || auth !== "All" || corsOnly || q.trim() !== "";

  const visible = list.slice(0, shown);

  return (
    <div className="pb-4">
      {/* ── dark hero band ── */}
      <section className="relative overflow-hidden bg-coffee text-foam">
        <span aria-hidden className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(244,238,227,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,238,227,.05)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(900px_460px_at_50%_28%,#000_45%,transparent)]" />
        <span aria-hidden className="absolute inset-0 pointer-events-none bg-[radial-gradient(640px_300px_at_50%_-12%,rgba(47,125,114,.20),transparent_70%),radial-gradient(520px_280px_at_94%_108%,rgba(217,133,70,.16),transparent_70%)]" />
        <div className={`${W} relative pt-[76px] pb-[96px] text-center`}>
          <Eyebrow>API directory</Eyebrow>
          <h1 className="font-display font-extrabold tracking-[-.025em] leading-[1.08] text-white text-[clamp(32px,4.6vw,56px)] mt-5 max-w-[780px] mx-auto">
            {fmt(FREE_APIS.length)} <Word>free APIs</Word>, ready to call
          </h1>
          <p className="text-steam mt-5 mx-auto max-w-[580px] text-[15.5px] leading-[1.7]">
            Weather, finance, images, text, science. Free APIs you can call from the browser right now.
          </p>
          <div className="flex gap-2.5 justify-center flex-wrap mt-7">
            <button onClick={() => { setAuth("no"); setCat("All"); }} className={btn("primary", "md")}>Start with no-key APIs</button>
            <button onClick={() => { setCorsOnly(true); }} className={btn("dark", "md")}>Browser-callable</button>
          </div>
        </div>
      </section>

      {/* ── overlapping filter bar ── */}
      <div className={`${W} relative z-[2] -mt-11`}>
        <div className="bg-card border border-line rounded-[22px] shadow-lift px-4 py-4 grid gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="relative flex-1 min-w-[220px] flex items-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden className="absolute left-4 text-dim pointer-events-none">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" />
              </svg>
              <input value={q} onChange={(e) => { setQ(e.target.value); setShown(60); }} placeholder="Search APIs by name or what they do…"
                aria-label="Search APIs"
                className="w-full bg-sand border border-line rounded-full pl-10 pr-4 py-2.5 text-[14px] outline-none focus:border-accent placeholder:text-dim" />
            </span>
            {anyFilter && (
              <button onClick={() => { setQ(""); setCat("All"); setAuth("All"); setCorsOnly(false); setShown(60); }}
                className="font-mono text-[10.5px] font-bold uppercase tracking-[.08em] text-dim hover:text-rust transition-colors cursor-pointer px-2 py-2">
                Clear all
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-dim mr-1 w-[74px] shrink-0 max-[520px]:w-full">Access</span>
            <button className={pill(auth === "no")} onClick={() => setAuth(auth === "no" ? "All" : "no")}>No key <span className={num}>{fmt(noKey)}</span></button>
            <button className={pill(auth === "apiKey")} onClick={() => setAuth(auth === "apiKey" ? "All" : "apiKey")}>Free key <span className={num}>{fmt(authN.apiKey)}</span></button>
            <button className={pill(auth === "oauth")} onClick={() => setAuth(auth === "oauth" ? "All" : "oauth")}>OAuth <span className={num}>{fmt(authN.oauth)}</span></button>
            <button className={pill(corsOnly)} onClick={() => setCorsOnly(!corsOnly)}>Works in browser <span className={num}>{fmt(corsN)}</span></button>
          </div>
        </div>
      </div>

      {/* ── category rail ── */}
      <div className={`${W} pt-7`}>
        <div className={`flex gap-1.5 flex-wrap ${catOpen ? "" : "max-h-[76px] overflow-hidden"} transition-[max-height]`}>
          <button className={catPill(cat === "All")} onClick={() => { setCat("All"); setShown(60); }}>All <span className={num}>{fmt(FREE_APIS.length)}</span></button>
          {CATS.map((c) => (
            <button key={c} className={catPill(cat === c)} onClick={() => { setCat(cat === c ? "All" : c); setShown(60); }}>{c} <span className={num}>{catN.get(c) ?? 0}</span></button>
          ))}
        </div>
        <button onClick={() => setCatOpen((v) => !v)} className="mt-2.5 font-mono text-[10.5px] font-bold uppercase tracking-[.08em] text-accent hover:text-rust transition-colors cursor-pointer">
          {catOpen ? "Show fewer categories" : `Show all ${CATS.length} categories`}
        </button>

        <div className="flex items-baseline gap-3 flex-wrap mt-6 mb-4">
          <h2 className="font-display font-extrabold tracking-[-.02em] text-[22px]">
            {cat === "All" ? "Every endpoint" : cat}
          </h2>
          <span className="font-mono text-[11px] text-dim ml-auto">
            {fmt(list.length)} match{list.length === 1 ? "" : "es"} · {fmt(FREE_APIS.length)} in the catalog
          </span>
        </div>

        {visible.length ? (
          <section className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
            {visible.map((a) => <ApiCard key={a.name + a.link} a={a} />)}
          </section>
        ) : (
          <div className="text-center py-16 border border-dashed border-line rounded-[22px] bg-cream/60 text-dim leading-relaxed">
            No API matches that combination - loosen one filter, or
            <button onClick={() => { setQ(""); setCat("All"); setAuth("All"); setCorsOnly(false); }} className="text-accent font-semibold hover:underline cursor-pointer ml-1">reset them all</button>.
          </div>
        )}

        {list.length > shown && (
          <div className="text-center mt-8">
            <button onClick={() => setShown(shown + 120)} className={btn("outline", "md")}>
              Show {Math.min(120, list.length - shown)} more of {fmt(list.length - shown)} left
            </button>
          </div>
        )}

        <p className="font-mono text-[10px] text-dim mt-8 leading-[1.7] max-w-[720px]">
          Data comes from the community-maintained public-apis catalog on GitHub and is refreshed from
          there; auth labels mean: No key = call it right now, Free key = signup needed, OAuth = app
          registration needed. Always read the provider's terms before shipping.
        </p>
      </div>
    </div>
  );
}
