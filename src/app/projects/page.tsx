import type { Metadata } from "next";
import Projects from "@/views/Projects";

export const metadata: Metadata = { title: "Projects", description: "1,528 GitHub projects for AI coding agents: skills, Cursor rules, AGENTS.md files, MCP servers and dev tools, ranked by stars." };

export default function Page() {
  return <Projects />;
}
