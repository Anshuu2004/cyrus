import { beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  backendReady: vi.fn(),
  upsertUser: vi.fn(),
  setSession: vi.fn(),
  checkCode: vi.fn(),
}));
vi.mock("@/lib/server/auth", () => ({
  backendReady: m.backendReady,
  upsertUser: m.upsertUser,
  setSession: m.setSession,
  publicUser: (u: { id: string; name: string }) => ({ id: u.id, name: u.name }),
}));
vi.mock("@/lib/server/email", async (orig) => ({
  ...(await orig<typeof import("@/lib/server/email")>()),
  checkCode: m.checkCode,
}));

import { POST } from "./route";

const post = (body: unknown) =>
  POST(new Request("http://x/api/auth/email/verify", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }));
const good = { email: "Sam@Example.com", code: "123456" };

beforeEach(() => {
  m.backendReady.mockReset().mockReturnValue(true);
  m.upsertUser.mockReset().mockResolvedValue({ id: "u1", name: "Sam" });
  m.setSession.mockReset().mockResolvedValue(undefined);
  m.checkCode.mockReset().mockResolvedValue({ ok: true });
});

describe("POST /api/auth/email/verify", () => {
  it("rejects malformed email or code without checking anything", async () => {
    for (const body of [{ email: "x", code: "123456" }, { email: "a@b.co", code: "12345" }, { email: "a@b.co", code: "abcdef" }, "{bad"]) {
      expect(await (await post(body)).json()).toEqual({ ok: false, reason: "wrong" });
    }
    expect(m.checkCode).not.toHaveBeenCalled();
  });

  it("passes a wrong code through with the re-signed challenge", async () => {
    m.checkCode.mockResolvedValue({ ok: false, reason: "wrong", challenge: "new-env" });
    expect(await (await post({ ...good, challenge: "old-env" })).json()).toEqual({ ok: false, reason: "wrong", challenge: "new-env" });
    expect(m.checkCode).toHaveBeenCalledWith("sam@example.com", "123456", "old-env");
    expect(m.setSession).not.toHaveBeenCalled();
  });

  it("creates the user and a session when the backend is ready", async () => {
    const res = await post({ ...good, name: " Sam S " });
    expect(await res.json()).toEqual({ ok: true, user: { id: "u1", name: "Sam" } });
    expect(m.upsertUser).toHaveBeenCalledWith({ provider: "email", providerId: "sam@example.com", name: "Sam S", email: "sam@example.com" });
    expect(m.setSession).toHaveBeenCalledWith({ uid: "u1", name: "Sam", provider: "email" });
  });

  it("signs in locally (offline) when there is no backend", async () => {
    m.backendReady.mockReturnValue(false);
    const body = await (await post(good)).json();
    expect(body).toMatchObject({ ok: true, offline: true, user: { id: "email:sam@example.com", name: "sam", provider: "email" } });
    expect(m.upsertUser).not.toHaveBeenCalled();
  });
});
