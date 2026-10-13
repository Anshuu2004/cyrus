/* ══ gen-hack-art.ts — 161 dreamy pastel-aurora cover images ═══════════
   Renders one unique soft gradient-mesh artwork per hackathon (the style
   the user pasted: mint/teal/peach/lavender fields melting into cream),
   writes them to public/assets/hack/art/{n}.webp and regenerates
   src/data/hackArt.ts mapping event id -> image path. Deterministic:
   each composition is seeded from the event id, so reruns are stable.
   Run: npx tsx scripts/gen-hack-art.ts                                        ═ */
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { HACKS } from "../src/data/hackathons";
import { HACKS_LIVE } from "../src/data/hackathonsLive";

const hash = (str: string): number => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const PASTELS = [
  "#bfe3d2", "#a8d5ba", "#7fc8c9", "#a8d8ea", "#cfc3ea", "#d4c5f9",
  "#f7c8d4", "#f6cfae", "#f8b195", "#ffe9b3", "#e8d9f8", "#bde0fe",
  "#ffd6a5", "#c2e59c", "#e2c6ff", "#ffccb6", "#b8e0d2", "#f5c6aa",
];

const W = 660, H = 440;

const art = (id: string): string => {
  let s = (hash(id) * 2654435761) % 2147483647 || 987654321;
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647;
  const pick = () => PASTELS[Math.floor(rnd() * PASTELS.length)];

  const blobs = Array.from({ length: 8 + Math.floor(rnd() * 4) }, (_, i) => ({
    cx: rnd() * W, cy: rnd() * H, rx: 130 + rnd() * 240, ry: 100 + rnd() * 200,
    rot: rnd() * 180, c: pick(), o: .5 + rnd() * .45, i,
  }));
  const ribbons = Array.from({ length: 2 + Math.floor(rnd() * 2) }, (_, i) => {
    const y = 60 + rnd() * (H - 120);
    return { d: `M-60 ${y} C ${W * .28} ${y - 90 - rnd() * 90}, ${W * .68} ${y + 80 + rnd() * 100}, ${W + 60} ${y - 30 - rnd() * 60}`,
      w: 46 + rnd() * 70, c1: pick(), c2: pick(), o: .3 + rnd() * .3, i };
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="base"><stop offset="0" stop-color="#faf7f0"/><stop offset="1" stop-color="#efe9dc"/></radialGradient>
  ${blobs.map((b) => `<radialGradient id="g${b.i}"><stop offset="0" stop-color="${b.c}" stop-opacity="${b.o.toFixed(2)}"/><stop offset=".7" stop-color="${b.c}" stop-opacity="${(b.o * .45).toFixed(2)}"/><stop offset="1" stop-color="${b.c}" stop-opacity="0"/></radialGradient>`).join("")}
  ${ribbons.map((r) => `<linearGradient id="r${r.i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${r.c1}" stop-opacity="0"/><stop offset=".35" stop-color="${r.c1}" stop-opacity=".9"/><stop offset=".7" stop-color="${r.c2}" stop-opacity=".85"/><stop offset="1" stop-color="${r.c2}" stop-opacity="0"/></linearGradient>`).join("")}
  <filter id="dream" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="26"/></filter>
  <filter id="silk" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="13"/></filter>
  <clipPath id="cp"><rect width="${W}" height="${H}"/></clipPath>
</defs>
<g clip-path="url(#cp)">
  <rect width="${W}" height="${H}" fill="url(#base)"/>
  <g filter="url(#dream)">
    ${blobs.map((b) => `<ellipse cx="${b.cx.toFixed(0)}" cy="${b.cy.toFixed(0)}" rx="${b.rx.toFixed(0)}" ry="${b.ry.toFixed(0)}" fill="url(#g${b.i})" transform="rotate(${b.rot.toFixed(0)} ${b.cx.toFixed(0)} ${b.cy.toFixed(0)})"/>`).join("")}
  </g>
  <g filter="url(#silk)">
    ${ribbons.map((r) => `<path d="${r.d}" fill="none" stroke="url(#r${r.i})" stroke-width="${r.w.toFixed(0)}" stroke-linecap="round" opacity="${r.o.toFixed(2)}"/>`).join("")}
  </g>
  <ellipse cx="${(W * (.3 + rnd() * .4)).toFixed(0)}" cy="${(H * (.2 + rnd() * .25)).toFixed(0)}" rx="${(180 + rnd() * 140).toFixed(0)}" ry="${(90 + rnd() * 70).toFixed(0)}" fill="#ffffff" opacity="${(.16 + rnd() * .14).toFixed(2)}" filter="url(#dream)"/>
</g></svg>`;
};

const ids = [...HACKS, ...HACKS_LIVE].map((h) => h.id);
mkdirSync("public/assets/hack/art", { recursive: true });
const map: Record<string, string> = {};
for (let i = 0; i < ids.length; i++) {
  const file = `${i}.webp`;
  await sharp(Buffer.from(art(ids[i]))).webp({ quality: 78 }).toFile(`public/assets/hack/art/${file}`);
  map[ids[i]] = `/assets/hack/art/${file}`;
  if (i % 40 === 0) console.log(`${i}/${ids.length}`);
}
writeFileSync("src/data/hackArt.ts",
  `/* ══ hackArt.ts — generated pastel-aurora cover images per hackathon.
     Regenerate with: npx tsx scripts/gen-hack-art.ts                     ═ */\n` +
  `export const HACK_ART: Record<string, string> = ${JSON.stringify(map, null, 2)};\n`);
console.log(`wrote ${ids.length} covers + src/data/hackArt.ts`);
