/* Throwaway mobile audit - 390px viewport, overflow report + screenshots to /tmp/shots */
import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";
import { homedir } from "os";

const SHELL = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`;

const PAGES: [string, string][] = [
  ["/", "home"],
  ["/tools", "tools-home"],
  ["/tools/browse", "tools-browse"],
  ["/tools/ui-design", "tools-cat"],
  ["/tools/typography-colour/typography", "tools-sub"],
  ["/tools/ui-design/effects/glassmorphism", "tool-detail"],
  ["/tools/ai-prompting/model-picker/aipick-small-fast", "tool-guide"],
  ["/tools/builder", "builder"],
  ["/apis", "apis"],
  ["/assistant", "assistant"],
  ["/dashboard", "dashboard"],
  ["/dashboard/watchlist", "dash-feature"],
  ["/platform/features", "features"],
  ["/platform/nova", "platform-nova"],
  ["/platform/how", "platform-how"],
  ["/platform/trust", "platform-trust"],
  ["/hackathons", "hackathons"],
  ["/opensource", "opensource"],
  ["/projects", "projects"],
  ["/organizations", "organizations"],
  ["/resources", "resources"],
  ["/about", "about"],
  ["/nova", "nova"],
  ["/affiliations", "affiliations"],
];

(async () => {
  const only = process.argv[2]; // optional: filter to page names, comma list
  const pages = only ? PAGES.filter(([, n]) => only.split(",").includes(n)) : PAGES;
  const vw = Number(process.env.MVW || 390);
  mkdirSync("/tmp/shots", { recursive: true });
  const browser = await chromium.launch({ executablePath: SHELL });
  const ctx = await browser.newContext({ viewport: { width: vw, height: 844 }, deviceScaleFactor: 2, isMobile: vw < 500, hasTouch: true });
  const results: string[] = [];
  for (const [path, name] of pages) {
    const page = await ctx.newPage();
    const errs: string[] = [];
    page.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
    try {
      const res = await page.goto("http://localhost:5330" + path, { waitUntil: "load", timeout: 25000 });
      await page.waitForTimeout(3000);
      const info = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const bad: string[] = [];
        document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > vw + 2 && !el.closest("[class*='overflow-x-auto'],pre,style")) {
            const cls = (el.className || "").toString().slice(0, 70);
            bad.push(`${el.tagName.toLowerCase()}.${cls} w=${Math.round(r.width)}`);
          }
        });
        return { vw, sw, bad: bad.slice(0, 5) };
      });
      results.push(`${path} [${name}] ${res?.status()} scrollW=${info.sw}/${info.vw}${info.sw > info.vw + 1 ? " OVERFLOW" : ""}${info.bad.length ? "\n   " + info.bad.join("\n   ") : ""}${errs.length ? "\n   ERR " + errs.join("; ") : ""}`);
      await page.screenshot({ path: `/tmp/shots/${name}.png` });
    } catch (e) {
      results.push(`${path} [${name}] FAILED ${String(e).slice(0, 140)}`);
    }
    await page.close();
  }
  await browser.close();
  console.log(results.join("\n"));
})();
