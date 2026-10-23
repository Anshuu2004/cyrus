import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({ backendReady: vi.fn(), upsertUser: vi.fn(), setSession: vi.fn() }));
vi.mock("@/lib/server/auth", () => ({
  OFFLINE: () => Response.json({ error: "backend offline" }, { status: 503 }),
  backendReady: m.backendReady,
  upsertUser: m.upsertUser,
  setSession: m.setSession,
  publicUser: (u: { id: string; name: string }) => ({ id: u.id, name: u.name }),
}));

import { POST } from "./route";

const fetchMock = vi.fn();
const post = (body: unknown) =>
  POST(new Request("http://x/api/auth/google", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }));
const tokeninfo = (data: unknown, ok = true) => fetchMock.mockResolvedValueOnce({ ok, json: () => Promise.resolve(data) });
const claims = { iss: "https://accounts.google.com", aud: "gid", sub: "123", name: "Sam", email: "sam@example.com", picture: "p" };

beforeEach(() => {
  m.backendReady.mockReset().mockReturnValue(true);
  m.upsertUser.mockReset().mockResolvedValue({ id: "u1", name: "Sam" });
  m.setSession.mockReset().mockResolvedValue(undefined);
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "gid");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/auth/google", () => {
  it("is 503 when offline", async () => {
    m.backendReady.mockReturnValue(false);
    expect((await post({ idToken: "t" })).status).toBe(503);
  });

  it("is 500 without a client id", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "");
    expect((await post({ idToken: "t" })).status).toBe(500);
  });

  it("is 400 without an idToken", async () => {
    expect((await post({})).status).toBe(400);
    expect((await post("{bad")).status).toBe(400);
  });

  it("is 401 for a wrong audience, wrong issuer, or failed tokeninfo", async () => {
    tokeninfo({ ...claims, aud: "someone-else" });
    expect((await post({ idToken: "t" })).status).toBe(401);
    tokeninfo({ ...claims, iss: "https://evil.example" });
    expect((await post({ idToken: "t" })).status).toBe(401);
    tokeninfo({}, false);
    expect((await post({ idToken: "t" })).status).toBe(401);
    expect(m.setSession).not.toHaveBeenCalled();
  });

  it("verifies the token, upserts the user and starts a session", async () => {
    tokeninfo(claims);
    const res = await post({ idToken: "a b" });
    expect(await res.json()).toEqual({ ok: true, user: { id: "u1", name: "Sam" } });
    expect(fetchMock.mock.calls[0][0]).toContain("id_token=a%20b");
    expect(m.upsertUser).toHaveBeenCalledWith(expect.objectContaining({ provider: "google", providerId: "123", email: "sam@example.com" }));
    expect(m.setSession).toHaveBeenCalledWith({ uid: "u1", name: "Sam", provider: "google" });
  });
});
