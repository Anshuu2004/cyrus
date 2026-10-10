/* ══ seed.ts — load the full catalog into Neon Postgres ══════════════
   Run: npm run db:seed   (needs DATABASE_URL in .env)
   Idempotent: each table is cleared and re-inserted inside one pass, so
   the DB always mirrors the datasets in src/data + public/data. ══════ */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getDb } from "./index";
import {
  applications, catalogMeta, hackathons, orgRepos, orgs, programProjects,
  repos, resources, savedItems, submissions, users,
} from "./schema";
import { REPOS } from "../../data/repos";
import { HACKS } from "../../data/hackathons";
import { HACKS_LIVE } from "../../data/hackathonsLive";
import { REAL_ORGS, REAL_REPOS, REAL_STATS } from "../../data/realOrgs";
import { RESOURCES } from "../../data/resources";

const here = fileURLToPath(new URL(".", import.meta.url));
const readJson = (rel: string) => JSON.parse(readFileSync(here + "/../../../public/data/" + rel, "utf8"));

const CATALOG_SNAPSHOT = "2026-10-02"; // matches the refresh pipeline stamp
const HACK_SNAPSHOT = "2026-10-03";

function loadEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    const txt = readFileSync(here + "/../../../.env", "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
    }
  } catch {
    /* no .env file — rely on the real environment */
  }
}

async function main() {
  loadEnv();
  const db = getDb();
  if (!db) {
    console.error("DATABASE_URL is not set. Create a Neon database, put the connection string in .env, then run npm run db:seed.");
    process.exit(1);
  }

  const t0 = Date.now();
  console.log("Clearing catalog tables…");
  await db.delete(savedItems);
  await db.delete(applications);
  await db.delete(submissions);
  await db.delete(users);
  await db.delete(orgRepos);
  await db.delete(orgs);
  await db.delete(repos);
  await db.delete(hackathons);
  await db.delete(programProjects);
  await db.delete(resources);
  await db.delete(catalogMeta);

  console.log(`Repos: ${REPOS.length}…`);
  const repoRows = REPOS.map((r) => ({
    fullName: r.repo,
    cat: r.cat,
    stars: r.stars,
    forks: r.forks,
    issues: r.issues,
    lang: r.lang,
    license: r.license,
    updated: r.updated,
    homepage: r.home,
    url: r.url,
    description: r.desc,
    topics: r.tags,
    snapshot: CATALOG_SNAPSHOT,
  }));
  for (let i = 0; i < repoRows.length; i += 500) {
    await db.insert(repos).values(repoRows.slice(i, i + 500)).onConflictDoNothing();
  }

  console.log(`Orgs: ${REAL_ORGS.length} (+ top repos)…`);
  await db.insert(orgs).values(REAL_ORGS.map((o) => ({
    login: o.login,
    name: o.name,
    domain: o.domain,
    level: o.level,
    tagline: o.tagline,
    topics: o.tags,
    repoCount: o.repos,
    stars: o.stars,
    issues: o.issues,
    followers: REAL_STATS[o.login]?.followers ?? null,
    joined: REAL_STATS[o.login]?.joined ?? null,
    location: REAL_STATS[o.login]?.location ?? null,
    snapshot: CATALOG_SNAPSHOT,
  })));
  const orgRepoRows = Object.entries(REAL_REPOS).flatMap(([orgLogin, list]) =>
    list.map((r) => ({
      orgLogin,
      repo: r.repo,
      description: r.desc,
      lang: r.lang,
      stars: r.stars,
      forks: r.forks,
      issues: r.issues,
      url: r.url,
    })),
  );
  for (let i = 0; i < orgRepoRows.length; i += 500) {
    await db.insert(orgRepos).values(orgRepoRows.slice(i, i + 500));
  }

  console.log(`Hackathons: ${HACKS_LIVE.length} live + ${HACKS.length} curated…`);
  const hackRows = [...HACKS_LIVE, ...HACKS].map((h) => {
    const { timeline, prep, approach, ideas, stack, ...head } = h;
    return {
      ...head,
      orgLogo: h.orgLogo ?? null,
      theme: h.theme ?? null,
      deadline: h.deadline ?? null,
      estimated: h.estimated ?? false,
      url: "url" in h ? String(h.url) : null,
      color: h.color ?? null,
      art: h.art ?? null,
      details: { timeline, prep, approach, ideas, stack },
      snapshot: HACK_SNAPSHOT,
    };
  });
  await db.insert(hackathons).values(hackRows).onConflictDoNothing();

  console.log("Program projects…");
  const gsoc = readJson("gsoc-projects.json");
  const other = readJson("otherProjects.json");
  const projRows = [
    ...gsoc.projects.map((p: Record<string, unknown>) => ({
      program: "GSoC", uid: String(p.u), year: Number(p.y), term: String(p.s ?? ""),
      title: String(p.t), org: String(p.o), status: String(p.s ?? ""),
      tech: (p.tt as string[]) ?? [], topics: (p.tp as string[]) ?? [],
      blurb: String(p.b ?? ""), mentors: p.m ? String(p.m) : null, url: null,
    })),
    ...other.projects.map((p: Record<string, unknown>) => ({
      program: String(p.program ?? "LFX"), uid: String(p.u), year: Number(p.y), term: String(p.s ?? ""),
      title: String(p.t), org: String(p.o), status: String(p.s ?? ""),
      tech: (p.tt as string[]) ?? [], topics: (p.tp as string[]) ?? [],
      blurb: String(p.b ?? ""), mentors: p.m ? String(p.m) : null, url: p.url ? String(p.url) : null,
    })),
  ];
  for (let i = 0; i < projRows.length; i += 500) {
    await db.insert(programProjects).values(projRows.slice(i, i + 500)).onConflictDoNothing();
  }

  console.log(`Resources: ${RESOURCES.length}…`);
  await db.insert(resources).values(RESOURCES.map((r) => ({
    id: r.id, title: r.title, provider: r.provider, brand: r.brand,
    category: r.cat, level: r.level, time: r.time, url: r.url,
    description: r.desc, why: r.why, use: r.use, tags: r.tags, free: r.free,
  })));

  const counts = {
    repos: REPOS.length,
    orgs: REAL_ORGS.length,
    hackathons: hackRows.length,
    programProjects: projRows.length,
    resources: RESOURCES.length,
  };
  await db.insert(catalogMeta).values([
    { key: "snapshot", value: { catalog: CATALOG_SNAPSHOT, hackathons: HACK_SNAPSHOT } },
    { key: "counts", value: counts },
  ]);

  console.log(`Seeded in ${((Date.now() - t0) / 1000).toFixed(1)}s:`, JSON.stringify(counts));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
