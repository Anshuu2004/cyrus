/* ══ HorizonBackdrop.tsx — six nature scenes behind the board ══
   The hero sits on a landscape, and the landscape is not the same on
   every visit: six scenes (alpine dawn, forest mist, ocean dusk,
   desert night, aurora, monsoon) rotate per refresh, each drawn in
   SVG so it costs nothing on the wire and picks up the theme tokens.

   Every scene is the same composition - sky wash, a light source, a
   sparse star field where the scene is a night one, and three ridges
   stepping toward the viewer - so the frame always reads the same way
   against it. Only the palette and the light change.
   ═══════════════════════════════════════════════════════════ */

export type Scene = {
  id: string;
  name: string;
  sky: [string, string];
  glow: string;
  glowAt: [number, number];
  ridges: [string, string, string];
  edge: string;
  stars: number;      /* 0 = day scene, otherwise star density 1-3 */
  sun?: { x: number; y: number; r: number; c: string };
  bands?: boolean;    /* horizontal light bands (ocean, monsoon) */
};

export const SCENES: Scene[] = [
  {
    id: "alpine", name: "Alpine dawn",
    sky: ["#0b1220", "#1b2a3d"], glow: "#f5c98a", glowAt: [0.5, 0.46],
    ridges: ["#2c3a4c", "#1d2836", "#131a24"], edge: "#f5c98a",
    stars: 1, sun: { x: 720, y: 250, r: 34, c: "#f8d9a8" },
  },
  {
    id: "forest", name: "Forest mist",
    sky: ["#08120e", "#12241c"], glow: "#7ee0a8", glowAt: [0.42, 0.5],
    ridges: ["#1d3a2c", "#142a20", "#0d1c16"], edge: "#8ce8b4",
    stars: 0, bands: true,
  },
  {
    id: "ocean", name: "Ocean dusk",
    sky: ["#0a1020", "#173049"], glow: "#7fb4e8", glowAt: [0.58, 0.44],
    ridges: ["#1e3a55", "#152a3e", "#0e1c2a"], edge: "#9cc8f0",
    stars: 1, bands: true, sun: { x: 880, y: 236, r: 26, c: "#cfe4f7" },
  },
  {
    id: "desert", name: "Desert night",
    sky: ["#140f0b", "#2a1d13"], glow: "#e8b06a", glowAt: [0.5, 0.42],
    ridges: ["#3a2a1c", "#281c12", "#1a120c"], edge: "#e8b06a",
    stars: 3,
  },
  {
    id: "aurora", name: "Aurora",
    sky: ["#070d14", "#0f2430"], glow: "#5eead4", glowAt: [0.36, 0.34],
    ridges: ["#17323a", "#10242b", "#0a181d"], edge: "#7df0d8",
    stars: 2,
  },
  {
    id: "monsoon", name: "Monsoon",
    sky: ["#0b1116", "#1a2630"], glow: "#9fb6c8", glowAt: [0.62, 0.4],
    ridges: ["#26343f", "#1a252e", "#111a20"], edge: "#b8ccd9",
    stars: 0, bands: true,
  },
];

/* fixed so a scene never re-shuffles between renders */
const STARS: [number, number, number][] = [
  [58, 44, 1.3], [146, 112, 0.9], [228, 58, 1.2], [302, 148, 0.8], [376, 84, 1.5],
  [441, 26, 0.9], [508, 128, 1.0], [586, 70, 1.3], [651, 164, 0.8], [724, 40, 1.1],
  [798, 112, 1.4], [866, 62, 0.9], [934, 142, 1.1], [1008, 88, 0.8], [1082, 34, 1.3],
  [1148, 124, 1.0], [1218, 68, 1.4], [1288, 152, 0.8], [1352, 54, 1.2], [1408, 108, 0.9],
  [112, 192, 0.9], [268, 222, 1.1], [452, 204, 0.7], [688, 230, 0.9], [912, 210, 0.8],
  [1128, 226, 1.0], [1318, 200, 0.7], [28, 128, 1.1], [542, 18, 0.8], [1026, 16, 1.2],
];

const FAR = "M0 262 L96 226 L188 258 L284 198 L392 246 L498 176 L604 232 L712 204 L820 250 L928 210 L1036 252 L1144 200 L1252 244 L1348 208 L1440 250 L1440 620 L0 620 Z";
const MID = "M0 344 L112 312 L228 352 L344 302 L468 346 L588 310 L712 354 L836 316 L958 356 L1082 314 L1204 350 L1322 318 L1440 352 L1440 620 L0 620 Z";
const NEAR = "M0 438 L148 412 L302 446 L462 410 L622 448 L784 414 L946 450 L1108 416 L1268 452 L1440 420 L1440 620 L0 620 Z";

export function SceneArt({ s, uid }: { s: Scene; uid: string }) {
  const starCount = s.stars === 0 ? 0 : s.stars === 1 ? 14 : s.stars === 2 ? 22 : 30;
  return (
    <svg viewBox="0 0 1440 620" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.sky[0]} />
          <stop offset="1" stopColor={s.sky[1]} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx={s.glowAt[0]} cy={s.glowAt[1]} r="0.62">
          <stop offset="0" stopColor={s.glow} stopOpacity="0.4" />
          <stop offset="0.4" stopColor={s.glow} stopOpacity="0.16" />
          <stop offset="1" stopColor={s.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`edge-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={s.edge} stopOpacity="0.12" />
          <stop offset="0.3" stopColor={s.edge} stopOpacity="0.7" />
          <stop offset="0.52" stopColor={s.edge} stopOpacity="0.95" />
          <stop offset="0.76" stopColor={s.edge} stopOpacity="0.6" />
          <stop offset="1" stopColor={s.edge} stopOpacity="0.12" />
        </linearGradient>
      </defs>

      <rect width="1440" height="620" fill={`url(#sky-${uid})`} />
      <rect width="1440" height="620" fill={`url(#glow-${uid})`} />

      {s.bands && (
        <g stroke={s.edge} strokeOpacity="0.16" strokeWidth="1">
          {[196, 224, 252, 284].map((y, i) => (
            <line key={y} x1={120 + i * 60} y1={y} x2={1320 - i * 60} y2={y} />
          ))}
        </g>
      )}

      {starCount > 0 && (
        <g fill="#eceef0">
          {STARS.slice(0, starCount).map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} opacity={0.2 + (i % 4) * 0.1} />
          ))}
        </g>
      )}

      {s.sun && (
        <g>
          <circle cx={s.sun.x} cy={s.sun.y} r={s.sun.r * 2.6} fill={s.sun.c} opacity="0.12" />
          <circle cx={s.sun.x} cy={s.sun.y} r={s.sun.r} fill={s.sun.c} opacity="0.85" />
        </g>
      )}

      {s.id === "aurora" && (
        <g fill="none" strokeWidth="26" strokeLinecap="round" opacity="0.22">
          <path d="M180 40 C 320 120, 420 60, 560 150" stroke="#5eead4" />
          <path d="M760 20 C 900 110, 1010 50, 1160 140" stroke="#8b7ff0" />
        </g>
      )}

      <path d={FAR} fill={s.ridges[0]} />
      <path d={FAR} fill="none" stroke={`url(#edge-${uid})`} strokeWidth="2" />
      <path d={MID} fill={s.ridges[1]} />
      <path d={MID} fill="none" stroke={s.edge} strokeOpacity="0.28" strokeWidth="1.2" />
      <path d={NEAR} fill={s.ridges[2]} />
      <path d={NEAR} fill="none" stroke={s.edge} strokeOpacity="0.16" strokeWidth="1" />
    </svg>
  );
}

export default function HorizonBackdrop({ scene }: { scene: Scene }) {
  return (
    <div className="hero-horizon" aria-hidden="true">
      <SceneArt s={scene} uid="live" />
    </div>
  );
}
