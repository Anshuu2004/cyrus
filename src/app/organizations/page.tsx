import type { Metadata } from "next";
import Organizations from "@/views/Organizations";

export const metadata: Metadata = { title: "Organizations", description: "43 real GitHub organizations with live stats, program participation and contribution playbooks." };

export default function Page() {
  return <Organizations />;
}
