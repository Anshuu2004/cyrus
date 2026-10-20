/* ══ email.test.ts — verification-code logic (memory store path) ═══
   No DATABASE_URL in the test env, so storeCode/checkCode exercise the
   in-memory fallback: round-trip, single-use burn, wrong tries lockout
   and the 30s resend lock. The send guard is here too, because the rule
   "a production deploy never gets a code in the response" belongs to the
   function that produces it, not only to the route that calls it.     ═ */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  checkCode, demoAllowed, genCode, normalizeEmail, resendConfigured, sendCodeEmail, storeCode, validEmail, __mem,
} from "./email";

const mail = () => `t${Math.random().toString(36).slice(2, 8)}@example.com`;

describe("email validators", () => {
  it("accepts normal addresses", () => {
    expect(validEmail("ada@lovelace.dev")).toBe(true);
    expect(validEmail("  You@Example.COM ")).toBe(true);
  });
  it("rejects junk", () => {
    expect(validEmail("")).toBe(false);
    expect(validEmail("no-at-sign")).toBe(false);
    expect(validEmail("a@b")).toBe(false);
    expect(validEmail("a b@c.io")).toBe(false);
  });
  it("normalizes trim + lowercase", () => {
    expect(normalizeEmail("  Ada@Lovalace.Dev ")).toBe("ada@lovalace.dev");
  });
  it("generates six digits", () => {
    for (let i = 0; i < 20; i++) expect(genCode()).toMatch(/^\d{6}$/);
  });
});

describe("code store (memory fallback)", () => {
  it("verifies the right code once, then burns it", async () => {
    const e = mail();
    expect(await storeCode(e, "123456")).toBe(true);
    expect(await checkCode(e, "123456")).toEqual({ ok: true });
    expect(await checkCode(e, "123456")).toEqual({ ok: false, reason: "no_code" });
  });

  it("rejects a wrong code without burning it", async () => {
    const e = mail();
    await storeCode(e, "246810");
    expect(await checkCode(e, "000000")).toEqual({ ok: false, reason: "wrong" });
    expect(await checkCode(e, "246810")).toEqual({ ok: true });
  });

  it("locks after six wrong tries", async () => {
    const e = mail();
    await storeCode(e, "111222");
    for (let i = 0; i < 6; i++) expect(await checkCode(e, "999999")).toEqual({ ok: false, reason: "wrong" });
    expect(await checkCode(e, "111222")).toEqual({ ok: false, reason: "locked" });
    expect(__mem.has(e)).toBe(false);
  });

  it("enforces the 30s resend lock", async () => {
    const e = mail();
    expect(await storeCode(e, "135790")).toBe(true);
    expect(await storeCode(e, "246810")).toBe(false);
  });

  it("reports no_code for an unknown address", async () => {
    expect(await checkCode(mail(), "123456")).toEqual({ ok: false, reason: "no_code" });
  });
});

describe("send guard", () => {
  const ENV_KEYS = ["RESEND_API_KEY", "VERCEL_ENV", "EMAIL_FROM"] as const;
  let saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    saved = {};
    for (const k of ENV_KEYS) { saved[k] = process.env[k]; delete process.env[k]; }
  });
  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it("reads configuration from the environment, not from a guess", () => {
    expect(resendConfigured()).toBe(false);
    expect(demoAllowed()).toBe(true); // NODE_ENV under vitest is "test"
    process.env.RESEND_API_KEY = "  ";
    expect(resendConfigured(), "whitespace is not a key").toBe(false);
    process.env.RESEND_API_KEY = "re_al-key";
    expect(resendConfigured()).toBe(true);
  });

  it("hands the code back where a developer is the only reader", async () => {
    expect(await sendCodeEmail(mail(), "123456")).toEqual({ sent: false, demo: true, code: "123456" });
    process.env.VERCEL_ENV = "preview";
    expect(await sendCodeEmail(mail(), "123456")).toEqual({ sent: false, demo: true, code: "123456" });
  });

  it("refuses to produce a demo result on a production deploy", async () => {
    process.env.VERCEL_ENV = "production";
    expect(demoAllowed()).toBe(false);
    const r = await sendCodeEmail(mail(), "123456");
    expect(r).toEqual({ sent: false, error: "RESEND_API_KEY is not configured" });
    expect("code" in r).toBe(false);
  });

  it("reads the deploy environment in the right order", () => {
    expect(demoAllowed({ NODE_ENV: "production" })).toBe(false);
    expect(demoAllowed({ NODE_ENV: "development" })).toBe(true);
    /* A Vercel preview build ships with NODE_ENV=production, and its
       response is still not the live site. VERCEL_ENV wins. */
    expect(demoAllowed({ NODE_ENV: "production", VERCEL_ENV: "preview" })).toBe(true);
    expect(demoAllowed({ NODE_ENV: "production", VERCEL_ENV: "production" })).toBe(false);
    expect(demoAllowed({})).toBe(true);
  });
});
