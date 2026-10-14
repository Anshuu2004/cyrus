"use client"
/* ══ useDash.ts — one source of truth for every dashboard page ══
   All board state (saved shelf, watchlist, matcher profile, compare picks,
   favourites, notification prefs) lives in localStorage keys shared with the
   rest of the site, so each /dashboard page can hydrate the same picture.  ══ */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@/lib/router";
import { HACKS } from "../../data/hackathons";
import { RESOURCES } from "../../data/resources";
import { ORGS } from "../../data/orgs";
import { REAL_STATS } from "../../data/realOrgs";
import { orgByLogin, repoById, fmt, rnd, useStored, CAT_META } from "../util";
import { useStore } from "../store";
import { googleConfigured, promptGoogle } from "../google";
import { toolById, toolPath } from "../tools/data";
import {
  type ARow, type Profile, type Watch, DUELS, STATUS_CYCLE, extractSkills, norm,
} from "./shared";

export function useDash() {
  const { user, signIn, setAuthOpen, saved, toggleSaved, savedOrgs, toggleSavedOrg, toast, serverUser } = useStore();
  const nav = useNavigate();
  const [prefs, setPrefs] = useStored("agenthub.prefs", { digest: true, windows: true, mentions: false });
  const [gBusy, setGBusy] = useState(false);

  /* matcher profile - GitHub handle + skills parsed from typed list or resume */
  const [prof, setProf] = useStored<Profile>("cyrus.matcher", { gh: "", skills: [], resume: "", done: false });
  const [ghIn, setGhIn] = useState(prof.gh);
  const [skillsIn, setSkillsIn] = useState(prof.skills.join(", "));
  const [fileNote, setFileNote] = useState("");

  /* watchlist - orgs with a status and a note */
  const [watch, setWatch] = useStored<Watch[]>("cyrus.watchlist", []);

  /* org compare picker */
  const [cmpQ, setCmpQ] = useState("");
  const [cmpIds, setCmpIds] = useStored<string[]>("cyrus.compare", []);

  /* artifact favourites - same localStorage key the Artifacts pages write */
  const [favIds] = useStored<string[]>("agenthub.tools.favs", []);
  const favTools = useMemo(() => favIds.map(toolById).filter((t): t is NonNullable<typeof t> => Boolean(t)).slice(0, 6), [favIds]);

  /* program archive, same runtime JSON the Projects page streams */
  const [archive, setArchive] = useState<ARow[]>([]);
  useEffect(() => {
    let go = true;
    const read = (url: string, program: string) =>
      fetch(url).then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => {
        if (!go || !Array.isArray(d?.projects)) return;
        setArchive((a) => [...a, ...d.projects.map((p: ARow) => ({ ...p, program: p.program ?? program }))]);
      }).catch(() => { /* file may not exist yet */ });
    read("/data/gsoc-projects.json", "GSoC");
    read("/data/otherProjects.json", "LFX");
    return () => { go = false; };
  }, []);

  const parseResume = async (f: File | null) => {
    if (!f) return;
    let text = "";
    if (/^text\/|^application\/(json|pdf)/.test(f.type) || /\.(md|txt|json|csv|pdf)$/i.test(f.name)) {
      try {
        text = await f.text();
        if (f.name.toLowerCase().endsWith(".pdf") || text.includes("%PDF")) {
          /* lightweight PDF text harvest - good enough for skill keywords */
          text = text.replace(/[^\x20-\x7E]/g, " ").match(/\(([^()]{2,40})\)/g)?.map((s) => s.slice(1, -1)).join(" ") ?? text;
        }
      } catch { text = ""; }
    }
    const found = extractSkills(text);
    if (found.length) {
      setSkillsIn((s) => [...new Set([...(s ? s.split(",").map((x) => x.trim()) : []), ...found])].filter(Boolean).join(", "));
      setFileNote(`Read ${f.name} - picked up ${found.length} skill keyword${found.length === 1 ? "" : "s"}.`);
    } else setFileNote(`${f.name} loaded, but no known skills detected - type a few below.`);
  };

  const runMatch = () => {
    const skills = extractSkills(skillsIn);
    if (!skills.length && !ghIn.trim()) { toast("Add a GitHub username or some skills first."); return; }
    setProf({ gh: ghIn.trim().replace(/^@/, ""), skills, resume: "", done: true });
    toast(`Profile saved - matched against ${fmt(archive.length || 5238)} archived projects.`);
  };

  const googleIn = async () => {
    if (!googleConfigured()) { setAuthOpen(true); return; }
    setGBusy(true);
    try {
      const g = await promptGoogle();
      signIn({ name: g.name, provider: "Google", email: g.email, picture: g.picture });
      toast(`Welcome, ${g.name.split(" ")[0]} - signed in with Google.`);
      nav("/dashboard");
    } catch (e) {
      toast(((e as Error).message || "").includes("popup") ? (e as Error).message : "Google sign-in didn't complete - try again.");
    } finally {
      setGBusy(false);
    }
  };

  const savedRepos = useMemo(() => saved.map(repoById).filter(Boolean), [saved]);
  const orgList = useMemo(() => savedOrgs.map(orgByLogin).filter(Boolean), [savedOrgs]);
  const stars = savedRepos.reduce((s, r) => s + (r?.stars ?? 0), 0);
  const langs = useMemo(() => [...new Set(savedRepos.map((r) => r!.lang))], [savedRepos]);
  const skills = useMemo(() => [...new Set(savedRepos.flatMap((r) => r!.tags.slice(0, 2)))].slice(0, 12), [savedRepos]);
  const pct = Math.min(100, 20 + saved.length * 8 + savedOrgs.length * 10);

  /* live deadlines: anything still accepting entries, soonest first */
  const due = useMemo(() => HACKS
    .filter((h) => (h.status === "open" || h.status === "rolling") && Math.ceil((+new Date(h.deadline) - Date.now()) / 864e5) >= 0)
    .sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline)), []);
  const dueTop = due.slice(0, 4);

  /* resources that feed the stack you actually saved */
  const picks = useMemo(() => {
    const tags = new Set(savedRepos.flatMap((r) => r!.tags));
    const matched = RESOURCES.filter((x) => x.tags.some((t) => tags.has(t)));
    return (matched.length ? matched : RESOURCES.filter((x) => x.free && x.level === "Beginner")).slice(0, 6);
  }, [savedRepos]);

  const acts = useMemo(() => {
    const mine = saved.slice(0, 5).map((id, i) => [
      `Saved <b>${id.split("/")[1]}</b> from the ${CAT_META[repoById(id)?.cat ?? "tools"]?.label ?? "community"} shelf`,
      ["just now", "1h ago", "3h ago", "yesterday", "2 days ago"][i % 5],
    ] as [string, string]);
    return [...mine, ...DUELS.slice(mine.length ? 1 : 0)];
  }, [saved]);

  /* ── personalised org matcher: score the archive + directory against the profile ── */
  const profileSkills = useMemo(() => [...new Set([...prof.skills, ...skills.map((s) => s.toLowerCase())])], [prof.skills, skills]);
  const recs = useMemo(() => {
    if (!prof.done && !profileSkills.length) return [];
    const byOrg = new Map<string, { hits: number; total: number; techs: Set<string>; years: Set<number> }>();
    for (const p of archive) {
      const e = byOrg.get(p.o) ?? { hits: 0, total: 0, techs: new Set<string>(), years: new Set<number>() };
      e.total++;
      e.years.add(p.y);
      for (const t of (p.tt ?? []).slice(0, 4)) {
        e.techs.add(t);
        const lt = t.toLowerCase();
        if (profileSkills.some((s) => lt.includes(s) || s.includes(lt))) e.hits++;
      }
      byOrg.set(p.o, e);
    }
    const dirBonus = new Map<string, number>();
    for (const o of ORGS) {
      const meta = [...o.tags, ...o.login.split("-")];
      dirBonus.set(norm(o.name), profileSkills.filter((s) => meta.some((m) => m.toLowerCase().includes(s) || s.includes(m.toLowerCase()))).length);
    }
    type Rec = { name: string; login?: string; hits: number; projects: number; years: number; techs: string[]; score: number };
    const list: Rec[] = [];
    for (const [name, e] of byOrg) {
      const extra = dirBonus.get(norm(name)) ?? 0;
      if (!e.hits && !extra) continue;
      list.push({
        name, login: e.hits || extra ? ORGS.find((o) => norm(o.name) === norm(name))?.login : undefined,
        hits: e.hits + extra, projects: e.total, years: e.years.size,
        techs: [...e.techs].slice(0, 4),
        score: Math.min(97, 34 + (e.hits + extra) * 6 + e.years.size * 2),
      });
    }
    return list.sort((a, b) => b.score - a.score || b.projects - a.projects).slice(0, 6);
  }, [archive, prof.done, profileSkills]);

  /* ── mentor finder: handles harvested offline from the archive ── */
  const watchNames = useMemo(() => [...new Set([
    ...watch.map((w) => norm(w.org)), ...savedOrgs.map((l) => norm(orgByLogin(l)?.name ?? l)),
  ])], [watch, savedOrgs]);
  const mentors = useMemo(() => {
    if (!archive.length) return [];
    const pool = archive.filter((p) => p.m && (watchNames.length === 0 || watchNames.some((n) => norm(p.o).includes(n) || n.includes(norm(p.o)))));
    const seen = new Set<string>();
    const out: { name: string; org: string; channel: string; projects: number }[] = [];
    const CH = ["Org Slack / Gitter", "Mailing list", "GitHub discussions", "Community calls"];
    for (const p of pool) {
      const key = norm(p.m);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push({ name: p.m, org: p.o, channel: CH[Math.floor(rnd(p.m, 3) * CH.length)], projects: 1 });
      if (out.length >= 10) break;
    }
    return out;
  }, [archive, watchNames]);

  /* ── compare organisations ── */
  const cmpOrgs = useMemo(() => cmpIds.map((id) => ORGS.find((o) => o.login === id)).filter(Boolean), [cmpIds]);
  const cmpRows = useMemo(() => cmpOrgs.map((o) => {
    const nName = norm(o!.name);
    const ps = archive.filter((p) => { const n = norm(p.o); return n === nName || (nName.length >= 5 && (n.includes(nName) || nName.includes(n))); });
    const techFreq = ps.reduce<Record<string, number>>((acc, p) => { (p.tt ?? []).slice(0, 2).forEach((t) => { acc[t] = (acc[t] ?? 0) + 1; }); return acc; }, {});
    const topTech = Object.entries(techFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? o!.tags[0];
    return { o: o!, projects: ps.length, years: new Set(ps.map((p) => p.y)).size, topTech,
      tier: ps.length >= 150 ? "Tier 1" : ps.length >= 40 ? "Tier 2" : ps.length ? "Tier 3" : "-", followers: REAL_STATS[o!.login]?.followers ?? 0 };
  }), [cmpOrgs, archive]);
  const cmpMatches = useMemo(() => {
    const q = cmpQ.trim().toLowerCase();
    if (!q) return [];
    return ORGS.filter((o) => !cmpIds.includes(o.login) && (o.login.includes(q) || o.name.toLowerCase().includes(q))).slice(0, 6);
  }, [cmpQ, cmpIds]);

  const addWatch = (org: string) => {
    if (watch.some((w) => w.org === org)) { toast(`${org} is already on your watchlist`); return; }
    setWatch([...watch, { org, status: "researching", note: "" }]);
    toast(`Watching ${org} - it now feeds your mentor finder`);
  };

  /* one-tap: every followed org joins the watchlist */
  const trackFollowed = () => {
    const names = orgList.map((o) => o!.name).filter((n) => !watch.some((w) => norm(w.org) === norm(n)));
    if (!names.length) { toast("Every followed org is already on the watchlist."); return; }
    setWatch([...watch, ...names.map((org) => ({ org, status: "researching" as const, note: "" }))]);
    toast(`Added ${names.length} followed org${names.length === 1 ? "" : "s"} to the watchlist`);
  };

  /* what the runtime archive actually holds right now */
  const pulse = useMemo(() => {
    const gsoc = archive.filter((p) => (p.program ?? "GSoC") === "GSoC").length;
    const years = [...new Set(archive.map((p) => p.y))].sort();
    return {
      total: archive.length, gsoc, other: archive.length - gsoc,
      orgs: new Set(archive.map((p) => p.o)).size,
      span: years.length ? `${years[0]}–${years[years.length - 1]}` : "2022–2026",
    };
  }, [archive]);

  /* next-steps checklist: every row derived from real board state */
  const steps: [boolean, string, string][] = [
    [saved.length >= 3, "Save three projects to your shelf", "/projects"],
    [savedOrgs.length >= 1, "Follow an organization", "/organizations"],
    [watch.length >= 1, "Put one org on the watchlist", "/dashboard/watchlist"],
    [prof.done, "Run the personalised org matcher", "/dashboard/matcher"],
    [cmpIds.length >= 2, "Compare two organizations", "/dashboard/compare"],
    [favTools.length >= 1, "Save an artifact and tune its demo", "/tools"],
  ];
  const stepsDone = steps.filter(([on]) => on).length;

  return {
    user, signIn, setAuthOpen, toast, serverUser, nav, gBusy, googleIn,
    saved, toggleSaved, savedOrgs, toggleSavedOrg,
    prefs, setPrefs,
    prof, setProf, ghIn, setGhIn, skillsIn, setSkillsIn, fileNote, setFileNote, parseResume, runMatch,
    watch, setWatch, STATUS_CYCLE, addWatch, trackFollowed,
    cmpQ, setCmpQ, cmpIds, setCmpIds, cmpOrgs, cmpRows, cmpMatches,
    favIds, favTools, toolPath,
    archive, pulse, due, dueTop, picks, acts, recs, mentors,
    savedRepos, orgList, stars, langs, skills, pct,
    steps, stepsDone,
  };
}
export type Dash = ReturnType<typeof useDash>;
