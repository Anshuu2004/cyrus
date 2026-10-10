import type { Metadata } from "next";
import RepoDetail from "@/views/RepoDetail";

export const metadata: Metadata = { title: "Repo", description: "Repo detail with live stats, tags and related projects." };

export default function Page() {
  return <RepoDetail />;
}
