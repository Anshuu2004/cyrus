import type { Metadata } from "next";
import Resources from "@/views/Resources";

export const metadata: Metadata = { title: "Resources", description: "58 first-party learning resources for agents, open source and hackathons." };

export default function Page() {
  return <Resources />;
}
