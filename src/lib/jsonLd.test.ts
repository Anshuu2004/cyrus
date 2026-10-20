/* ══ jsonLd.test.ts — the graph must not contain anything we invented ══
   The issue's acceptance criteria are one block per page and no fabricated
   dates, so both are asserted over the whole catalog rather than a sample. */
import { describe, expect, it } from "vitest";
import { PROGRAMS } from "@/data/orgs";
import { REAL_ORGS } from "@/data/realOrgs";
import { ALL_HACKS } from "@/lib/siteStats";
import { SITE_ORIGIN } from "@/lib/seo";
import {
  hackathonEntity,
  jsonLdScript,
  organizationEntity,
  programEntity,
  webSite,
  type JsonLd,
} from "@/lib/jsonLd";

const datesIn = (obj: JsonLd) =>
  JSON.stringify(obj).match(/\d{4}-\d{2}-\d{2}/g) ?? [];

describe("webSite", () => {
  it("points SearchAction at the route the hero search actually posts to", () => {
    const site = webSite();
    const action = site.potentialAction as JsonLd;
    const target = action.target as JsonLd;
    expect(action["@type"]).toBe("SearchAction");
    expect(target.urlTemplate).toBe(`${SITE_ORIGIN}/projects?q={search_term_string}`);
    expect(action["query-input"]).toBe("required name=search_term_string");
  });
});

describe("programEntity", () => {
  it("describes every tracked program with an absolute url", () => {
    for (const p of PROGRAMS) {
      const data = programEntity(p);
      expect(data["@type"]).toBe("Course");
      expect(data.name).toBe(p.name);
      expect(data.url).toBe(`${SITE_ORIGIN}/programs/${p.id}`);
      expect(String(data!.image)).toMatch(/^https?:\/\//);
    }
  });
});

describe("organizationEntity", () => {
  it("lists every catalogued org with its GitHub profile", () => {
    for (const o of REAL_ORGS) {
      const data = organizationEntity(o);
      expect(data["@type"]).toBe("Organization");
      expect(data.sameAs).toContain(`https://github.com/${o.login}`);
      expect(datesIn(data)).toEqual([]);
    }
  });
});

describe("hackathonEntity", () => {
  it("emits an Event only where the dataset states a real start date", () => {
    const withStart = ALL_HACKS.filter((h) => /^\d{4}-\d{2}-\d{2}/.test(h.start ?? ""));
    for (const h of ALL_HACKS) {
      const data = hackathonEntity(h);
      const expected = withStart.includes(h) ? "Event" : "CreativeWork";
      expect(data["@type"], `${h.id} typed itself ${data["@type"]}`).toBe(expected);
    }
  });

  it("never carries a date the record does not state", () => {
    for (const h of ALL_HACKS) {
      const data = hackathonEntity(h);
      const allowed = new Set([h.deadline?.slice(0, 10), h.start?.slice(0, 10)].filter(Boolean));
      for (const date of datesIn(data)) expect(allowed.has(date), `${h.id} invented ${date}`).toBe(true);
    }
  });

  it("keeps the deadline as the expiry on records without a start", () => {
    const sample = ALL_HACKS.find((h) => !h.start && /^\d{4}-\d{2}-\d{2}/.test(h.deadline))!;
    const data = hackathonEntity(sample)!;
    expect(data.expires).toBe(sample.deadline.slice(0, 10));
    expect(data.startDate).toBeUndefined();
  });
});

describe("jsonLdScript", () => {
  it("escapes anything that could close the script tag early", () => {
    const html = jsonLdScript({ name: "</script><img onerror=1>" }).__html;
    expect(html).not.toContain("</script>");
    expect(html).toContain("\\u003c");
    expect(JSON.parse(html)).toEqual({ name: "</script><img onerror=1>" });
  });
});
