/* ══ email.test.ts — verification-code logic (memory store path) ═══
   No DATABASE_URL in the test env, so storeCode/checkCode exercise the
   in-memory fallback: round-trip, single-use burn, wrong tries lockout
   and the 30s resend lock.                                            ═ */
import { describe, expect, it } from "vitest";
import { checkCode, genCode, normalizeEmail, storeCode, validEmail, __mem } from "./email";

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
