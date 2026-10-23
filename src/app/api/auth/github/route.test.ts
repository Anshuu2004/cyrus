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

const post = (body: unknown) =>
  POST(new Request("http://x/api/auth/github", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }));
const reply = (data: unknown, ok = true) => Promise.resolve({ ok, json: () => Promise.resolve(data) });
const fetchMock = vi.fn();

beforeEach(() => {
  m.backendReady.mockReset().mockReturnValue(true);
  m.upsertUser.mockReset().mockResolvedValue({ id: "u1", name: "Octo" });
  m.setSession.mockReset().mockResolvedValue(undefined);
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("NEXT_PUBLIC_GITHUB_CLIENT_ID", "cid");
  vi.stubEnv("GITHUB_CLIENT_SECRET", "csecret");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/auth/github", () => {
  it("is 503 when the backend is offline", async () => {
    m.backendReady.mockReturnValue(false);
    expect((await post({ code: "c", verifier: "v" })).status).toBe(503);
  });

  it("is 500 when OAuth is not configured", async () => {
    vi.stubEnv("GITHUB_CLIENT_SECRET", "");
    expect((await post({ code: "c", verifier: "v" })).status).toBe(500);
  });

  it("is 400 without code and verifier", async () => {
    expect((await post({ code: "c" })).status).toBe(400);
    expect((await post("{bad")).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is 401 when GitHub rejects the code", async () => {
    fetchMock.mockReturnValueOnce(reply({ error: "bad_verification_code" }));
    expect((await post({ code: "c", verifier: "v" })).status).toBe(401);
    expect(m.setSession).not.toHaveBeenCalled();
  });

  it("is 401 when the profile cannot be read", async () => {
    fetchMock.mockReturnValueOnce(reply({ access_token: "t" })).mockReturnValueOnce(reply({}, false));
    expect((await post({ code: "c", verifier: "v" })).status).toBe(401);
  });

  it("exchanges the code, upserts the user and starts a session", async () => {
    fetchMock
      .mockReturnValueOnce(reply({ access_token: "t" }))
      .mockReturnValueOnce(reply({ id: 7, login: "octo", name: null, email: null, avatar_url: "http://a/p.png" }));
    const res = await post({ code: "c", verifier: "v" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, user: { id: "u1", name: "Octo" } });
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent).toMatchObject({ client_id: "cid", client_secret: "csecret", code: "c", code_verifier: "v" });
    expect(m.upsertUser).toHaveBeenCalledWith(expect.objectContaining({ provider: "github", providerId: "7", login: "octo", name: "octo" }));
    expect(m.setSession).toHaveBeenCalledWith({ uid: "u1", name: "Octo", provider: "github" });
  });
});
