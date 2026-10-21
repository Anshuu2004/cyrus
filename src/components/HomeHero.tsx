"use client";
/* ══ HomeHero.tsx — the centred front-page hero ══════════════════════
   One column: eyebrow pill, a headline with a single green phrase, one short
   line of sub, two pills, the organizations behind the index. Then the board
   itself, framed 16:9 inside the dashed registration-mark frame, sitting on
   the horizon band.

   The frame is not a mock of the product - it is the Issue Finder screen,
   drawn with the same sidebar model, the same icons and the same rows the
   real page renders, so what a visitor sees here is what they get when they
   click through. Every number comes from the crawl.
   ═══════════════════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { Link } from "@/lib/router";
import { REPOS } from "../data/repos";
import { PROGRAMS } from "../data/orgs";
import { CRAWL } from "../data/crawlStats";
import { ISSUE_SIGNALS } from "../data/issueSignals";
import { STATS } from "../lib/siteStats";
import { avatarOf, fmt } from "../lib/util";
import { DP } from "../lib/dash/shared";
import { Word, btn, OrgImg, Logo } from "./ui";
import HorizonBackdrop from "./HorizonBackdrop";

/* the orgs whose public data makes up the index */
const PROOF = ["google", "kubernetes", "vercel", "huggingface", "freeCodeCamp"];

/* the board's own navigation, so the preview cannot promise a screen that
   does not exist. Counts are the real ones the sidebar shows. */
type RailItem = { icon: string; text: string; count?: string };
const RAIL: { label: string; items: RailItem[] }[] = [
  {
    label: "Board",
    items: [
      { icon: DP.grid, text: "Overview" },
      { icon: DP.issue, text: "My Issues" },
      { icon: DP.repo, text: "My Repositories" },
    ],
  },
  {
    label: "Discover",
    items: [
      { icon: DP.search, text: "Issue finder" },
      { icon: DP.building, text: "Organizations", count: fmt(CRAWL.orgs) },
      { icon: DP.flag, text: "Leaderboard", count: "100" },
      { icon: DP.spark, text: "Sponsors" },
      { icon: DP.layers, text: "Project archive", count: fmt(STATS.archive) },
      { icon: DP.star, text: "Skill catalog", count: fmt(REPOS.length) },
    ],
  },
  { label: "Account", items: [{ icon: DP.settings, text: "Settings" }] },
];
const ACTIVE = "Issue finder";

/* the finder's own chips, in the order the rail offers them */
const CHIPS = ["Everything", "Python", "Rust", "Go", "beginner-friendly", "unassigned"];

const PAGES = Math.ceil(CRAWL.issues / 25);

/* three cards, taken from the crawl sample the home page already trusts:
   real open issues in real repositories, at most one per repo so the screen
   reads as a wide ecosystem rather than one busy project */
function previewIssues() {
  const seen = new Set<string>();
  const picked = [];
  for (const i of ISSUE_SIGNALS) {
    if (seen.has(i.repo)) continue;
    seen.add(i.repo);
    picked.push(i);
    if (picked.length === 3) break;
  }
  return picked;
}

function Ic({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function BoardPreview() {
  const issues = useMemo(previewIssues, []);
  return (
    <figure className="frame bg-card/70 backdrop-blur-[2px] p-3 md:p-[14px] shadow-lift">
      <span className="mark tr" aria-hidden>+</span>
      <span className="mark bl" aria-hidden>+</span>

      <div className="aspect-[16/9] overflow-hidden rounded-[10px] border border-line bg-paper flex flex-col text-left">
        {/* app top bar */}
        <div className="shrink-0 h-[44px] flex items-center gap-2.5 px-3.5 border-b border-line bg-card">
          <Logo size={22} />
          <span className="font-display font-extrabold text-[13px] tracking-[-.02em] shrink-0">
            cyrus<span className="text-accent">.ai</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[.12em] text-dim border border-line rounded-full px-2 py-[3px]">
            <i className="not-italic w-[5px] h-[5px] rounded-full bg-accent" />
            Board
          </span>
          <span className="ml-auto flex items-center gap-2.5 min-w-0">
            <span className="hidden md:flex items-center gap-2 w-[186px] text-[11px] text-dim bg-cream border border-line rounded-full px-3 py-[4px]">
              <Ic d={DP.search} size={12} />
              <span className="truncate">Search issues, repos, orgs</span>
              <kbd className="ml-auto font-mono text-[8.5px] border border-line rounded-[4px] px-1 py-px">⌘K</kbd>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-[10.5px] font-semibold text-cocoa">
              <Ic d={DP.external} size={11} /> Site
            </span>
            <span className="w-[22px] h-[22px] rounded-full grid place-items-center bg-clay border border-line text-dim shrink-0">
              <Ic d={DP.sun} size={11} />
            </span>
            <span className="w-[22px] h-[22px] rounded-full bg-cream border border-line grid place-items-center font-mono text-[8.5px] font-bold text-dim shrink-0">
              ?
            </span>
          </span>
        </div>

        <div className="flex-1 min-h-0 flex">
          {/* sidebar: the board's own groups, icons and counts */}
          <aside className="hidden md:flex flex-col w-[184px] shrink-0 border-r border-line bg-sand min-h-0">
            <nav className="flex-1 px-2.5 py-3 overflow-hidden">
              {RAIL.map((g, gi) => (
                <div key={g.label} className={gi ? "mt-3.5" : ""}>
                  <span className="block font-mono text-[8.5px] uppercase tracking-[.14em] text-dim px-2 mb-1">{g.label}</span>
                  <div className="grid gap-[2px]">
                    {g.items.map((it) => {
                      const on = it.text === ACTIVE;
                      return (
                        <span key={it.text} className={`relative flex items-center gap-2 rounded-[8px] px-2 py-[5px] text-[11px] font-semibold ${on ? "bg-clay text-ink" : "text-cocoa"}`}>
                          {on && <i className="not-italic absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-[13px] rounded-l-full bg-accent" />}
                          <span className={on ? "text-accent shrink-0" : "shrink-0"}><Ic d={it.icon} size={12} /></span>
                          <span className="truncate">{it.text}</span>
                          {it.count && <span className={`ml-auto font-mono text-[9px] shrink-0 ${on ? "text-accent" : "text-dim"}`}>{it.count}</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
            {/* the pinned account card, in the state a first-time visitor is
                actually in: nothing signed in, nothing invented */}
            <div className="border-t border-line p-2.5">
              <div className="flex items-center gap-2 p-1.5 rounded-[10px] bg-card border border-line">
                <span className="w-[20px] h-[20px] rounded-full bg-clay border border-line grid place-items-center font-mono text-[8.5px] font-bold text-dim shrink-0">?</span>
                <span className="min-w-0 flex-1">
                  <b className="block text-[10.5px] font-semibold truncate">Guest</b>
                  <span className="block text-[9px] text-dim truncate">Browse free, no login</span>
                </span>
                <span className="w-[18px] h-[18px] grid place-items-center rounded-[6px] text-dim shrink-0"><Ic d={DP.collapse} size={11} /></span>
              </div>
            </div>
          </aside>

          {/* main column: the Issue Finder */}
          <div className="flex-1 min-w-0 px-4 md:px-5 py-3.5 overflow-hidden">
            <h3 className="font-display font-extrabold text-[15px] tracking-[-.015em]">Issue finder</h3>
            <p className="text-[11px] text-dim mt-0.5">
              <b className="text-accent font-semibold">{fmt(CRAWL.issues)}</b> open issues from {fmt(CRAWL.reposWithIssues)} repositories. Snapshot {CRAWL.crawledAt}.
            </p>
            <div className="flex items-center gap-1.5 mt-2.5 overflow-hidden">
              {CHIPS.map((c, i) => (
                <span key={c} className={`shrink-0 font-mono text-[9.5px] rounded-full px-2.5 py-[4px] border ${i === 0 ? "border-accent/40 bg-peach text-accent" : "border-line bg-card text-cocoa"}`}>{c}</span>
              ))}
            </div>
            <div className="grid gap-2 mt-3">
              {issues.map((i) => {
                const [owner] = i.repo.split("/");
                return (
                  <div key={i.url} className="rounded-[10px] border border-line bg-card px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <OrgImg src={avatarOf(owner, 48)} name={owner} className="w-[18px] h-[18px] rounded-[5px] object-cover bg-sand shrink-0" />
                      <span className="font-mono text-[9.5px] text-dim truncate">{i.repo}</span>
                      <span className="font-mono text-[9.5px] text-dim shrink-0">#{i.number}</span>
                      <span className="ml-auto shrink-0 flex items-center gap-1 font-mono text-[9.5px] text-cocoa">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden><path d={DP.star} /></svg>
                        {fmt(i.stars)}
                      </span>
                    </div>
                    <p className="text-[11.5px] font-medium text-ink mt-1.5 line-clamp-1">{i.title}</p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                      {i.labels.slice(0, 2).map((l) => (
                        <span key={l} className="font-mono text-[8.5px] rounded-[5px] border border-line bg-cream px-1.5 py-px text-cocoa truncate max-w-[120px]">{l}</span>
                      ))}
                      {i.beginner && <span className="font-mono text-[8.5px] rounded-[5px] border border-accent/35 bg-peach px-1.5 py-px text-accent">good first issue</span>}
                    </div>
                    <div className="flex flex-wrap items-baseline gap-1.5 pt-2 mt-2 border-t border-dashed border-line font-mono text-[9.5px]">
                      {[["Language", i.lang ?? "n/a"], ["Last touched", i.updated], ["Beginner-labelled", i.beginner ? "yes" : "no"]].map(([l, v], k) => (
                        <span key={l} className={`flex items-baseline gap-1 ${k ? "before:content-['·'] before:text-rule before:mr-1" : ""}`}>
                          <span className="text-dim">{l}</span>
                          <b className="text-ink font-semibold">{v}</b>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-2.5 font-mono text-[9px] text-dim">
              <span className="rounded-[5px] border border-accent/40 bg-peach px-1.5 py-px text-accent">1</span>
              <span>2</span><span>3</span><span className="opacity-60">…</span>
              <span>{fmt(PAGES)}</span>
              <span className="ml-auto">25 per page</span>
            </div>
          </div>

          {/* right rail: the index, and the windows it is in */}
          <aside className="hidden xl:block w-[212px] shrink-0 border-l border-line bg-card px-3 py-3 overflow-hidden">
            <b className="block font-mono text-[8.5px] uppercase tracking-[.14em] text-dim mb-2">The index now</b>
            {[[fmt(CRAWL.issues), "open issues"], [fmt(CRAWL.reposWithIssues), "repos with live issues"], [fmt(CRAWL.orgs), "organizations"], [fmt(CRAWL.beginnerLabelled), "beginner-labelled"]].map(([v, l]) => (
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
            <p className="mt-4 pt-3 border-t border-liness font-mono text-[8.5px] uppercase tracking-[.1em] leading-[1.9] text-dim">
              {fmt(CRAWL.catalogRepos)} repos indexed · {CRAWL.languages} languages · rebuilt {CRAWL.crawledAt}
            </p>
          </aside>
        </div>
      </div>
      <figcaption className="mt-3.5 mb-0.5 text-center font-mono text-[10.5px] uppercase tracking-[.12em] text-dim">
        The finder, on {fmt(CRAWL.issues)} real issues · free to browse, no login required
      </figcaption>
    </figure>
  );
}

export default function HomeHero({ horizon }: { horizon?: string }) {
  return (
    <header id="hero" className="relative overflow-hidden pt-[72px] pb-16 max-[700px]:pt-12 max-[700px]:pb-12">
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
          <Link to="/issues" className={btn("dark", "lg")}>
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
      </div>

      {/* the board, on the horizon: the band is full-bleed so the frame reads
          as a window onto a place rather than a card on a page */}
      <div className="hero-stage reveal mt-11 pb-2" style={{ animationDelay: ".68s" }}>
        <HorizonBackdrop photo={horizon} />
        <div className="hero-stage-inner max-w-[1220px] mx-auto px-6">
          <BoardPreview />
        </div>
      </div>
    </header>
  );
}
