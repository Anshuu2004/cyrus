import type { Metadata } from "next";
import OrgProfile from "@/views/OrgProfile";

export const metadata: Metadata = { title: "Organization", description: "Live org profile: repos, stars, program history and how to contribute." };

export default function Page() {
  return <OrgProfile />;
}
