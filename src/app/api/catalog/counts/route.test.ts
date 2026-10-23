import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const catalogCounts = vi.hoisted(() => vi.fn());
vi.mock("@/lib/server/queries", () => ({ catalogCounts }));

import { GET } from "./route";

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "postgres://example");
  vi.stubEnv("SESSION_SECRET", "a-secret-longer-than-16");
  catalogCounts.mockReset();
});
afterEach(() => vi.unstubAllEnvs());

describe("GET /api/catalog/counts", () => {
  it("is 503 when the backend is offline", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const res = await GET();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "backend offline" });
  });

  it("returns counts with a snapshot timestamp", async () => {
    catalogCounts.mockResolvedValue({ repos: 10, orgs: 3 });
    const body = await (await GET()).json();
    expect(body.counts).toEqual({ repos: 10, orgs: 3 });
    expect(Number.isNaN(Date.parse(body.snapshot))).toBe(false);
  });

  it("is 500 when the query throws", async () => {
    catalogCounts.mockRejectedValue(new Error("db down"));
    const res = await GET();
    expect(res.status).toBe(500);
    expect((await res.json()).error).toContain("db down");
  });
});
