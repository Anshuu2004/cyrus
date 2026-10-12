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
  {
    id: "plum",
    name: "Plum + Mauve",
    note: "Regal plum accent, mauve-grey shells, aubergine islands",
    t: {
      paper: ["#f6f4f5", "#0a070d"], sand: ["#eeebee", "#120e17"],
      cream: ["#fbfafb", "#191321"], card: ["#ffffff", "#150f1e"],
      clay: ["#eae6ea", "#211a2b"], line: ["#dad4da", "#322840"],
      liness: ["#e4e0e5", "#282035"], rule: ["#c3bcc3", "#493c5c"],
      ink: ["#231d26", "#f3eff6"], cocoa: ["#63596a", "#c2b6cd"],
      dim: ["#9f97a3", "#8c8095"], accent: ["#7a3a8a", "#c884e0"],
      accentd: ["#5f2c6d", "#dca6ee"], ember: ["#a063ad", "#b76fc7"],
      peach: ["#f1e6f4", "#291733"], rust: ["#5f2c6d", "#dca6ee"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#54688a", "#95a8cd"],
      plum: ["#6b5a75", "#b5a3c6"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#160f1c", "#160f1c"], bean: ["#1d1426", "#1d1426"],
      bark: ["#271b33", "#271b33"], roast: ["#3a2949", "#3a2949"],
      foam: ["#f3eff6", "#f3eff6"], steam: ["#bdb0c8", "#bdb0c8"],
      dimdk: ["#9688a3", "#9688a3"],
    },
  },
  {
    id: "mulberry",
    name: "Mulberry + Rosewood",
    note: "Warm berry pink over rosewood darks - the romantic one",
    t: {
      paper: ["#f7f3f4", "#0d080c"], sand: ["#f0eaec", "#150e14"],
      cream: ["#fcfafb", "#1d131b"], card: ["#ffffff", "#180f16"],
      clay: ["#ece3e6", "#251822"], line: ["#ddd0d5", "#392734"],
      liness: ["#e7dfe2", "#2d1f2a"], rule: ["#c7b4bb", "#543f4d"],
      ink: ["#271c22", "#f6eef2"], cocoa: ["#6a5a62", "#cfb1bd"],
      dim: ["#a5989e", "#94828c"], accent: ["#a03464", "#e67fb0"],
      accentd: ["#7e2750", "#f09cc6"], ember: ["#c05f8a", "#dd719f"],
      peach: ["#f7e4ee", "#2c1424"], rust: ["#7e2750", "#f09cc6"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#556a86", "#94aac9"],
      plum: ["#75606c", "#c2a3b3"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#1a1018", "#1a1018"], bean: ["#231521", "#231521"],
      bark: ["#2f1c2c", "#2f1c2c"], roast: ["#492c44", "#492c44"],
      foam: ["#f6eef2", "#f6eef2"], steam: ["#c8aab8", "#c8aab8"],
      dimdk: ["#a48395", "#a48395"],
    },
  },
  {
    id: "blush",
    name: "Blush + Thistle",
    note: "Soft rose-pink accent, thistle-purple islands, gentle contrast",
    t: {
      paper: ["#f8f5f5", "#0c0a0d"], sand: ["#f1ecec", "#161318"],
      cream: ["#fdfbfb", "#1e1a21"], card: ["#ffffff", "#17141a"],
      clay: ["#eee8e9", "#241f29"], line: ["#dfd6d8", "#352e3d"],
      liness: ["#e8e1e3", "#2b2533"], rule: ["#cab8bd", "#50455c"],
      ink: ["#262023", "#f2eef5"], cocoa: ["#6b6065", "#c3bacd"],
      dim: ["#a79da1", "#8d8496"], accent: ["#c05a7f", "#f291b5"],
      accentd: ["#9e4466", "#f7a8c6"], ember: ["#d98ba5", "#e9809f"],
      peach: ["#f9e8ee", "#2a1a22"], rust: ["#9e4466", "#f7a8c6"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#5a6a84", "#9aa9c6"],
      plum: ["#74657a", "#bcabcf"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#17121a", "#17121a"], bean: ["#1f1824", "#1f1824"],
      bark: ["#292032", "#292032"], roast: ["#3f3150", "#3f3150"],
      foam: ["#f2eef5", "#f2eef5"], steam: ["#bdb2c9", "#bdb2c9"],
      dimdk: ["#988ca8", "#988ca8"],
    },
  },
  {
    id: "aubergine",
    name: "Aubergine + Marron",
    note: "Deep aubergine purple on marron-chestnut browns, earthy and rich",
    t: {
      paper: ["#f5f2f0", "#0d0908"], sand: ["#ede8e4", "#161010"],
      cream: ["#fbf9f7", "#1d1616"], card: ["#ffffff", "#181212"],
      clay: ["#e9e2de", "#251c1d"], line: ["#dad0ca", "#392c2d"],
      liness: ["#e4dcd6", "#2c2223"], rule: ["#c4b5ae", "#554244"],
      ink: ["#251c1b", "#f5eeec"], cocoa: ["#675c58", "#ccb3ae"],
      dim: ["#a29792", "#8f807d"], accent: ["#63345c", "#d191c2"],
      accentd: ["#4e2748", "#e0a8d2"], ember: ["#9a5f8e", "#b96fae"],
      peach: ["#f2e4ef", "#2a1626"], rust: ["#4e2748", "#e0a8d2"],
      leaf: ["#4e7d4a", "#6fb06a"], denim: ["#5c6a80", "#9db0c6"],
      plum: ["#6f5f66", "#c2a7b8"], brick: ["#a8443c", "#d96e5f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#201014", "#201014"], bean: ["#2a161c", "#2a161c"],
      bark: ["#371e28", "#371e28"], roast: ["#523044", "#523044"],
      foam: ["#f5eeec", "#f5eeec"], steam: ["#c6a4ab", "#c6a4ab"],
      dimdk: ["#a18189", "#a18189"],
    },
  },
  {
    id: "iris",
    name: "Iris + Chalk",
    note: "Cool blue-violet iris on chalk neutrals, midnight islands",
    t: {
      paper: ["#f4f4f8", "#080811"], sand: ["#ebebf2", "#101020"],
      cream: ["#fafaff", "#161629"], card: ["#ffffff", "#121222"],
      clay: ["#e8e8f1", "#1c1c31"], line: ["#d7d7e5", "#2b2b47"],
      liness: ["#e1e1ee", "#232339"], rule: ["#bebed4", "#43436b"],
      ink: ["#1d1d2a", "#eeedf9"], cocoa: ["#5b5b72", "#b9b8d4"],
      dim: ["#9696a8", "#82829c"], accent: ["#5a4bc9", "#a293f5"],
      accentd: ["#463aa6", "#b8abf8"], ember: ["#8a7de0", "#8f7ee8"],
      peach: ["#e9e6fb", "#1e1a3a"], rust: ["#463aa6", "#b8abf8"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#4c6488", "#8fa9cd"],
      plum: ["#63607e", "#b0acc9"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#100d24", "#100d24"], bean: ["#161229", "#161229"],
      bark: ["#1f1938", "#1f1938"], roast: ["#322a55", "#322a55"],
      foam: ["#eeedf9", "#eeedf9"], steam: ["#aaa8cf", "#aaa8cf"],
      dimdk: ["#8482ab", "#8482ab"],
    },
  },
  {
    id: "noir",
    name: "Noir + Chalk",
    note: "Pure black and chalk grey, silver accent - zero colour casts",
    t: {
      paper: ["#f5f5f4", "#0a0a0b"], sand: ["#ebebea", "#121213"],
      cream: ["#fafafa", "#1a1a1b"], card: ["#ffffff", "#141415"],
      clay: ["#e7e7e6", "#1e1e20"], line: ["#d8d8d7", "#2c2c2e"],
      liness: ["#e2e2e1", "#242426"], rule: ["#bdbdbd", "#4a4a4d"],
      ink: ["#1a1a1a", "#f4f4f3"], cocoa: ["#5c5c5e", "#c0c0c2"],
      dim: ["#9a9a9c", "#808083"], accent: ["#3a3a3d", "#d4d4d6"],
      accentd: ["#26262a", "#e6e6e7"], ember: ["#8a8a8e", "#bdbdc0"],
      peach: ["#ededec", "#232325"], rust: ["#26262a", "#e6e6e7"],
      leaf: ["#4c7a52", "#7fb98a"], denim: ["#5b677a", "#9aa6b8"],
      plum: ["#6b6b6e", "#b6b6ba"], brick: ["#a8443c", "#d9695f"],
      honey: ["#8f8137", "#d8ca6a"],
      coffee: ["#141415", "#141415"], bean: ["#1b1b1d", "#1b1b1d"],
      bark: ["#232326", "#232326"], roast: ["#34343a", "#34343a"],
      foam: ["#f4f4f3", "#f4f4f3"], steam: ["#b6b6b9", "#b6b6b9"],
      dimdk: ["#8e8e92", "#8e8e92"],
    },
  },
  {
    id: "fog",
    name: "Graphite + Fog",
    note: "Cool blue-grey fog neutrals, steel graphite accent, editorial",
    t: {
      paper: ["#f4f5f6", "#0b0c0e"], sand: ["#eaecef", "#12141a"],
      cream: ["#fafbfc", "#191c23"], card: ["#ffffff", "#14161c"],
      clay: ["#e6e9ed", "#1e222b"], line: ["#d6dae0", "#2b303c"],
      liness: ["#e0e4e9", "#232732"], rule: ["#b9bfc8", "#454c5c"],
      ink: ["#1e2227", "#eef0f3"], cocoa: ["#5b626c", "#bcc3cd"],
      dim: ["#979da6", "#858b96"], accent: ["#46586e", "#93a8c0"],
      accentd: ["#35445a", "#aabdd2"], ember: ["#7c8ca0", "#8fa2b8"],
      peach: ["#e8edf2", "#1c2129"], rust: ["#35445a", "#aabdd2"],
      leaf: ["#4a7a58", "#79b58a"], denim: ["#4a6485", "#8ba8c9"],
      plum: ["#636b78", "#b0b8c4"], brick: ["#ab463f", "#d96e64"],
      honey: ["#94782e", "#dcbc55"],
      coffee: ["#101318", "#101318"], bean: ["#171b22", "#171b22"],
      bark: ["#1f242e", "#1f242e"], roast: ["#313a48", "#313a48"],
      foam: ["#eef0f3", "#eef0f3"], steam: ["#b3bac6", "#b3bac6"],
      dimdk: ["#8b929e", "#8b929e"],
    },
  },
  {
    id: "smoke",
    name: "Onyx + Smoke",
    note: "Warm taupe smoke greys on onyx black - quiet luxury grey",
    t: {
      paper: ["#f5f4f2", "#0d0c0b"], sand: ["#eceae6", "#151412"],
      cream: ["#fbfaf8", "#1c1b18"], card: ["#ffffff", "#161513"],
      clay: ["#e8e6e1", "#211f1c"], line: ["#dad7d0", "#2f2d28"],
      liness: ["#e3e1db", "#272521"], rule: ["#c2beb5", "#4d4a43"],
      ink: ["#211f1c", "#f2f1ed"], cocoa: ["#615e58", "#c7c3bb"],
      dim: ["#9d9a93", "#87837c"], accent: ["#57534e", "#a8a29e"],
      accentd: ["#44403c", "#c1bbb5"], ember: ["#8d8781", "#b5afa8"],
      peach: ["#edeae5", "#26231f"], rust: ["#44403c", "#c1bbb5"],
      leaf: ["#55794f", "#82b783"], denim: ["#5c6672", "#a0aab6"],
      plum: ["#6e6a64", "#bab5ac"], brick: ["#a94a41", "#d9716a"],
      honey: ["#93803a", "#d9c473"],
      coffee: ["#171614", "#171614"], bean: ["#1f1d1a", "#1f1d1a"],
      bark: ["#292622", "#292622"], roast: ["#3d3934", "#3d3934"],
      foam: ["#f2f1ed", "#f2f1ed"], steam: ["#b8b3aa", "#b8b3aa"],
      dimdk: ["#928d84", "#928d84"],
    },
  },
  {
    id: "night",
    name: "Violet Night",
    note: "Midnight purple blacks, electric violet spark, lavender dawn light mode",
    t: {
      paper: ["#f4f2f8", "#0a0714"], sand: ["#ebe7f3", "#120e1f"],
      cream: ["#faf8fd", "#191428"], card: ["#ffffff", "#141022"],
      clay: ["#e8e4f1", "#1e182f"], line: ["#d8d2e4", "#2d2545"],
      liness: ["#e2dced", "#241d3a"], rule: ["#c2bad4", "#4a3f6b"],
      ink: ["#1f1a2e", "#f0ecfa"], cocoa: ["#615a75", "#beb4d8"],
      dim: ["#9c95ac", "#8a80a3"], accent: ["#6d3fd4", "#9d7cf5"],
      accentd: ["#5730ad", "#b79bff"], ember: ["#8f6fe0", "#a88ef2"],
      peach: ["#ece4fb", "#241a3d"], rust: ["#5730ad", "#b79bff"],
      leaf: ["#3e7d4f", "#57b06e"], denim: ["#4f6693", "#8fa6d6"],
      plum: ["#675f80", "#b0a6cc"], brick: ["#b0433c", "#d9695f"],
      honey: ["#a97b1f", "#e0b64a"],
      coffee: ["#120c22", "#120c22"], bean: ["#19112e", "#19112e"],
      bark: ["#221740", "#221740"], roast: ["#342560", "#342560"],
      foam: ["#f0ecfa", "#f0ecfa"], steam: ["#b3a8d4", "#b3a8d4"],
      dimdk: ["#8d82b0", "#8d82b0"],
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
  const dot = current ? current.t.accent[0] : "#126879";

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
              name="Peacock + Oyster"
              note="The palette baked into the build"
              dots={["#f6f5f3", "#126879", "#4aa8b8"]}
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
