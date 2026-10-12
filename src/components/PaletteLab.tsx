"use client";
/* ══ PaletteLab.tsx — preview-branch tool: live palette compare ══
   Overrides the Tailwind v4 color tokens on <html> at runtime so
   palette combinations can be clicked through without a rebuild.
   This is not for main: delete this file and the layout.tsx mount
   line once a winning palette is baked into globals.css. */
import { useEffect, useState } from "react";

const KEY = "cyrus.lab.palette";
const TOKENS = [
  "paper", "sand", "cream", "card", "clay", "line", "liness", "rule", "ink",
  "cocoa", "dim", "accent", "accentd", "ember", "peach", "rust", "leaf",
  "denim", "plum", "brick", "honey", "coffee", "bean", "bark", "roast",
  "foam", "steam", "dimdk",
];

/* each token maps to [light value, dark value] */
type Palette = {
  id: string;
  name: string;
  note: string;
  t: Record<string, [string, string]>;
};

const PALETTES: Palette[] = [
  {
    id: "teal",
    name: "Teal + Pearl",
    note: "Cool lagoon accent on pearl surfaces, deep petrol islands",
    t: {
      paper: ["#f4f6f6", "#060f10"], sand: ["#e9eeee", "#0c181a"],
      cream: ["#fbfcfc", "#121f22"], card: ["#ffffff", "#0d1a1c"],
      clay: ["#e6ecee", "#17282b"], line: ["#d8e1e2", "#22383c"],
      liness: ["#e2e9ea", "#1a2d30"], rule: ["#bcc9cb", "#3a565a"],
      ink: ["#13282c", "#eef7f6"], cocoa: ["#4f6669", "#adc7c8"],
      dim: ["#8fa3a6", "#7d9a9b"], accent: ["#0e7c7b", "#3fc9c2"],
      accentd: ["#0a6261", "#6adcd6"], ember: ["#4bb8b3", "#52d1ca"],
      peach: ["#e2f1f0", "#0d2325"], rust: ["#0a6160", "#6adcd6"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#4a6b8a", "#7fa8c9"],
      plum: ["#5c6f72", "#9fb2c4"], brick: ["#b04f47", "#d96e64"],
      honey: ["#9a7b2e", "#e0b64a"],
      coffee: ["#0b1e20", "#0b1e20"], bean: ["#102628", "#102628"],
      bark: ["#163336", "#163336"], roast: ["#245055", "#245055"],
      foam: ["#eef7f6", "#eef7f6"], steam: ["#a4c4c3", "#a4c4c3"],
      dimdk: ["#7f9d9c", "#7f9d9c"],
    },
  },
  {
    id: "crimson",
    name: "Charcoal + Crimson",
    note: "Editorial grey neutrals, one confident red accent",
    t: {
      paper: ["#f6f6f6", "#0b0b0c"], sand: ["#ebecee", "#131416"],
      cream: ["#fcfcfc", "#1a1b1e"], card: ["#ffffff", "#151618"],
      clay: ["#eaeaec", "#212226"], line: ["#dbdce0", "#32343a"],
      liness: ["#e4e5e8", "#282a2e"], rule: ["#c1c3c8", "#54575e"],
      ink: ["#1b1c1e", "#f3f2f1"], cocoa: ["#5e6064", "#c3c5ca"],
      dim: ["#9a9ca1", "#8f9298"], accent: ["#c1121f", "#ef4b5f"],
      accentd: ["#9d0e19", "#f46b7c"], ember: ["#e0626b", "#f2707f"],
      peach: ["#fbe9ea", "#2a1215"], rust: ["#9d0e19", "#f46b7c"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#3b6ea5", "#6ba3d6"],
      plum: ["#4a5c6b", "#9fb2c4"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#17181a", "#17181a"], bean: ["#1e2023", "#1e2023"],
      bark: ["#26292d", "#26292d"], roast: ["#3a3e44", "#3a3e44"],
      foam: ["#f3f2f1", "#f3f2f1"], steam: ["#aaaeb3", "#aaaeb3"],
      dimdk: ["#84878c", "#84878c"],
    },
  },
  {
    id: "sage",
    name: "Sage + Stone",
    note: "Muted garden green on warm stone, slate secondary",
    t: {
      paper: ["#f5f4f0", "#0b0d0a"], sand: ["#eae8df", "#12140f"],
      cream: ["#fbfaf6", "#191c15"], card: ["#ffffff", "#131610"],
      clay: ["#e7e5da", "#1d2117"], line: ["#d9d6c8", "#2b3023"],
      liness: ["#e2dfd3", "#22261c"], rule: ["#c0bcab", "#474d3b"],
      ink: ["#23241d", "#f0f1e9"], cocoa: ["#61614f", "#c1c3af"],
      dim: ["#9c9b87", "#8f9179"], accent: ["#4d7240", "#8fc07a"],
      accentd: ["#3b5c30", "#a6d294"], ember: ["#8fc07a", "#9bc987"],
      peach: ["#e9f0e1", "#1a2114"], rust: ["#3b5c30", "#a6d294"],
      leaf: ["#5d8a4f", "#6fbf7f"], denim: ["#64748b", "#8ea3b8"],
      plum: ["#7a7256", "#b0a988"], brick: ["#b05a3f", "#d97f5e"],
      honey: ["#9a7b2e", "#e0b64a"],
      coffee: ["#191d16", "#191d16"], bean: ["#20251c", "#20251c"],
      bark: ["#293024", "#293024"], roast: ["#3d4636", "#3d4636"],
      foam: ["#f0f1e9", "#f0f1e9"], steam: ["#b4b6a2", "#b4b6a2"],
      dimdk: ["#8c8e79", "#8c8e79"],
    },
  },
  {
    id: "gold",
    name: "Mono + Gold",
    note: "Pure greys everywhere, gold does all the talking",
    t: {
      paper: ["#f7f7f6", "#0a0a09"], sand: ["#ececeb", "#121211"],
      cream: ["#fcfcfb", "#1a1a18"], card: ["#ffffff", "#141413"],
      clay: ["#ebebe9", "#1f1f1d"], line: ["#dbdbd8", "#303029"],
      liness: ["#e5e5e2", "#262622"], rule: ["#c2c2be", "#535350"],
      ink: ["#1a1a19", "#f2f2ef"], cocoa: ["#5f5f5d", "#c2c2bd"],
      dim: ["#999996", "#909089"], accent: ["#9a7b2a", "#d9b45f"],
      accentd: ["#7c6220", "#e6c678"], ember: ["#d9b45f", "#dfbc68"],
      peach: ["#f4edda", "#221c0d"], rust: ["#7c6220", "#e6c678"],
      leaf: ["#4d7a55", "#57b06e"], denim: ["#5f6f85", "#6ba3d6"],
      plum: ["#6b6b68", "#a9a9a4"], brick: ["#a8483f", "#d9695f"],
      honey: ["#a3822c", "#e0b64a"],
      coffee: ["#141413", "#141413"], bean: ["#1c1c1b", "#1c1c1b"],
      bark: ["#252523", "#252523"], roast: ["#3a3a37", "#3a3a37"],
      foam: ["#f2f2ef", "#f2f2ef"], steam: ["#ababa7", "#ababa7"],
      dimdk: ["#8a8a86", "#8a8a86"],
    },
  },
  {
    id: "cobalt",
    name: "Cobalt + Frost",
    note: "Cold frost neutrals, electric cobalt accent, ink-blue islands",
    t: {
      paper: ["#f5f7fa", "#05090f"], sand: ["#eaeef4", "#0c121b"],
      cream: ["#fbfcfe", "#131b26"], card: ["#ffffff", "#0f1621"],
      clay: ["#e7edf4", "#19222f"], line: ["#d6dee9", "#263449"],
      liness: ["#e0e7ef", "#1d2836"], rule: ["#bcc7d6", "#41546c"],
      ink: ["#131c28", "#eef3f9"], cocoa: ["#50606f", "#b2c1d2"],
      dim: ["#91a1b0", "#8395a8"], accent: ["#1358c9", "#4d8ef7"],
      accentd: ["#0e449f", "#76aafa"], ember: ["#6ba3f0", "#6ea1f5"],
      peach: ["#e5eefb", "#0f1a2b"], rust: ["#0e449f", "#76aafa"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#64748b", "#8ea9c9"],
      plum: ["#2f7d72", "#7cc4b6"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#0c1420", "#0c1420"], bean: ["#121c2b", "#121c2b"],
      bark: ["#192637", "#192637"], roast: ["#2a3d57", "#2a3d57"],
      foam: ["#eef3f9", "#eef3f9"], steam: ["#a8b8ca", "#a8b8ca"],
      dimdk: ["#8294a7", "#8294a7"],
    },
  },
  {
    id: "copper",
    name: "Copper + Linen",
    note: "Burnished copper on warm linen, espresso islands",
    t: {
      paper: ["#f8f5f0", "#100b07"], sand: ["#efe9e0", "#171009"],
      cream: ["#fdfbf7", "#1e160d"], card: ["#ffffff", "#161009"],
      clay: ["#ece5da", "#221a10"], line: ["#ded5c7", "#34281a"],
      liness: ["#e6ded1", "#291f14"], rule: ["#c6baa6", "#54432d"],
      ink: ["#2a2118", "#f6efe5"], cocoa: ["#6b5d4c", "#d0bfa6"],
      dim: ["#a4967f", "#a08e74"], accent: ["#b4552d", "#ef9a6a"],
      accentd: ["#96421f", "#f4b28a"], ember: ["#e59866", "#e89b6c"],
      peach: ["#f8e8dc", "#2a1a0e"], rust: ["#96421f", "#f4b28a"],
      leaf: ["#4e7d4a", "#6fb06a"], denim: ["#4c6b86", "#7fa8c9"],
      plum: ["#6e5a49", "#c2a98c"], brick: ["#b04a3c", "#d9705f"],
      honey: ["#b08a2e", "#e6c25e"],
      coffee: ["#20160e", "#20160e"], bean: ["#291d13", "#291d13"],
      bark: ["#33261a", "#33261a"], roast: ["#4a3826", "#4a3826"],
      foam: ["#f6efe5", "#f6efe5"], steam: ["#c2b096", "#c2b096"],
      dimdk: ["#9b8a71", "#9b8a71"],
    },
  },
  {
    id: "harbor",
    name: "Harbor + Mist",
    note: "Petrol blue accent over misty cool neutrals, deep sea islands",
    t: {
      paper: ["#f5f8f8", "#040b0f"], sand: ["#e9f0f1", "#0a1419"],
      cream: ["#fbfdfd", "#101d23"], card: ["#ffffff", "#0c161c"],
      clay: ["#e6eef0", "#15242c"], line: ["#d5e0e3", "#213842"],
      liness: ["#dfe9eb", "#182a32"], rule: ["#b7c7cb", "#385662"],
      ink: ["#14262b", "#ecf5f8"], cocoa: ["#4e686e", "#adcbcf"],
      dim: ["#8ba3a9", "#7da0a9"], accent: ["#0b6e99", "#4db2e0"],
      accentd: ["#085678", "#74c6ea"], ember: ["#5fb4d4", "#5cb9e2"],
      peach: ["#e3f1f7", "#0c2029"], rust: ["#085678", "#74c6ea"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#64748b", "#8ea9c9"],
      plum: ["#2f7d72", "#7cc4b6"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#081a22", "#081a22"], bean: ["#0d232c", "#0d232c"],
      bark: ["#12303a", "#12303a"], roast: ["#1d4a59", "#1d4a59"],
      foam: ["#ecf5f8", "#ecf5f8"], steam: ["#a3c0c9", "#a3c0c9"],
      dimdk: ["#7f9ea8", "#7f9ea8"],
    },
  },
  {
    id: "matcha",
    name: "Matcha + Chalk",
    note: "Fresh yellow-green pop on chalky neutrals, dark moss islands",
    t: {
      paper: ["#f7f8f3", "#0a0d07"], sand: ["#edefe6", "#11150c"],
      cream: ["#fcfdf9", "#171d11"], card: ["#ffffff", "#13170d"],
      clay: ["#eaede0", "#1c2314"], line: ["#dbe0cc", "#2a3420"],
      liness: ["#e4e8d8", "#212817"], rule: ["#c3cab0", "#455237"],
      ink: ["#1f2418", "#f1f4e8"], cocoa: ["#5a6247", "#c2caab"],
      dim: ["#979f81", "#8f9878"], accent: ["#4b7f2f", "#a3d95f"],
      accentd: ["#3a6522", "#b8e37e"], ember: ["#9ccb6a", "#aed772"],
      peach: ["#eaf2df", "#18210d"], rust: ["#3a6522", "#b8e37e"],
      leaf: ["#55893e", "#7fc26a"], denim: ["#64748b", "#8ea3b8"],
      plum: ["#7c7458", "#b3ab8b"], brick: ["#b05a3f", "#d97f5e"],
      honey: ["#a3822c", "#e0c24a"],
      coffee: ["#161a10", "#161a10"], bean: ["#1d2315", "#1d2315"],
      bark: ["#262d1c", "#262d1c"], roast: ["#3a452b", "#3a452b"],
      foam: ["#f1f4e8", "#f1f4e8"], steam: ["#b5bda0", "#b5bda0"],
      dimdk: ["#8d9576", "#8d9576"],
    },
  },
  {
    id: "vermilion",
    name: "Vermilion + Basalt",
    note: "Bold red-orange stamp on basalt grey, warm charcoal islands",
    t: {
      paper: ["#f6f6f5", "#0c0b0a"], sand: ["#eceae9", "#141312"],
      cream: ["#fcfcfb", "#1b1918"], card: ["#ffffff", "#161514"],
      clay: ["#eae7e5", "#22201e"], line: ["#dcd8d5", "#34312e"],
      liness: ["#e5e1de", "#292623"], rule: ["#c4bfbb", "#57524c"],
      ink: ["#1d1b1a", "#f4f1ee"], cocoa: ["#615c58", "#c6c0b9"],
      dim: ["#9c9690", "#948d85"], accent: ["#d33f1e", "#ff6b42"],
      accentd: ["#ab3115", "#ff8a66"], ember: ["#f07a51", "#fa7d55"],
      peach: ["#fceae2", "#2b140c"], rust: ["#ab3115", "#ff8a66"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#3b6ea5", "#6ba3d6"],
      plum: ["#4a5c6b", "#9fb2c4"], brick: ["#b0433c", "#e06a4f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#171514", "#171514"], bean: ["#1e1b1a", "#1e1b1a"],
      bark: ["#272322", "#272322"], roast: ["#3d3735", "#3d3735"],
      foam: ["#f4f1ee", "#f4f1ee"], steam: ["#b1aba4", "#b1aba4"],
      dimdk: ["#8b847d", "#8b847d"],
    },
  },
  {
    id: "peacock",
    name: "Peacock + Oyster",
    note: "Deep peacock teal on oyster shell neutrals, lagoon islands",
    t: {
      paper: ["#f6f5f3", "#050d10"], sand: ["#edece8", "#0b161a"],
      cream: ["#fcfcfa", "#112025"], card: ["#ffffff", "#0d171c"],
      clay: ["#e9e7e1", "#16262c"], line: ["#d9d6cd", "#233a42"],
      liness: ["#e3e0d7", "#1a2d33"], rule: ["#c1bcb0", "#3b5a63"],
      ink: ["#1b2426", "#eef6f7"], cocoa: ["#5d6365", "#aec6cc"],
      dim: ["#9b9e97", "#7e979e"], accent: ["#126879", "#3fc4d4"],
      accentd: ["#0d5261", "#6cd4e1"], ember: ["#4aa8b8", "#55c8d8"],
      peach: ["#e2f0f3", "#0c2228"], rust: ["#0d5261", "#6cd4e1"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#4c6b86", "#8ea9c9"],
      plum: ["#566e78", "#9fb8c4"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#0b1a1f", "#0b1a1f"], bean: ["#112329", "#112329"],
      bark: ["#172f36", "#172f36"], roast: ["#244851", "#244851"],
      foam: ["#eef6f7", "#eef6f7"], steam: ["#a8bfc2", "#a8bfc2"],
      dimdk: ["#83979b", "#83979b"],
    },
  },
  {
    id: "jade",
    name: "Ink + Jade",
    note: "Crisp near-black neutrals, luminous jade green, fintech calm",
    t: {
      paper: ["#f6f7f6", "#050807"], sand: ["#ebeeea", "#0a0f0c"],
      cream: ["#fbfcfb", "#0f1612"], card: ["#ffffff", "#0c120e"],
      clay: ["#e8ede7", "#131c15"], line: ["#d7ded5", "#1f2d23"],
      liness: ["#e0e7de", "#17231a"], rule: ["#bec7bb", "#364a39"],
      ink: ["#101512", "#eef4ef"], cocoa: ["#4d574f", "#b4c4b6"],
      dim: ["#8d978e", "#83937f"], accent: ["#0e9f6e", "#34d399"],
      accentd: ["#0a7d55", "#5eeab5"], ember: ["#45cfa0", "#3fdca4"],
      peach: ["#e0f5eb", "#0b1f16"], rust: ["#0a7d55", "#5eeab5"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#3b6ea5", "#6ba3d6"],
      plum: ["#4a5c6b", "#9fb2c4"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#0a0f0c", "#0a0f0c"], bean: ["#0f1612", "#0f1612"],
      bark: ["#151f19", "#151f19"], roast: ["#223328", "#223328"],
      foam: ["#eef4ef", "#eef4ef"], steam: ["#a3b5a6", "#a3b5a6"],
      dimdk: ["#7e9080", "#7e9080"],
    },
  },
  {
    id: "lime",
    name: "Graphite + Lime",
    note: "Cool graphite build tools feel, electric chartreuse pop",
    t: {
      paper: ["#f6f6f6", "#08090b"], sand: ["#ebecee", "#101114"],
      cream: ["#fcfcfd", "#16181c"], card: ["#ffffff", "#121317"],
      clay: ["#e9eaec", "#1b1e23"], line: ["#d8dadf", "#2a2e35"],
      liness: ["#e2e4e8", "#20242a"], rule: ["#c1c4cb", "#454b55"],
      ink: ["#17181c", "#f1f3ef"], cocoa: ["#56585f", "#c0c3c9"],
      dim: ["#93969d", "#8d9199"], accent: ["#5f8f0e", "#a3e635"],
      accentd: ["#4c730a", "#bcf06a"], ember: ["#9ccf3f", "#ade84d"],
      peach: ["#eef5df", "#16210a"], rust: ["#4c730a", "#bcf06a"],
      leaf: ["#55893e", "#7fc26a"], denim: ["#64748b", "#8ea3b8"],
      plum: ["#6c6f78", "#a7abb5"], brick: ["#b0503c", "#d9695f"],
      honey: ["#a3822c", "#e0b64a"],
      coffee: ["#131417", "#131417"], bean: ["#1a1c20", "#1a1c20"],
      bark: ["#22252a", "#22252a"], roast: ["#343941", "#343941"],
      foam: ["#f1f3ef", "#f1f3ef"], steam: ["#adb2b8", "#adb2b8"],
      dimdk: ["#878c92", "#878c92"],
    },
  },
  {
    id: "cyan",
    name: "Arctic + Cyan",
    note: "Glacial ice neutrals, electric cyan highlight, deep sea islands",
    t: {
      paper: ["#f5f8fa", "#04080c"], sand: ["#e9f0f4", "#091219"],
      cream: ["#fafcfd", "#0f1b23"], card: ["#ffffff", "#0b141b"],
      clay: ["#e6eef2", "#14232e"], line: ["#d5e2e8", "#203847"],
      liness: ["#dfeaf0", "#182b36"], rule: ["#b7c9d2", "#37586c"],
      ink: ["#101e26", "#ecf4f8"], cocoa: ["#4a606c", "#aecbd8"],
      dim: ["#88a0ab", "#7c9cab"], accent: ["#0891b2", "#22d3ee"],
      accentd: ["#06708c", "#67e3f4"], ember: ["#4dc7de", "#3ed3e8"],
      peach: ["#e0f4f9", "#08222b"], rust: ["#06708c", "#67e3f4"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#64748b", "#8ea9c9"],
      plum: ["#2f7d72", "#7cc4b6"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#08141c", "#08141c"], bean: ["#0d1c26", "#0d1c26"],
      bark: ["#132835", "#132835"], roast: ["#1e4054", "#1e4054"],
      foam: ["#ecf4f8", "#ecf4f8"], steam: ["#a4bcc8", "#a4bcc8"],
      dimdk: ["#7f9aa6", "#7f9aa6"],
    },
  },
  {
    id: "racing",
    name: "Racing Green + Bone",
    note: "Heritage bone paper, very deep green ink and accent, brass warmth",
    t: {
      paper: ["#f7f5ef", "#060a07"], sand: ["#edeade", "#0c120d"],
      cream: ["#fcfbf6", "#121a13"], card: ["#ffffff", "#0e1510"],
      clay: ["#e9e5d6", "#161f17"], line: ["#d9d4c1", "#243326"],
      liness: ["#e2ddcc", "#1b261d"], rule: ["#c0b99f", "#3f5341"],
      ink: ["#131b15", "#eef1e7"], cocoa: ["#4f5a4e", "#b6c2ad"],
      dim: ["#989a85", "#85927d"], accent: ["#14532d", "#6fbf84"],
      accentd: ["#0e3d20", "#92d3a2"], ember: ["#4f8f62", "#7ac88e"],
      peach: ["#e3ecdf", "#122114"], rust: ["#0e3d20", "#92d3a2"],
      leaf: ["#3e7d4f", "#6fbf78"], denim: ["#4c6b86", "#8ea9c9"],
      plum: ["#5c6653", "#a8b49a"], brick: ["#a84a38", "#d96e58"],
      honey: ["#9a7b2e", "#e0c25e"],
      coffee: ["#0b140d", "#0b140d"], bean: ["#101a12", "#101a12"],
      bark: ["#16241a", "#16241a"], roast: ["#233726", "#233726"],
      foam: ["#eef1e7", "#eef1e7"], steam: ["#aab4a1", "#aab4a1"],
      dimdk: ["#868f7c", "#868f7c"],
    },
  },
  {
    id: "tangerine",
    name: "Tangerine + Espresso",
    note: "Rich espresso browns, vivid tangerine spark, cafe warmth",
    t: {
      paper: ["#f8f6f3", "#0d0906"], sand: ["#efeae3", "#141009"],
      cream: ["#fcfbf8", "#1b150e"], card: ["#ffffff", "#151009"],
      clay: ["#ece5db", "#1e1710"], line: ["#ddd4c7", "#30261a"],
      liness: ["#e5ded2", "#251d13"], rule: ["#c5b9a8", "#4e4030"],
      ink: ["#221a13", "#f5efe6"], cocoa: ["#645444", "#cfbda4"],
      dim: ["#9d8d7a", "#9d8a72"], accent: ["#ea580c", "#fb923c"],
      accentd: ["#c24a0a", "#fda65f"], ember: ["#f98d4f", "#f98f45"],
      peach: ["#fdeadd", "#271507"], rust: ["#c24a0a", "#fda65f"],
      leaf: ["#4e7d4a", "#6fb06a"], denim: ["#4c6b86", "#7fa8c9"],
      plum: ["#6e5f4d", "#c2ad8c"], brick: ["#b0433c", "#d96e58"],
      honey: ["#b08a2e", "#e6c25e"],
      coffee: ["#1a120b", "#1a120b"], bean: ["#221810", "#221810"],
      bark: ["#2b1f15", "#2b1f15"], roast: ["#40301f", "#40301f"],
      foam: ["#f5efe6", "#f5efe6"], steam: ["#c0ad95", "#c0ad95"],
      dimdk: ["#98876f", "#98876f"],
    },
  },
];

function applyPalette(id: string) {
  const root = document.documentElement;
  const p = PALETTES.find((x) => x.id === id);
  const dark = root.classList.contains("dark");
  TOKENS.forEach((t) => {
    const pair = p?.t[t];
    if (!pair) root.style.removeProperty("--color-" + t);
    else root.style.setProperty("--color-" + t, dark ? pair[1] : pair[0]);
  });
}

export default function PaletteLab() {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState("default");

  /* restore the stored choice once on the client */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored && stored !== "default") setSel(stored);
    } catch {
      /* private mode - stay on the baked palette */
    }
  }, []);

  /* re-apply on selection AND on light/dark theme flips */
  useEffect(() => {
    try {
      if (sel === "default") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, sel);
    } catch {
      /* ignore */
    }
    applyPalette(sel);
    const obs = new MutationObserver(() => applyPalette(sel));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [sel]);

  /* Escape closes the panel */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = PALETTES.find((p) => p.id === sel);
  const dot = current ? current.t.accent[0] : "#0f7d53";

  return (
    <div className="fixed bottom-5 left-5 z-[90] print:hidden">
      {open && (
        <div className="mb-3 w-[300px] max-h-[min(660px,80vh)] overflow-y-auto rounded-2xl border border-line bg-card shadow-lift p-2 animate-rise">
          <p className="px-3 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-dim font-mono">
            Palette Lab
          </p>
          <div className="flex flex-col gap-0.5">
            <Option
              active={sel === "default"}
              onClick={() => setSel("default")}
              name="Emerald + Ivory"
              note="The palette baked into the build"
              dots={["#f7f6f4", "#0f7d53", "#63c292"]}
            />
            {PALETTES.map((p) => (
              <Option
                key={p.id}
                active={sel === p.id}
                onClick={() => setSel(p.id)}
                name={p.name}
                note={p.note}
                dots={[p.t.paper[0], p.t.accent[0], p.t.ember[0]]}
              />
            ))}
          </div>
          <p className="px-3 pt-2 pb-1 text-[11px] leading-snug text-dim">
            Preview only - picks your favorite and it gets baked into the theme.
          </p>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-line bg-card/95 backdrop-blur px-4 py-2.5 text-[13px] font-semibold text-cocoa shadow-lift hover:border-rule hover:text-ink transition-colors"
      >
        <span
          aria-hidden
          className="h-3.5 w-3.5 rounded-full ring-2 ring-card"
          style={{ background: `conic-gradient(${dot} 0 10%, #0e7c7b 0 20%, #d9b45f 0 30%, #c1121f 0 40%, #1358c9 0 50%, #b4552d 0 60%, #0e9f6e 0 70%, #a3e635 0 80%, #22d3ee 0 90%, #ea580c 0 100%)` }}
        />
        Palette Lab
      </button>
    </div>
  );
}

function Option({
  active,
  onClick,
  name,
  note,
  dots,
}: {
  active: boolean;
  onClick: () => void;
  name: string;
  note: string;
  dots: string[];
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
        active
          ? "bg-peach ring-1 ring-accent/40"
          : "hover:bg-clay"
      }`}
    >
      <span aria-hidden className="flex -space-x-1.5 mt-1 shrink-0">
        {dots.map((d, i) => (
          <span key={i} className="h-3.5 w-3.5 rounded-full border border-line" style={{ background: d }} />
        ))}
      </span>
      <span className="min-w-0">
        <span className={`block text-[13px] font-bold ${active ? "text-rust" : "text-ink"}`}>{name}</span>
        <span className="block text-[11px] leading-snug text-dim">{note}</span>
      </span>
    </button>
  );
}
