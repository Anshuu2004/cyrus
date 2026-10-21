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
      <svg viewBox="0 0 1440 620" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="hz-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--color-accent)" stopOpacity="0.06" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.2" />
          </linearGradient>
          {/* the light the ridges are silhouetted against */}
          <radialGradient id="hz-glow" cx="0.5" cy="0.42" r="0.58">
            <stop offset="0" stopColor="var(--color-ember)" stopOpacity="0.46" />
            <stop offset="0.34" stopColor="var(--color-accent)" stopOpacity="0.24" />
            <stop offset="0.68" stopColor="var(--color-accent)" stopOpacity="0.08" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hz-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.16" />
            <stop offset="0.28" stopColor="var(--color-accent)" stopOpacity="0.78" />
            <stop offset="0.5" stopColor="var(--color-ember)" stopOpacity="1" />
            <stop offset="0.74" stopColor="var(--color-accent)" stopOpacity="0.72" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="hz-band-soft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="0.4" stopColor="var(--color-accent)" stopOpacity="0.34" />
            <stop offset="0.62" stopColor="var(--color-accent)" stopOpacity="0.4" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1440" height="620" fill="url(#hz-sky)" />
        <rect x="0" y="0" width="1440" height="620" fill="url(#hz-glow)" />

        <g fill="var(--star)">
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} opacity={0.22 + (i % 4) * 0.09} />
          ))}
        </g>

        {/* far ridge first, then its light line, so the band reads as the
            horizon rather than a stroke pasted over the mountain. The nearer
            ridges get a fainter edge so the three planes stay separable. */}
        <path d={FAR} fill="var(--ridge-far)" />
        <path d={FAR} fill="none" stroke="url(#hz-band)" strokeWidth="2" />
        <path d={MID} fill="var(--ridge-mid)" />
        <path d={MID} fill="none" stroke="url(#hz-band-soft)" strokeWidth="1.25" />
        <path d={NEAR} fill="var(--ridge-near)" />
        <path d={NEAR} fill="none" stroke="url(#hz-band-soft)" strokeWidth="1" opacity="0.6" />
      </svg>

      {photo && <img src={photo} alt="" loading="lazy" />}
    </div>
  );
}
