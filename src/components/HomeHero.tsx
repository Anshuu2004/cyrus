"use client";
/* ══ HomeHero.tsx — the centred front-page hero ══════════════════════
   One column: eyebrow pill, a headline with a single green phrase, one short
   line of sub, two pills, the organizations behind the index, then the board
   itself, framed 16:9 inside the dashed registration-mark frame. Every number
   and row in the preview is real crawl data - it shows the archive, not a mock.
   ═══════════════════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { Link } from "@/lib/router";
import { REPOS } from "../data/repos";
import { ORGS, PROGRAMS } from "../data/orgs";
import { CRAWL } from "../data/crawlStats";
import { STATS } from "../lib/siteStats";
import { avatarOf, fmt, byStars } from "../lib/util";
import { Word, btn, OrgImg } from "./ui";

/* the orgs whose public data makes up the index */
const PROOF = ["google", "kubernetes", "vercel", "huggingface", "freeCodeCamp"];

/* the labels are the board's own, so the preview is not selling a screen
   that does not exist */
const SIDEBAR: [string, [string, string][]][] = [
  ["Board", [["Overview", ""], ["My Issues", ""], ["My Repositories", ""]]],
  ["Discover", [["Organizations", fmt(CRAWL.orgs)], ["Project archive", fmt(STATS.archive)], ["Skill catalog", fmt(REPOS.length)]]],
  ["Account", [["Settings", ""]]],
];

/* a static 16:9 view of the contribution board, built from the same data the
   board renders. No animation: the hero's motion budget goes into the reveal. */
/* Three cards, in the order the archive really ranks them, but only from
   organizations this site tracks - the point of the preview is a shelf a
   visitor can go and open, not the three highest-starred rows in the file. */
function previewRepos() {
  const tracked = new Set(ORGS.map((o) => o.login.toLowerCase()));
  const ranked = REPOS.slice().sort(byStars);
  const picked = ranked.filter((r) => tracked.has(r.repo.split("/")[0].toLowerCase())).slice(0, 3);
  return picked.length === 3 ? picked : ranked.slice(0, 3);
}

function BoardPreview() {
  const repos = useMemo(previewRepos, []);
  return (
    <figure className="frame bg-card/60 p-3 md:p-[14px] shadow-lift mt-11">
      <div className="aspect-[16/9] overflow-hidden rounded-[10px] border border-line bg-sand flex flex-col text-left">
        {/* app bar */}
        <div className="shrink-0 h-[42px] flex items-center gap-3 px-3.5 border-b border-line bg-card">
          <span className="font-display font-extrabold text-[13px] tracking-[-.02em] shrink-0">
            cyrus<span className="text-accent">.ai</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[.12em] text-dim border border-line rounded-full px-2 py-[3px]">
            <i className="not-italic w-[5px] h-[5px] rounded-full bg-accent" />
            Board
          </span>
          <span className="ml-auto flex items-center gap-2.5 min-w-0">
            <span className="hidden md:flex items-center gap-2 w-[196px] text-[11px] text-dim bg-cream border border-line rounded-full px-3 py-[4px]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className="shrink-0"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 4 4" /></svg>
              <span className="truncate">Search issues, repos, orgs</span>
              <kbd className="ml-auto font-mono text-[8.5px] border border-line rounded-[4px] px-1 py-px">⌘K</kbd>
            </span>
            <span className="w-[22px] h-[22px] rounded-full bg-clay border border-line shrink-0" />
          </span>
        </div>

        <div className="flex-1 min-h-0 flex">
          {/* sidebar */}
          <aside className="hidden md:block w-[178px] shrink-0 border-r border-line bg-card px-2.5 py-3 overflow-hidden">
            {SIDEBAR.map(([group, rows], g) => (
              <div key={group} className={g ? "mt-3.5" : ""}>
                <span className="block font-mono text-[8.5px] uppercase tracking-[.14em] text-dim px-2 mb-1">{group}</span>
                {rows.map(([label, count], i) => {
                  const on = g === 0 && i === 0;
                  return (
                    <span key={label} className={`relative flex items-center gap-2 rounded-[8px] px-2 py-[6px] text-[11.5px] font-medium ${on ? "bg-clay text-ink" : "text-cocoa"}`}>
                      {on && <i className="not-italic absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-[13px] rounded-l-full bg-accent" />}
                      <span className="truncate">{label}</span>
                      {count && <span className="ml-auto font-mono text-[9px] text-dim shrink-0">{count}</span>}
                    </span>
                  );
                })}
              </div>
            ))}
          </aside>

          {/* main column */}
          <div className="flex-1 min-w-0 px-4 md:px-5 py-3.5 overflow-hidden">
            <h3 className="font-display font-extrabold text-[15px] tracking-[-.015em]">Skill catalog</h3>
            <p className="text-[11px] text-dim mt-0.5">
              {fmt(REPOS.length)} repositories, ranked by stars. Snapshot {CRAWL.crawledAt}.
            </p>
            <div className="flex items-center gap-1.5 mt-2.5 overflow-hidden">
              {["Everything", "TypeScript", "Python", "Rust", "Go", "good first issue"].map((c, i) => (
                <span key={c} className={`shrink-0 font-mono text-[9.5px] rounded-full px-2.5 py-[4px] border ${i === 0 ? "border-accent/40 bg-peach text-accent" : "border-line bg-card text-cocoa"}`}>{c}</span>
              ))}
            </div>
            <div className="grid gap-2 mt-3">
              {repos.map((r) => {
                const [owner, name] = r.repo.split("/");
                return (
                  <div key={r.repo} className="rounded-[10px] border border-line bg-card px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <OrgImg src={avatarOf(owner, 48)} name={owner} className="w-[20px] h-[20px] rounded-[6px] object-cover bg-sand shrink-0" />
                      <b className="text-[12.5px] font-semibold text-ink truncate">{name}</b>
                      <span className="font-mono text-[9.5px] text-dim truncate">{owner}</span>
                      <span className="ml-auto shrink-0 text-dim">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden><path d="M6 3h12v18l-6-4.5L6 21V3Z" /></svg>
                      </span>
                    </div>
                    <p className="text-[11px] text-cocoa mt-1.5 line-clamp-1">{r.desc}</p>
                    <div className="flex flex-wrap items-baseline gap-1.5 pt-2 mt-2 border-t border-dashed border-line font-mono text-[9.5px]">
                      {[["Stars", fmt(r.stars)], ["Open issues", fmt(r.issues)], ["Forks", fmt(r.forks)], ["Last update", r.updated]].map(([l, v], i) => (
                        <span key={l} className={`flex items-baseline gap-1 ${i ? "before:content-['·'] before:text-rule before:mr-1" : ""}`}>
                          <span className="text-dim">{l}</span>
                          <b className="text-ink font-semibold">{v}</b>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* right rail */}
          <aside className="hidden xl:block w-[212px] shrink-0 border-l border-line bg-card px-3 py-3 overflow-hidden">
            <b className="block font-mono text-[8.5px] uppercase tracking-[.14em] text-dim mb-2">The index now</b>
            {[[fmt(CRAWL.issues), "open issues"], [fmt(CRAWL.reposWithIssues), "repos with live issues"], [fmt(CRAWL.orgs), "organizations"], [String(CRAWL.languages), "languages"]].map(([v, l]) => (
              <div key={l} className="flex items-baseline justify-between gap-2 py-[6px] border-b border-liness last:border-0">
                <span className="font-display font-bold text-[12px] text-accent">{v}</span>
                <span className="text-[10px] text-cocoa text-right">{l}</span>
              </div>
            ))}
            <b className="block font-mono text-[8.5px] uppercase tracking-[.14em] text-dim mt-4 mb-2">Program windows</b>
            {PROGRAMS.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-2 py-[5px] border-b border-liness last:border-0">
                <img src={avatarOf(p.owner, 40)} alt="" loading="lazy" className="w-[14px] h-[14px] rounded-[4px] object-cover bg-sand shrink-0" />
                <span className="min-w-0">
                  <b className="block text-[10.5px] font-semibold text-ink truncate">{p.name}</b>
                  <span className="block text-[9px] text-dim truncate">{p.window}</span>
                </span>
              </div>
            ))}
          </aside>
        </div>
      </div>
      <figcaption className="mt-3.5 mb-0.5 text-center font-mono text-[10.5px] uppercase tracking-[.12em] text-dim">
        The board, on real data · free to browse, no login required
      </figcaption>
    </figure>
  );
}

export default function HomeHero() {
  return (
    <header id="hero" className="relative overflow-hidden pt-[72px] pb-16 max-[700px]:pt-12 max-[700px]:pb-11">
      <div className="hero-glow" />
      <div className="hero-pattern" />
      <div className="relative z-[1] max-w-[1060px] mx-auto px-6 text-center">
        <span className="reveal inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-[7px] font-mono text-[10.5px] uppercase tracking-[.14em] text-cocoa">
          <i className="not-italic w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_22%,transparent)]" />
          Open source discovery for GitHub developers
        </span>

        <h1 className="font-display font-extrabold tracking-[-.03em] leading-[1.04] mt-6 text-[clamp(38px,6vw,74px)]">
          <span className="block reveal" style={{ animationDelay: ".08s" }}>Discover open source.</span>
          <span className="block reveal" style={{ animationDelay: ".2s" }}>Ship what <Word>matters</Word>.</span>
        </h1>

        <p className="reveal mx-auto mt-4 max-w-[560px] text-cocoa text-[15.5px] leading-[1.6]" style={{ animationDelay: ".34s" }}>
          {fmt(CRAWL.issues)} real open issues, {PROGRAMS.length} funded programs, one contribution board.
        </p>

        <div className="reveal flex gap-3 justify-center flex-wrap mt-8" style={{ animationDelay: ".46s" }}>
          <Link to="/projects" className={btn("dark", "lg")}>
            Start searching
            <span className="grid place-items-center w-[22px] h-[22px] rounded-full bg-paper text-ink shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </Link>
          <Link to="/opensource" className={btn("outline", "lg")}>Browse programs</Link>
        </div>

        <div className="reveal flex items-center justify-center gap-3.5 mt-6 flex-wrap" style={{ animationDelay: ".58s" }}>
          <span className="flex items-center">
            {PROOF.map((o, i) => (
              <OrgImg key={o} src={avatarOf(o, 64)} name={o} title={o}
                className={`w-[30px] h-[30px] rounded-full object-cover bg-sand ring-2 ring-paper ${i ? "-ml-2.5" : ""}`} />
            ))}
            <span className="-ml-2.5 w-[30px] h-[30px] rounded-full ring-2 ring-paper bg-clay grid place-items-center font-mono text-[9.5px] font-bold text-cocoa">
              +{CRAWL.orgs - PROOF.length}
            </span>
          </span>
          <span className="text-[12.5px] text-dim">
            Indexed from <b className="text-cocoa font-semibold">{fmt(CRAWL.orgs)} organizations</b> on GitHub
          </span>
        </div>

        <div className="reveal" style={{ animationDelay: ".68s" }}>
          <BoardPreview />
        </div>
      </div>
    </header>
  );
}
