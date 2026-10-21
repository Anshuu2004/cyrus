"use client"
/* ══ IssueFinder.tsx — search the crawl, not a guess ═══════════════
   Every row here is a GitHub issue API response from the snapshot named in
   the header. The finder filters over all of it - language, organization,
   label, beginner-labelled, nobody assigned - and keeps the two things a
   contributor actually needs visible on every card: when the thread was
   last touched, and whether somebody already has it.

   The query lives in the URL, so a search is a link you can send someone.
   ═══════════════════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "@/lib/router";
import { CRAWL } from "../data/crawlStats";
import { fmt } from "../lib/util";
import { useStore } from "../lib/store";
import { useIssueLedger, type IssueMeta } from "../lib/issueLedger";
import type { Sort } from "../lib/server/issueIndex";
import { btn, Word } from "../components/ui";

const W = "max-w-[1240px] mx-auto px-6";

/* Stars and facet counts read better rounded ("490.9k"); the issue totals
   are the claim the page is built on, so those stay exact. */
const num = (n: number) => n.toLocaleString("en-US");

type Found = {
  url: string; repo: string; number: number; title: string; labels: string[];
  lang: string | null; stars: number; updated: string; created: string;
  comments: number; assignees: number; beginner: boolean;
};
type Facet = { value: string; count: number };
type Body = {
  meta: { generated: string; issues: number; repos: number; orgs: number; languages: number };
  total: number; page: number; per: number; pages: number;
  facets: { langs: Facet[]; orgs: Facet[]; labels: Facet[] };
  issues: Found[];
};

const SORTS: [Sort, string][] = [
  ["relevance", "Best match"], ["updated", "Recently touched"], ["stars", "Biggest project"],
  ["comments", "Most discussed"], ["oldest", "Oldest first"],
];

/* how long since a thread moved, in days, from the snapshot date */
const daysSince = (iso: string, now = new Date(`${CRAWL.crawledAt}T12:00:00`)) =>
  Math.max(0, Math.floor((+now - +new Date(`${iso}T12:00:00`)) / 864e5));

const STALE_AFTER = 90;

function IssueCard({ i, onTrack, tracked }: { i: Found; onTrack: (i: Found) => void; tracked: boolean }) {
  const age = daysSince(i.updated);
  const stale = age > STALE_AFTER;
  return (
    <article className="group rounded-[14px] border border-line bg-card p-[18px] transition-all duration-200 hover:border-accent/70">
      <div className="flex items-center gap-2 flex-wrap min-w-0">
        <Link to={`/organizations/${i.repo.split("/")[0]}`} className="font-mono text-[10.5px] text-dim hover:text-accent truncate">{i.repo}</Link>
        <span className="font-mono text-[10.5px] text-dim">#{i.number}</span>
        {i.lang && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-cocoa">
            <i className="not-italic w-[7px] h-[7px] rounded-full bg-accent/70" />{i.lang}
          </span>
        )}
        <span className="ml-auto font-mono text-[10px] text-dim shrink-0">{fmt(i.stars)} ★</span>
      </div>

      <a href={i.url} target="_blank" rel="noopener"
        className="block font-semibold text-[15.5px] leading-[1.45] mt-2 text-ink hover:text-accent transition-colors">
        {i.title}
      </a>

      {i.labels.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          {i.labels.slice(0, 4).map((l) => (
            <em key={l} className={`not-italic font-mono text-[9.5px] px-1.5 py-[3px] rounded-[5px] border truncate max-w-[180px] ${
              /good first|help wanted|beginner|easy/i.test(l) ? "text-accent border-accent/35 bg-peach" : "text-cocoa border-line"}`}>
              {l}
            </em>
          ))}
          {i.labels.length > 4 && <span className="font-mono text-[9.5px] text-dim">+{i.labels.length - 4}</span>}
        </div>
      )}

      <div className="flex items-end justify-between gap-4 mt-3.5 pt-3 border-t border-dashed border-line">
        <p className="font-mono text-[10px] text-dim leading-[1.7]">
          touched {age === 0 ? "today" : `${age}d ago`}
          <span className="text-rule"> · </span>{i.comments} {i.comments === 1 ? "comment" : "comments"}
          {i.assignees > 0 && <><span className="text-rule"> · </span><b className="text-honey">{i.assignees} assigned</b></>}
          {stale && <><span className="text-rule"> · </span><b className="text-brick">quiet for {age} days</b></>}
        </p>
        <button onClick={() => onTrack(i)}
          className={`${btn(tracked ? "outline" : "primary", "sm")} shrink-0`}>
          {tracked ? "On your board" : "Track it"}
        </button>
      </div>
    </article>
  );
}

export default function IssueFinder() {
  const [params, setParams] = useSearchParams();
  const { toast } = useStore();
  const { ledger, toggle } = useIssueLedger();
  const [body, setBody] = useState<Body | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [more, setMore] = useState(false);

  const url = useMemo(() => params.toString(), [params]);
  const [term, setTerm] = useState(params.get("q") ?? "");
  const typing = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* the input is local so typing stays smooth; the URL catches up 300 ms
     after the last keystroke, which is also what makes a search shareable */
  const push = useCallback((next: Record<string, string>) => {
    const p = new URLSearchParams(url);
    for (const [k, v] of Object.entries(next)) { if (v) p.set(k, v); else p.delete(k); }
    setParams(p);
  }, [url, setParams]);

  useEffect(() => () => { if (typing.current) clearTimeout(typing.current); }, []);
  const onTerm = (v: string) => {
    setTerm(v);
    if (typing.current) clearTimeout(typing.current);
    typing.current = setTimeout(() => push({ q: v.trim(), page: "" }), 300);
  };

  useEffect(() => {
    let live = true;
    setStatus("loading");
    fetch(`/api/issues${url ? `?${url}` : ""}`, { headers: { accept: "application/json" } })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((data: Body) => { if (live) { setBody(data); setStatus("ready"); } })
      .catch(() => { if (live) setStatus("error"); });
    return () => { live = false; };
  }, [url]);

  /* keep the text box honest when the URL changes from a link or the back button */
  useEffect(() => { setTerm(params.get("q") ?? ""); }, [params]);

  const langs = new Set((params.get("lang") ?? "").split(",").filter(Boolean));
  const org = params.get("org") ?? "";
  const label = params.get("label") ?? "";
  const beginner = params.get("beginner") === "1";
  const unassigned = params.get("unassigned") === "1";
  const sort = (params.get("sort") ?? "relevance") as Sort;
  const page = Number(params.get("page") ?? 1) || 1;

  const toggleLang = (v: string) => {
    const next = new Set(langs);
    if (next.has(v)) next.delete(v); else next.add(v);
    push({ lang: [...next].join(","), page: "" });
  };
  const anyFilter = Boolean(term || langs.size || org || label || beginner || unassigned);
  const facetOn = langs.size + (org ? 1 : 0) + (label ? 1 : 0);

  const track = (i: Found) => {
    const meta: IssueMeta = { repo: i.repo, number: i.number, title: i.title, lang: i.lang, stars: i.stars, labels: i.labels, beginner: i.beginner, updated: i.updated };
    const on = toggle(i.url, meta);
    toast(on ? `Tracking ${i.repo} #${i.number}` : `Taken off your board: ${i.repo} #${i.number}`);
  };

  const chip = (on: boolean) =>
    `text-[12px] font-semibold rounded-full px-3 py-1.5 border transition-all cursor-pointer ${
      on ? "bg-accent border-accent text-accentfg" : "bg-paper border-line text-cocoa hover:border-accent hover:text-accent"}`;
  const labelCls = "block font-mono text-[10.5px] tracking-[.12em] uppercase text-dim mb-2.5";

  return (
    <>
      <header className={`${W} pt-14 pb-3`}>
        <p className="font-mono text-[10.5px] tracking-[.14em] uppercase text-dim">
          <Link to="/" className="hover:text-accent">Home</Link> / <span className="text-cocoa">Issue finder</span>
        </p>
        <h1 className="font-display font-extrabold tracking-[-.022em] leading-[1.07] mt-3.5 mb-3 text-[clamp(32px,4.2vw,50px)]">
          Find an issue you can <Word>actually take</Word>.
        </h1>
        <p className="text-cocoa text-[16px] leading-[1.6] max-w-[620px]">
          {num(CRAWL.issues)} open issues read from {num(CRAWL.reposWithIssues)} repositories on {CRAWL.crawledAt}.
          Stale threads and ones with someone already assigned are shown, not hidden.
        </p>
      </header>

      <div className={`${W} pb-24 pt-4 grid grid-cols-[248px_minmax(0,1fr)] gap-8 max-[960px]:grid-cols-1`}>
        {/* ── filter rail ── */}
        {/* one column on a phone, so the rail is first in the DOM and the
            results follow it; the sticky two-column form is desktop only */}
        <aside className="lg:sticky lg:top-[86px] lg:self-start grid gap-6">
          <div>
            <span className={labelCls}>Search</span>
            <input value={term} onChange={(e) => onTerm(e.target.value)} placeholder="memory leak, docs, flaky test…"
              aria-label="Search issue titles" autoComplete="off"
              className="w-full bg-paper border border-line rounded-xl px-3.5 py-2.5 text-[14px] outline-none transition-all focus:border-accent" />
          </div>

          <div>
            <span className={labelCls}>Sort by</span>
            <select value={sort} onChange={(e) => push({ sort: e.target.value === "relevance" ? "" : e.target.value, page: "" })}
              aria-label="Sort results"
              className="w-full bg-paper border border-line rounded-xl px-3.5 py-2.5 text-[14px] outline-none focus:border-accent cursor-pointer">
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          <div>
            <span className={labelCls}>Difficulty</span>
            <div className="flex flex-wrap gap-2">
              <button className={chip(beginner)} onClick={() => push({ beginner: beginner ? "" : "1", page: "" })}>Beginner-labelled</button>
              <button className={chip(unassigned)} onClick={() => push({ unassigned: unassigned ? "" : "1", page: "" })}>Nobody assigned</button>
            </div>
          </div>

          {/* A phone cannot carry three facet lists above the results, so the
              long half of the rail opens on demand there and stays open from
              960px up, where the rail is a column beside them. */}
          <button className={`${btn("outline", "sm")} justify-between lg:hidden`} aria-expanded={more}
            onClick={() => setMore(!more)}>
            {more ? "Fewer filters" : `More filters${facetOn ? ` (${facetOn} on)` : ""}`}
          </button>

          <div className={`grid gap-6 ${more ? "" : "max-[960px]:hidden"}`}>
            {!!body?.facets.langs.length && (
              <div>
                <span className={labelCls}>Language</span>
                <div className="flex flex-wrap gap-2">
                  {body.facets.langs.map((f) => (
                    <button key={f.value} className={chip(langs.has(f.value))} onClick={() => toggleLang(f.value)}>
                      {f.value} <span className="font-mono text-[10px] opacity-70">{fmt(f.count)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!!body?.facets.orgs.length && (
              <div>
                <span className={labelCls}>Organization</span>
                <div className="flex flex-wrap gap-2">
                  {body.facets.orgs.map((f) => (
                    <button key={f.value} className={chip(org === f.value)} onClick={() => push({ org: org === f.value ? "" : f.value, page: "" })}>
                      {f.value} <span className="font-mono text-[10px] opacity-70">{fmt(f.count)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!!body?.facets.labels.length && (
              <div>
                <span className={labelCls}>Label</span>
                <div className="flex flex-wrap gap-2">
                  {body.facets.labels.map((f) => (
                    <button key={f.value} className={chip(label === f.value)} onClick={() => push({ label: label === f.value ? "" : f.value, page: "" })}>
                      {f.value} <span className="font-mono text-[10px] opacity-70">{fmt(f.count)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {anyFilter && (
            <button className={btn("ghost", "sm")} onClick={() => { setTerm(""); setParams(new URLSearchParams()); }}>Clear all filters</button>
          )}
        </aside>

        {/* ── results ── */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4 flex-wrap pb-3 mb-4 border-b border-line">
            <p className="font-mono text-[11px] uppercase tracking-[.12em] text-dim">
              {status === "loading" && !body
                ? "Reading the index"
                : status === "error"
                  ? "Index unavailable"
                  : <><b className="text-ink text-[13px]">{num(body?.total ?? 0)}</b> issues match</>}
            </p>
            <Link to="/dashboard/issues" className="text-[12.5px] font-semibold text-cocoa border-b border-dashed border-dim pb-0.5 hover:text-accent hover:border-accent transition-colors">
              {Object.keys(ledger).length ? `${Object.keys(ledger).length} on your board` : "Open your board"}
            </Link>
          </div>

          {status === "error" && (
            <div className="rounded-[14px] border border-dashed border-rule p-8 text-center">
              <p className="text-[15px] font-semibold">The issue index is not answering right now.</p>
              <p className="text-cocoa text-[13.5px] mt-2 max-w-[420px] mx-auto">
                It is a static snapshot, so this is a delivery problem rather than a data one. Reload, or browse the{" "}
                <Link to="/organizations" className="text-accent font-semibold hover:underline">organizations</Link> while you wait.
              </p>
              <button className={`${btn("outline", "sm")} mt-5`} onClick={() => setParams(new URLSearchParams(url))}>Try again</button>
            </div>
          )}

          {status !== "error" && body && body.issues.length === 0 && (
            <div className="rounded-[14px] border border-dashed border-rule p-10 text-center">
              <p className="text-[15.5px] font-semibold">Nothing matches all of that.</p>
              <p className="text-cocoa text-[13.5px] mt-2 max-w-[430px] mx-auto">
                Drop a filter or search a shorter phrase - titles are matched word by word.
                {" "}{num(CRAWL.beginnerLabelled)} issues in the snapshot carry a beginner label.
              </p>
              {anyFilter && <button className={`${btn("primary", "sm")} mt-5`} onClick={() => { setTerm(""); setParams(new URLSearchParams()); }}>Clear filters</button>}
            </div>
          )}

          <div className="grid gap-3.5">
            {body?.issues.map((i) => (
              <IssueCard key={i.url} i={i} onTrack={track} tracked={Boolean(ledger[i.url])} />
            ))}
            {status === "loading" && body && (
              <p className="font-mono text-[10.5px] uppercase tracking-[.12em] text-dim text-center py-4">Filtering</p>
            )}
            {status === "loading" && !body && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[14px] border border-line bg-card/50 p-[18px] animate-pulse">
                <div className="h-3 w-[220px] rounded bg-clay" />
                <div className="h-4 w-[70%] rounded bg-clay mt-3" />
                <div className="h-3 w-[40%] rounded bg-clay mt-3" />
              </div>
            ))}
          </div>

          {!!body && body.pages > 1 && (
            <nav className="flex items-center justify-between gap-4 mt-7" aria-label="Pagination">
              <button className={btn("outline", "sm")} disabled={page <= 1}
                onClick={() => push({ page: String(Math.max(1, page - 1)) })}>Previous</button>
              <span className="font-mono text-[11px] text-dim">page {page} of {body.pages}</span>
              <button className={btn("outline", "sm")} disabled={page >= body.pages}
                onClick={() => push({ page: String(Math.min(body.pages, page + 1)) })}>Next</button>
            </nav>
          )}

          <p className="font-mono text-[10px] text-dim mt-8 leading-[1.7]">
            Snapshot {body?.meta.generated ?? CRAWL.crawledAt} · {num(CRAWL.issues)} issues · {num(CRAWL.reposWithIssues)} repositories · {CRAWL.languages} languages.
            An issue being open here means GitHub said so on that date; check the thread before you start.
          </p>
        </div>
      </div>
    </>
  );
}
