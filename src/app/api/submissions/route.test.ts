import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const addSubmission = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db", () => ({ getDb: () => (process.env.DATABASE_URL ? {} : null), dbReady: () => true }));
vi.mock("@/lib/server/queries", async (orig) => ({
  ...(await orig<typeof import("@/lib/server/queries")>()),
  addSubmission,
}));

import { POST } from "./route";

let n = 0;
const post = (body: unknown, ip = `10.0.0.${++n}`) =>
  POST(new Request("http://x/api/submissions", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }));
const feedback = { kind: "feedback", payload: { text: "nice" } };

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "postgres://example");
  vi.stubEnv("SESSION_SECRET", "a-secret-longer-than-16");
  addSubmission.mockReset().mockResolvedValue({ id: "s1", createdAt: "now" });
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/submissions", () => {
  it("answers 503 when the backend is offline", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const res = await post(feedback);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "backend offline" });
  });

  it("stores a valid submission", async () => {
    const res = await post({ ...feedback, name: "Sam", email: "sam@example.com" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, id: "s1", createdAt: "now" });
    expect(addSubmission).toHaveBeenCalledWith({
      kind: "feedback", name: "Sam", email: "sam@example.com", payload: feedback.payload,
    });
  });

  it("rejects bad JSON, unknown kinds and bad payloads with 400", async () => {
    expect((await post("{nope")).status).toBe(400);
    expect((await post({ kind: "spam", payload: {} })).status).toBe(400);
    expect((await post({ kind: "feedback", payload: "text" })).status).toBe(400);
    expect((await post({ kind: "feedback" })).status).toBe(400);
    expect((await post({ kind: "feedback", payload: { blob: "x".repeat(20_000) } })).status).toBe(400);
    expect(addSubmission).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    const res = await post({ ...feedback, email: "not-an-email" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/email/);
  });

  it("requires an email and repo for org nominations", async () => {
    expect((await post({ kind: "org_nomination", payload: { repo: "a/b" } })).status).toBe(400);
    expect((await post({ kind: "org_nomination", email: "a@b.co", payload: {} })).status).toBe(400);
    const ok = await post({ kind: "org_nomination", email: "a@b.co", payload: { repo: "https://github.com/a/b" } });
    expect(ok.status).toBe(200);
  });

  it("returns 429 on the 7th request from one IP, but not for another IP", async () => {
    for (let i = 0; i < 6; i++) expect((await post(feedback, "9.9.9.9")).status).toBe(200);
    expect((await post(feedback, "9.9.9.9")).status).toBe(429);
    expect((await post(feedback, "8.8.8.8")).status).toBe(200);
  });
});
