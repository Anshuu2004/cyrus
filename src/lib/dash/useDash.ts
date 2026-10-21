"use client"
/* ══ useDash.ts — one source of truth for every board page ═══════
   Board state lives in localStorage keys shared with the rest of the
   site (saved repos, followed orgs) plus one issue ledger, so every
   /dashboard page hydrates the same picture. When a server session is
   active the repo and org keys also sync through /api/me/saved.     ═ */
import { useMemo, useState } from "react";
import { useNavigate } from "@/lib/router";
import { ORGS } from "../../data/orgs";
import { CRAWL } from "../../data/crawlStats";
import { ISSUE_SIGNALS } from "../../data/issueSignals";
import { orgByLogin, repoById, useStored } from "../util";
import { useStore } from "../store";
import { googleConfigured, promptGoogle } from "../google";
import { parseIssueUrl, type IssueStage, type TrackedIssue } from "./shared";

type LedgerEntry = { stage: IssueStage; added: string };

/* the crawl rows the board can offer you right now, keyed by URL */
const SHELF = new Map(ISSUE_SIGNALS.map((i) => [i.url, i]));
const STALE_MS = 90 * 864e5;

export function useDash() {
  const { user, signIn, signOut, setAuthOpen, saved, toggleSaved, savedOrgs, toggleSavedOrg, unfollowAll, toast, setPaletteOpen, serverUser, theme, toggleTheme, boardReady } = useStore();
  const nav = useNavigate();
  const [gBusy, setGBusy] = useState(false);

  /* ── the issue ledger: url -> stage + the day you added it ────── */
  const [ledger, setLedger] = useStored<Record<string, LedgerEntry>>("cyrus.issues.v1", {});

  const issues = useMemo<TrackedIssue[]>(
    () =>
      Object.entries(ledger).map(([url, e]) => {
        const s = SHELF.get(url);
        const parsed = parseIssueUrl(url);
        return {
          url,
          repo: s?.repo ?? parsed?.repo ?? "unknown repository",
          number: s?.number ?? parsed?.number ?? 0,
          title: s?.title ?? `${parsed?.repo ?? "issue"} #${parsed?.number ?? "?"}`,
          lang: s?.lang ?? null,
          stars: s?.stars ?? 0,
          labels: s?.labels ?? [],
          beginner: s?.beginner ?? false,
          updated: s?.updated ?? "",
          added: e.added,
        };
      }),
    [ledger],
  );

  const byStage = (stage: IssueStage) => issues.filter((i) => ledger[i.url]?.stage === stage);
  const stageOf = (url: string): IssueStage => ledger[url]?.stage ?? "saved";

  const trackIssue = (raw: string) => {
    const parsed = parseIssueUrl(raw);
    if (!parsed) {
      toast("That is not a GitHub issue link yet - try one like github.com/vercel/next.js/issues/123");
      return false;
    }
    if (ledger[parsed.url]) {
      toast("That issue is already on your board.");
      return false;
    }
    setLedger({ ...ledger, [parsed.url]: { stage: "saved", added: new Date().toISOString() } });
    toast(`Tracking ${parsed.repo} #${parsed.number}`);
    return true;
  };
  const toggleIssue = (url: string) => {
    const next = { ...ledger };
    const had = Boolean(next[url]);
    if (had) delete next[url];
    else next[url] = { stage: "saved" as IssueStage, added: new Date().toISOString() };
    setLedger(next);
    return !had;
  };
  const setStage = (url: string, stage: IssueStage) =>
    setLedger({ ...ledger, [url]: { ...(ledger[url] ?? { added: new Date().toISOString() }), stage } });
  const removeIssue = (url: string) => {
    const next = { ...ledger };
    delete next[url];
    setLedger(next);
  };
  const clearIssues = () => {
    setLedger({});
    toast("Issue ledger cleared.");
  };

  /* ── repositories and organizations ───────────────────────────── */
  const savedRepos = useMemo(
    () => saved.map(repoById).filter((r): r is NonNullable<typeof r> => Boolean(r)),
    [saved],
  );
  const orgList = useMemo(
    () => savedOrgs.map(orgByLogin).filter((o): o is NonNullable<typeof o> => Boolean(o)),
    [savedOrgs],
  );
  const stars = savedRepos.reduce((sum, r) => sum + r.stars, 0);
  const openIssues = savedRepos.reduce((sum, r) => sum + r.issues, 0);
  const langs = useMemo(() => [...new Set(savedRepos.map((r) => r.lang).filter((l) => l && l !== "-"))], [savedRepos]);

  /* what the index actually holds, straight from the generated crawl stats */
  const index = {
    issues: CRAWL.issues,
    issueRepos: CRAWL.reposWithIssues,
    catalog: CRAWL.catalogRepos,
    beginner: CRAWL.beginnerLabelled,
    orgs: ORGS.length,
    crawledAt: CRAWL.crawledAt,
  };

  /* ── needs your attention: derived from the board, never invented ─ */
  type Attention = { tone: "warn" | "info"; title: string; body: string; to: string; cta: string };
  const attention: Attention[] = [];
  const working = byStage("working");
  if (working.length) {
    const names = working.slice(0, 3).map((i) => `${i.repo} #${i.number}`).join(" · ");
    attention.push({
      tone: "warn",
      title: `${working.length} issue${working.length === 1 ? "" : "s"} sitting in working on it`,
      body: names + (working.length > 3 ? ` · +${working.length - 3} more` : ""),
      to: "/dashboard/issues",
      cta: "Open My Issues",
    });
  }
  const stale = issues.filter((i) => i.updated && Date.now() - +new Date(i.updated) > STALE_MS);
  if (stale.length) {
    attention.push({
      tone: "warn",
      title: `${stale.length} tracked issue${stale.length === 1 ? " has" : "s have"} had no activity for 90 days`,
      body: "A thread nobody touched for a quarter is usually a dead one. Check it is still open on GitHub before you spend an evening on it.",
      to: "/dashboard/issues",
      cta: "Review them",
    });
  }
  if (!issues.length) {
    attention.push({
      tone: "info",
      title: "Your issue ledger is empty",
      body: `Track one of the ${CRAWL.issues.toLocaleString("en-US")} open issues crawled on ${CRAWL.crawledAt}, or paste any GitHub issue link.`,
      to: "/dashboard/issues",
      cta: "Start tracking",
    });
  }
  if (!saved.length) {
    attention.push({
      tone: "info",
      title: "You are not following any repository yet",
      body: "Following a repository is what turns the catalog into a board: its stars, open issues and last update land here.",
      to: "/projects",
      cta: "Browse the catalog",
    });
  }
  if (!savedOrgs.length) {
    attention.push({
      tone: "info",
      title: "No organizations followed",
      body: `${ORGS.length} organizations are tracked here with their live open-issue count and accepted program projects.`,
      to: "/organizations",
      cta: "Pick an organization",
    });
  }

  /* ── next steps: every row is real board state ────────────────── */
  const steps: [boolean, string, string][] = [
    [issues.length >= 1, "Track your first open issue", "/dashboard/issues"],
    [working.length >= 1, "Move one issue to working on it", "/dashboard/issues"],
    [saved.length >= 3, "Follow three repositories", "/projects"],
    [savedOrgs.length >= 1, "Follow an organization", "/organizations"],
    [byStage("done").length >= 1, "Close one out as completed", "/dashboard/issues"],
  ];
  const stepsDone = steps.filter(([on]) => on).length;
  const pct = Math.round((stepsDone / steps.length) * 100);

  const googleIn = async () => {
    if (!googleConfigured()) {
      setAuthOpen(true);
      return;
    }
    setGBusy(true);
    try {
      const g = await promptGoogle();
      signIn({ name: g.name, provider: "Google", email: g.email, picture: g.picture });
      toast(`Welcome, ${g.name.split(" ")[0]} - signed in with Google.`);
      nav("/dashboard");
    } catch (e) {
      toast((e as Error).message?.includes("popup") ? (e as Error).message : "Google sign-in didn't complete - try again.");
    } finally {
      setGBusy(false);
    }
  };

  return {
    user, signIn, signOut, setAuthOpen, toast, serverUser, nav, gBusy, googleIn, theme, toggleTheme, boardReady,
    saved, toggleSaved, savedOrgs, toggleSavedOrg, unfollowAll, setPaletteOpen,
    ledger, issues, byStage, stageOf, trackIssue, toggleIssue, setStage, removeIssue, clearIssues,
    savedRepos, orgList, stars, openIssues, langs,
    index, attention, steps, stepsDone, pct,
  };
}
export type Dash = ReturnType<typeof useDash>;
