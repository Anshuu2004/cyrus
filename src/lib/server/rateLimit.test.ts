/* ══ rateLimit.test.ts — the counter the auth routes lean on ══════
   Every case drives `now` by hand. A window that only moves when the
   clock moves is the whole point, so nothing here waits or sleeps. ═ */
import { beforeEach, describe, expect, it } from "vitest";
import { __buckets, __reset, peek, record, take } from "./rateLimit";

const MIN = 60_000;
const KEY = "ip:203.0.113.7";
const T0 = 1_700_000_000_000;

beforeEach(() => __reset());

describe("take", () => {
  it("lets exactly limit requests through", () => {
    for (let i = 0; i < 3; i++) expect(take(KEY, 3, MIN, T0)).toEqual({ allowed: true });
    expect(take(KEY, 3, MIN, T0).allowed).toBe(false);
  });

  it("reports how long until the window closes", () => {
    for (let i = 0; i < 3; i++) take(KEY, 3, MIN, T0);
    const v = take(KEY, 3, MIN, T0 + 40_000);
    expect(v.allowed).toBe(false);
    if (!v.allowed) expect(v.retryAfterSeconds).toBe(20);
  });

  it("opens the next window without carrying the old count", () => {
    for (let i = 0; i < 3; i++) take(KEY, 3, MIN, T0);
    expect(take(KEY, 3, MIN, T0 + MIN)).toEqual({ allowed: true });
  });

  it("does not extend a block just because the caller kept knocking", () => {
    for (let i = 0; i < 3; i++) take(KEY, 3, MIN, T0);
    for (let s = 10; s < 50; s += 10) {
      const v = take(KEY, 3, MIN, T0 + s * 1000);
      expect(v.allowed).toBe(false);
      if (!v.allowed) expect(v.retryAfterSeconds).toBe(MIN / 1000 - s);
    }
  });

  it("keeps one caller's budget away from another's", () => {
    for (let i = 0; i < 3; i++) take("ip:1.1.1.1", 3, MIN, T0);
    expect(take("ip:1.1.1.1", 3, MIN, T0).allowed).toBe(false);
    expect(take("ip:9.9.9.9", 3, MIN, T0)).toEqual({ allowed: true });
  });
});

describe("peek and record", () => {
  it("asks the same question without spending the slot", () => {
    take(KEY, 1, MIN, T0);
    expect(peek(KEY, 1, T0).allowed).toBe(false);
    expect(peek(KEY, 1, T0).allowed).toBe(false);
  });

  it("says yes to a key nobody has hit yet", () => {
    expect(peek(KEY, 1, T0)).toEqual({ allowed: true });
  });

  it("opens no window when it is only asked", () => {
    peek(KEY, 2, T0);
    expect(__buckets.size).toBe(0);
  });

  it("records a hit for a cap the caller already checked", () => {
    expect(peek(KEY, 2, T0).allowed).toBe(true);
    record(KEY, MIN, T0);
    expect(peek(KEY, 2, T0).allowed).toBe(true);
    record(KEY, MIN, T0);
    expect(peek(KEY, 2, T0).allowed).toBe(false);
  });
});

describe("housekeeping", () => {
  it("keeps live buckets and drops idle ones when the map outgrows itself", () => {
    for (let i = 0; i < 600; i++) record(`ip:10.0.${Math.floor(i / 256)}.${i % 256}`, 1_000, T0);
    expect(__buckets.size).toBe(600);
    /* one hit three seconds later, with a one-second window: every bucket
       above is two windows stale and goes. */
    record("ip:later", 1_000, T0 + 3_000);
    expect(__buckets.size).toBe(1);
    expect(__buckets.has("ip:later")).toBe(true);
  });
});
