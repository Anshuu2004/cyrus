import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

afterEach(() => vi.unstubAllEnvs());

describe("GET /api/health", () => {
  it("reports everything off when nothing is configured", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("SESSION_SECRET", "");
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ ok: true, db: false, auth: false });
    expect(typeof body.time).toBe("string");
  });

  it("reports db and auth when both are set", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://example");
    vi.stubEnv("SESSION_SECRET", "a-secret-longer-than-16");
    expect(await (await GET()).json()).toMatchObject({ db: true, auth: true });
  });

  it("does not count a short session secret as auth", async () => {
    vi.stubEnv("SESSION_SECRET", "short");
    expect((await (await GET()).json()).auth).toBe(false);
  });
});
