/* ══ route.test.ts — the three ceilings in front of a sign-in code ══
   The test env has no DATABASE_URL and, below, no RESEND_API_KEY, so the
   route runs the memory store and the demo send path exactly as a fresh
   local clone does. NODE_ENV under vitest is "test", which is not a
   production deploy, so demo mode is allowed unless a case says
   otherwise. Each case starts from empty counters and an empty store. ═ */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { __mem } from "@/lib/server/email";
import { __reset } from "@/lib/server/rateLimit";
import { POST } from "./route";

/* The numbers the route header documents. They live here on purpose: if a
   change to the route does not also change the copy in its header, this
   file fails, which is the point of quoting them rather than importing. */
const IP_LIMIT = 8;
const ADDRESS_DAILY_LIMIT = 12;

type Body = Record<string, unknown> & { ok?: boolean; reason?: string; code?: string };

const ask = async (email: string, ip = "203.0.113.7"): Promise<{ res: Response; body: Body }> => {
  const res = await POST(
    new Request("http://localhost/api/auth/email/start", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({ email }),
    }),
  );
  return { res, body: (await res.json()) as Body };
};

/* a different address per call, so the 30s resend lock never masks a
   ceiling being tested */
let n = 0;
const mail = () => `burst${(n += 1)}@example.com`;

const ENV_KEYS = ["RESEND_API_KEY", "VERCEL_ENV"] as const;
let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = {};
  for (const k of ENV_KEYS) saved[k] = process.env[k];
  for (const k of ENV_KEYS) delete process.env[k];
  __reset();
  __mem.clear();
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("POST /api/auth/email/start", () => {
  it("issues a demo code where a code cannot be emailed", async () => {
    const { res, body } = await ask(mail());
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.demo).toBe(true);
    expect(body.code).toMatch(/^\d{6}$/);
  });

  it("keeps the 30s resend lock as a 200 with a reason", async () => {
    const e = mail();
    expect((await ask(e)).body.ok).toBe(true);
    const second = await ask(e);
    expect(second.res.status).toBe(200);
    expect(second.body).toMatchObject({ ok: false, reason: "too_soon", retry_in_seconds: 30 });
  });

  it("does not spend a caller's budget on an address that is not valid", async () => {
    for (let i = 0; i < IP_LIMIT + 4; i++) {
      const { res } = await ask("not-an-email");
      expect(res.status).toBe(200);
    }
    const { res, body } = await ask(mail());
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it("gives a burst of 20 from one IP exactly the documented allowance", async () => {
    const results = [];
    for (let i = 0; i < 20; i++) results.push(await ask(mail()));
    const through = results.filter((r) => r.res.status === 200);
    const blocked = results.filter((r) => r.res.status === 429);
    expect(through).toHaveLength(IP_LIMIT);
    expect(blocked).toHaveLength(20 - IP_LIMIT);
    for (const b of blocked) {
      expect(b.body).toMatchObject({ ok: false, reason: "rate_limited" });
      expect(Number(b.res.headers.get("retry-after"))).toBeGreaterThan(0);
      expect(b.body.code).toBeUndefined();
    }
  });

  it("holds one IP's ceiling apart from another's", async () => {
    for (let i = 0; i < IP_LIMIT; i++) await ask(mail(), "198.51.100.1");
    expect((await ask(mail(), "198.51.100.1")).res.status).toBe(429);
    expect((await ask(mail(), "198.51.100.2")).res.status).toBe(200);
  });

  it("caps one address at its daily allowance however many IPs it uses", async () => {
    const e = "daily@example.com";
    for (let i = 0; i < ADDRESS_DAILY_LIMIT; i++) {
      const { res } = await ask(e, `192.0.2.${i}`);
      expect(res.status).toBe(200);
      /* clear the stored code so the 30s lock is not what stops request 13 */
      __mem.delete(e);
    }
    const { res, body } = await ask(e, "192.0.2.200");
    expect(res.status).toBe(429);
    expect(body).toMatchObject({ ok: false, reason: "daily_limit" });
    expect(Number(res.headers.get("retry-after"))).toBeGreaterThan(20 * 3600);
  });

  it("fails closed on a production deploy with no key, and never returns a code", async () => {
    process.env.VERCEL_ENV = "production";
    const { res, body } = await ask(mail());
    expect(res.status).toBe(503);
    expect(body).toEqual({ ok: false, reason: "mail_unconfigured" });
    expect("code" in body).toBe(false);
    expect(JSON.stringify(body)).not.toMatch(/\b\d{6}\b/);
  });

  it("does not store a code it could not have sent", async () => {
    process.env.VERCEL_ENV = "production";
    await ask("never-stored@example.com");
    expect(__mem.has("never-stored@example.com")).toBe(false);
  });

  it("keeps demo mode on a preview deploy, where the response is ours", async () => {
    process.env.VERCEL_ENV = "preview";
    const { res, body } = await ask(mail());
    expect(res.status).toBe(200);
    expect(body.demo).toBe(true);
  });

  it("sends for real once a key exists, even in production", async () => {
    process.env.VERCEL_ENV = "production";
    process.env.RESEND_API_KEY = "test-key-not-a-real-one";
    const fetches: RequestInit[] = [];
    const realFetch = globalThis.fetch;
    globalThis.fetch = ((_input: string | URL | Request, init?: RequestInit) => {
      fetches.push(init ?? {});
      return Promise.resolve(new Response("{}", { status: 200 }));
    }) as typeof fetch;
    try {
      const { res, body } = await ask(mail());
      expect(res.status).toBe(200);
      expect(body).toEqual({ ok: true, sent: true, expires_in_seconds: 600 });
      expect(fetches).toHaveLength(1);
      expect(JSON.stringify(body)).not.toMatch(/\b\d{6}\b/);
    } finally {
      globalThis.fetch = realFetch;
    }
  });
});
