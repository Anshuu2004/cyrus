import type { Metadata } from "next";
import OpenSource from "@/views/OpenSource";

export const metadata: Metadata = { title: "Open Source", description: "6,682 mentored open-source projects across GSoC, LFX, Outreachy and Season of Bots, filterable by year, org and tech." };

export default function Page() {
  return <OpenSource />;
}
