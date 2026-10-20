/* ══ jsonLd.ts — the machine-readable layer under the four pages that
   already hold the facts ═══════════════════════════════════════════════
   Server-safe: no React, no browser APIs, nothing imported from lib/util.
   The page components call these and inline the result as
   <script type="application/ld+json">.

   The rule this module obeys is the one the issue set: a date is emitted
   only when the dataset carries it. Google requires startDate on Event,
   and no hackathon record has a real start date yet, so those pages
   publish a CreativeWork with the deadline as `expires` and switch to
   Event the moment a `start` lands in the data. Nothing is guessed to
   make a validator happy. ════════════════════════════════════════════ */
import type { Hack } from "@/data/hackathons";
import { PROGRAM_DETAILS } from "@/data/programDetails";
import { SITE_ORIGIN, canonical } from "@/lib/seo";
import type { Org, Program } from "@/lib/types";
import { statsLine } from "@/lib/siteStats";

export type JsonLd = Record<string, unknown>;

/** Escape the two characters that could close the script tag early: the
 * data is full of prose written by other people. */
export function jsonLdScript(data: JsonLd): { __html: string } {
  const json = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
  return { __html: json };
}

const ORG_ID = `${SITE_ORIGIN}/#organization`;
const SITE_ID = `${SITE_ORIGIN}/#website`;

const githubOrg = (login: string) => `https://github.com/${login}`;
const avatar = (login: string, size = 168) => `${githubOrg(login)}.png?size=${size}`;
const absolute = (path: string) => (path.startsWith("http") ? path : `${SITE_ORIGIN}${path}`);

/** A date the dataset states as ISO, or nothing. */
const isoDate = (value: string | undefined): string | undefined =>
  value && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : undefined;

export function webSite(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: "cyrus.ai",
    url: canonical("/"),
    description: `The developer-program platform: ${statsLine()} in one catalog.`,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${canonical("/projects")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function programEntity(p: Program): JsonLd {
  const detail = PROGRAM_DETAILS[p.id];
  const url = canonical(`/programs/${p.id}`);
  const body: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": url,
    name: p.name,
    url,
    description: p.tag,
    image: absolute(p.img),
    provider: {
      "@type": "Organization",
      name: p.owner,
      url: githubOrg(p.owner),
    },
    sameAs: p.url,
    // the program pages describe an application, not a paid product
    isAccessibleForFree: true,
  };
  if (detail) {
    body.coursePrerequisites = detail.eligibility;
    body.educationalLevel = detail.level;
    body.abstract = detail.about[0];
  }
  return body;
}

const EVENT_STATUS: Record<Hack["status"], string> = {
  open: "https://schema.org/EventScheduled",
  upcoming: "https://schema.org/EventScheduled",
  rolling: "https://schema.org/EventScheduled",
  recurring: "https://schema.org/EventScheduled",
  closed: "https://schema.org/EventCompleted",
};

function attendanceMode(format: string): string | undefined {
  const f = format.toLowerCase();
  if (f.includes("hybrid")) return "https://schema.org/MixedEventAttendanceMode";
  if (f.includes("online") || f.includes("remote") || f.includes("virtual"))
    return "https://schema.org/OnlineEventAttendanceMode";
  if (f.includes("in person") || f.includes("onsite") || f.includes("on-site"))
    return "https://schema.org/OfflineEventAttendanceMode";
  return undefined;
}

/** The official listing, when the record has one (the live pulls do). */
const officialUrl = (h: Hack): string | undefined => {
  const url = (h as { url?: unknown }).url;
  return typeof url === "string" && url.startsWith("http") ? url : undefined;
};

export function hackathonEntity(h: Hack): JsonLd {
  const url = canonical(`/hackathons/${h.id}`);
  const start = isoDate(h.start);
  const end = isoDate(h.deadline);
  const organizer = {
    "@type": "Organization",
    name: h.org,
    url: githubOrg(h.orgLogo),
    logo: avatar(h.orgLogo),
  };
  const mode = attendanceMode(h.format);

  if (start) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "@id": url,
      name: h.name,
      url,
      description: h.theme,
      startDate: start,
      ...(end ? { endDate: end } : {}),
      eventStatus: EVENT_STATUS[h.status],
      ...(mode ? { eventAttendanceMode: mode } : {}),
      organizer,
      ...(officialUrl(h) ? { sameAs: officialUrl(h) } : {}),
    };
  }

  // No real start date in the data, so this is not an Event yet.
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": url,
    name: h.name,
    url,
    description: h.theme,
    keywords: h.tags.join(", "),
    provider: organizer,
    ...(end ? { expires: end } : {}),
    ...(officialUrl(h) ? { sameAs: officialUrl(h) } : {}),
  };
}

export function organizationEntity(o: Org): JsonLd {
  const url = canonical(`/organizations/${o.login}`);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": url,
    name: o.name || o.login,
    alternateName: o.login,
    url,
    description: o.tagline,
    logo: avatar(o.login),
    // realOrgs stores the bare hostname, so the scheme is added here
    sameAs: [githubOrg(o.login), ...(o.domain ? [`https://${o.domain}`] : [])],
    knowsAbout: o.tags,
  };
}
