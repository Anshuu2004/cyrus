/* ══ route.test.ts — code guessing has a per-IP ceiling too ══════
   checkCode() locks an address after six wrong tries, which is the guard
   this route had before. Cycling addresses got around it. These cases pin
   the part that closes that: the attempts-per-IP window.              ═ */
import { beforeEach, describe, expect, it } from "vitest";
import { __mem, storeCode } from "@/lib/server/email";
import { __reset } from "@/lib/server/rateLimit";
import { POST } from "./route";

const IP_LIMIT = 30;

const attempt = async (ip: string, email: string, code = "000000") => {
  const res = await POST(
    new Request("http://localhost/api/auth/email/verify", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({ email, code }),
    }),
  );
  return { res, body: (await res.json()) as Record<string, unknown> };
};

beforeEach(() => {
  __reset();
  __mem.clear();
});

describe("POST /api/auth/email/verify", () => {
  it("still trades a correct code for a session", async () => {
    await storeCode("ada@lovelace.dev", "481920");
    const { res, body } = await attempt("198.51.100.9", "ada@lovelace.dev", "481920");
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it("answers the first IP_LIMIT attempts however the code fares", async () => {
    for (let i = 0; i < IP_LIMIT; i++) {
      const { res } = await attempt("198.51.100.10", `guesser${i}@example.com`);
      expect(res.status, `attempt ${i + 1}`).toBe(200);
    }
  });

  it("blocks attempt 31 from one IP even across 31 different addresses", async () => {
    for (let i = 0; i < IP_LIMIT; i++) await attempt("198.51.100.11", `guesser${i}@example.com`);
    const { res, body } = await attempt("198.51.100.11", "last@example.com");
    expect(res.status).toBe(429);
    expect(body).toMatchObject({ ok: false, reason: "rate_limited" });
    expect(Number(res.headers.get("retry-after"))).toBeGreaterThan(0);
  });

  it("leaves a different IP alone", async () => {
    for (let i = 0; i < IP_LIMIT; i++) await attempt("198.51.100.11", `guesser${i}@example.com`);
    const { res } = await attempt("198.51.100.99", "someone@example.com");
    expect(res.status).toBe(200);
  });

  it("rejects a malformed code without touching the store", async () => {
    const { res, body } = await attempt("198.51.100.12", "someone@example.com", "12");
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ ok: false, reason: "wrong" });
    expect(__mem.size).toBe(0);
  });
});
