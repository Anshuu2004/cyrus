import type { Metadata } from "next";
import { HackathonDetail } from "@/views/Hackathons";

export const metadata: Metadata = { title: "Hackathon", description: "Hackathon brief: dates, prizes, rules and how to prepare." };

export default function Page() {
  return <HackathonDetail />;
}
