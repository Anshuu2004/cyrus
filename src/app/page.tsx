import type { Metadata } from "next";
import Home from "@/views/Home";

export const metadata: Metadata = { title: { absolute: "cyrus.ai - find your open-source contribution" }, description: "The developer-program platform: 1,528 AI-agent repos, 6,682 open-source program projects and 161 live hackathons in one warm, self-refreshing catalog." };

export default function Page() {
  return <Home />;
}
