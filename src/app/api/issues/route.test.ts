import { beforeEach, describe, expect, it, vi } from "vitest";

const loadIndex = vi.hoisted(() => vi.fn());
vi.mock("@/lib/server/issueIndex", async (orig) => ({
  ...(await orig<typeof import("@/lib/server/issueIndex")>()),
  loadIndex,
}));

import { GET } from "./route";

const row = (n: number, t: string) => ({ r: "o/r", n, t, l: ["good first issue"], g: "TypeScript", s: 5, u: 1, c: 1, m: 0, a: 0, b: 1 });
const index = { meta: { generated: "2026-01-01" }, items: [row(1, "fix the parser"), row(2, "add docs")] };

let n = 0;
const get = (qs = "", ip = `10.1.0.${++n}`) =>
  GET(new Request(`http://x/api/issues${qs}`, { headers: { "x-forwarded-for": ip } }));

beforeEach(() => loadIndex.mockReset().mockResolvedValue(index));

describe("GET /api/issues", () => {
  it("returns shaped issues with the snapshot meta", async () => {
    const res = await get();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.meta).toEqual(index.meta);
    expect(body.total).toBe(2);
    expect(body.issues[0]).toMatchObject({
      url: expect.stringMatching(/^https:\/\/github\.com\/o\/r\/issues\/\d$/),
      repo: "o/r", lang: "TypeScript", beginner: true,
    });
    expect(loadIndex).toHaveBeenCalledWith("http://x/");
  });

  it("is 503 when the index is not available", async () => {
    loadIndex.mockResolvedValue(null);
    const res = await get();
    expect(res.status).toBe(503);
    expect((await res.json()).error).toMatch(/not available/);
  });

  it("is 429 after 60 requests from one address", async () => {
    for (let i = 0; i < 60; i++) expect((await get("", "7.7.7.7")).status).toBe(200);
    expect((await get("", "7.7.7.7")).status).toBe(429);
    expect((await get("", "7.7.7.8")).status).toBe(200);
  });
});
