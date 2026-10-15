import type { Metadata } from "next";
import NovaAI from "@/views/NovaAI";

export const metadata: Metadata = { title: "Co-pilot on the platform", description: "Meet Co-pilot: the one AI that turns a vague idea into a concrete build plan." };

export default function Page() {
  return <NovaAI />;
}
