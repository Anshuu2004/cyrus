/* ══ llms.txt — the plain-text index agents are pointed at ════════════
   A screenful, and every number and path in it comes from the same
   modules the pages use, so this file cannot drift from the site.
   Rebuilt on deploy: the open-hackathon count is as fresh as the build. ══ */
import { FREE_APIS } from "@/data/freeApis";
import { TOOLS_TOTAL } from "@/lib/tools/data";
import { canonical } from "@/lib/seo";
import { ARCHIVE_PROJECTS, STATS, fmt, openHacks } from "@/lib/siteStats";

const line = (path: string, what: string) => `- ${canonical(path)} - ${what}`;

const body = `# cyrus.ai

> The developer-program platform. ${fmt(STATS.repos)} AI-agent repos, ${fmt(ARCHIVE_PROJECTS)} mentored open-source projects, ${fmt(STATS.orgs)} organization profiles, ${STATS.programs} tracked programs and ${fmt(STATS.hacks)} hackathons (${fmt(openHacks())} open right now), in one self-refreshing catalog. Humans browse the pages below; agents can read the same data without parsing markup.

## Pages

${line("/projects", `the ${fmt(STATS.repos)}-repo catalog of agent skills, Cursor rules, AGENTS.md configs, MCP servers and dev tools, ranked by stars`)}
${line("/opensource", `${fmt(ARCHIVE_PROJECTS)} mentored projects from GSoC, LFX, Outreachy, Hacktoberfest and Nexus Spring of Code, filterable by year, org and tech`)}
${line("/hackathons", `${fmt(STATS.hacks)} hackathons with deadlines, prize pools, eligibility and a prep playbook for each`)}
${line("/organizations", `${fmt(STATS.orgs)} real GitHub organizations with stats, program history and how to contribute to each`)}
${line("/resources", `${fmt(STATS.resources)} first-party learning resources from the companies that build the tooling`)}
${line("/tools", `${fmt(TOOLS_TOTAL)} build artifacts: live demos, copy-paste code and ready-made prompts`)}
${line("/apis", `${fmt(FREE_APIS.length)} free public APIs, labelled by auth model and CORS support`)}

## Object URLs

- Repo detail: ${canonical("/repo/n8n-io%2Fn8n")} - the slash in owner/name is percent-encoded
- Program detail: ${canonical("/programs/gsoc")} - ids are gsoc, outreachy, lfx, gssoc, oct, nsoc, esoc, kde, mlh, sob
- Hackathon detail: ${canonical("/hackathons/github-universe-ai-hackathon-2026")}
- Organization detail: ${canonical("/organizations/google")}
- Resource detail: ${canonical("/resources/google-dev-learning")}

## Machine-readable

- ${canonical("/sitemap.xml")} - every indexable URL, generated from the same datasets
- ${canonical("/robots.txt")} - crawl rules; /dashboard and /api are not for indexing
- ${canonical("/api/health")} - reports {"ok":true,"db":boolean,"auth":boolean}
- ${canonical("/api/catalog/counts")} - live row counts per catalog table
- ${canonical("/api/catalog/repos")}?cat=skills|cursor|agentsmd|mcp|tools&q=&domain=&model=&format=&framework=&page=&per= - filtered rows, per caps at 60

The two catalog endpoints above answer 503 while no database is attached, and
/api/health tells you whether one is. Everything else here is static content
built from the checked-in datasets: no key, session or cookie is needed to read it.
`;

export function GET() {
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
