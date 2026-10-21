/* ══ HorizonBackdrop.tsx — the ridge the board sits on ════════════
   A dusk horizon drawn in SVG: a sky wash, the light sitting just below
   the far ridge, a sparse fixed star field, and three ridges that step
   down toward the viewer. Drawn rather than photographed because it has
   to stay legible beside the frame at every width, cost nothing on the
   wire, and pick up the light-theme tokens for free.

   The frame covers the middle of it, so the composition is built for the
   two side gutters: the crests break the edge of the board rather than
   hiding under it.

   If public/assets/hero-horizon.jpg exists, the build passes its URL in
   as `photo` and the photo is used instead, with the drawing kept as the
   layer underneath it.
   ═══════════════════════════════════════════════════════════════════ */

/* fixed so the sky never re-shuffles between renders */
const STARS: [number, number, number][] = [
  [58, 44, 1.3], [146, 112, 0.9], [228, 58, 1.2], [302, 148, 0.8], [376, 84, 1.5],
  [441, 26, 0.9], [508, 128, 1.0], [586, 70, 1.3], [651, 164, 0.8], [724, 40, 1.1],
  [798, 112, 1.4], [866, 62, 0.9], [934, 142, 1.1], [1008, 88, 0.8], [1082, 34, 1.3],
  [1148, 124, 1.0], [1218, 68, 1.4], [1288, 152, 0.8], [1352, 54, 1.2], [1408, 108, 0.9],
  [112, 192, 0.9], [268, 222, 1.1], [452, 204, 0.7], [688, 230, 0.9], [912, 210, 0.8],
  [1128, 226, 1.0], [1318, 200, 0.7], [28, 128, 1.1], [542, 18, 0.8], [1026, 16, 1.2],
];

/* three ridgelines, crests deliberately high enough to clear the board */
const FAR = "M0 262 L96 226 L188 258 L284 198 L392 246 L498 176 L604 232 L712 204 L820 250 L928 210 L1036 252 L1144 200 L1252 244 L1348 208 L1440 250 L1440 620 L0 620 Z";
const MID = "M0 344 L112 312 L228 352 L344 302 L468 346 L588 310 L712 354 L836 316 L958 356 L1082 314 L1204 350 L1322 318 L1440 352 L1440 620 L0 620 Z";
const NEAR = "M0 438 L148 412 L302 446 L462 410 L622 448 L784 414 L946 450 L1108 416 L1268 452 L1440 420 L1440 620 L0 620 Z";

export default function HorizonBackdrop({ photo }: { photo?: string }) {
  return (
    <div className="hero-horizon" aria-hidden="true">
      <svg viewBox="0 0 1440 620" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="hz-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="0.55" stopColor="var(--color-accent)" stopOpacity="0.035" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.14" />
          </linearGradient>
          {/* the light the ridges are silhouetted against */}
          <radialGradient id="hz-glow" cx="0.5" cy="0.44" r="0.5">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.3" />
            <stop offset="0.42" stopColor="var(--color-accent)" stopOpacity="0.13" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hz-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.1" />
            <stop offset="0.3" stopColor="var(--color-accent)" stopOpacity="0.6" />
            <stop offset="0.52" stopColor="var(--color-ember)" stopOpacity="0.8" />
            <stop offset="0.76" stopColor="var(--color-accent)" stopOpacity="0.5" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1440" height="620" fill="url(#hz-sky)" />
        <rect x="0" y="0" width="1440" height="620" fill="url(#hz-glow)" />

        <g fill="var(--star)">
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} opacity={0.14 + (i % 4) * 0.06} />
          ))}
        </g>

        {/* far ridge first, then its light line, so the band reads as the
            horizon rather than a stroke pasted over the mountain */}
        <path d={FAR} fill="var(--ridge-far)" />
        <path d={FAR} fill="none" stroke="url(#hz-band)" strokeWidth="1.5" />
        <path d={MID} fill="var(--ridge-mid)" />
        <path d={NEAR} fill="var(--ridge-near)" />
      </svg>

      {photo && <img src={photo} alt="" loading="lazy" />}
    </div>
  );
}
