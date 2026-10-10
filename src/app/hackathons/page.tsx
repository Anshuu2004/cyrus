import type { Metadata } from "next";
import Hackathons from "@/views/Hackathons";

export const metadata: Metadata = { title: "Hackathons", description: "161 hackathons with deadlines, prize pools and prep playbooks." };

export default function Page() {
  return <Hackathons />;
}
