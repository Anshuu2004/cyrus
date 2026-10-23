import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const queryRepos = vi.hoisted(() => vi.fn());
vi.mock("@/lib/server/queries", () => ({ queryRepos }));

import { GET } from "./route";

const get = (qs = "") => GET(new Request(`http://x/api/catalog/repos${qs}`));

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "postgres://example");
  vi.stubEnv("SESSION_SECRET", "a-secret-longer-than-16");
  queryRepos.mockReset().mockResolvedValue([{ id: 1 }, { id: 2 }]);
});
afterEach(() => vi.unstubAllEnvs());

describe("GET /api/catalog/repos", () => {
  it("is 503 when offline", async () => {
    vi.stubEnv("DATABASE_URL", "");
    expect((await get()).status).toBe(503);
  });

  it("returns rows with default paging", async () => {
    const body = await (await get()).json();
    expect(body).toEqual({ count: 2, page: 1, per: 24, repos: [{ id: 1 }, { id: 2 }] });
    expect(queryRepos).toHaveBeenCalledWith(expect.objectContaining({ page: 1, perPage: 24, cat: undefined }));
  });

  it("rejects an unknown category with 400", async () => {
    const res = await get("?cat=nope");
    expect(res.status).toBe(400);
    expect(queryRepos).not.toHaveBeenCalled();
  });

  it("clamps page and per, and sanitises filter words", async () => {
    await get("?cat=mcp&page=9999&per=500&q=a%25b_c%20d&domain=we!b&model=");
    expect(queryRepos).toHaveBeenCalledWith({
      cat: "mcp", q: "abcd", domain: "web", model: undefined, format: undefined, framework: undefined,
      page: 500, perPage: 60,
    });
    await get("?page=-3&per=abc");
    expect(queryRepos).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, perPage: 24 }));
  });

  it("is 500 when the query throws", async () => {
    queryRepos.mockRejectedValue(new Error("boom"));
    const res = await get();
    expect(res.status).toBe(500);
    expect((await res.json()).error).toContain("boom");
  });
});
