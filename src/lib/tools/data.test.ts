/* ══ alias-aware search tests ═══════════════════════════════════════
   Run: npm test          (vitest, node environment, no browser)   ══ */
import { describe, expect, it } from "vitest";
import { searchTools } from "./data";

const ids = (q: string, limit = 8) => searchTools(q, limit).map((h) => h.tool.id);

describe("searchTools()", () => {
  it("finds Glassmorphism through its alias", () => {
    expect(ids("frosted glass")[0]).toBe("glassmorphism");
  });

  it("scores each word separately, so 'frosted glass card' still hits", () => {
    const hit = ids("frosted glass card");
    expect(hit[0]).toBe("glassmorphism");
    expect(hit).toContain("feature-card");
  });

  it("matches tags and summaries, not just names", () => {
    expect(ids("webhook")).toContain("webhooks-receive");
  });

  it("returns nothing for queries under two characters", () => {
    expect(searchTools("")).toEqual([]);
    expect(searchTools("a")).toEqual([]);
  });

  it("respects the limit", () => {
    expect(searchTools("card", 3).length).toBeLessThanOrEqual(3);
  });
});
