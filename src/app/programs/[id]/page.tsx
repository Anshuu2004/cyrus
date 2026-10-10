import type { Metadata } from "next";
import ProgramDetail from "@/views/ProgramDetail";

export const metadata: Metadata = { title: "Program", description: "Program deep-dive with five-year stats, org mix and application windows." };

export default function Page() {
  return <ProgramDetail />;
}
