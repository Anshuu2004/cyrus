import type { Metadata } from "next";
import Dashboard from "@/views/Dashboard";

export const metadata: Metadata = { title: "Dashboard", description: "Your board: saved projects, followed orgs, watchlist, deadlines and next steps." };

export default function Page() {
  return <Dashboard />;
}
