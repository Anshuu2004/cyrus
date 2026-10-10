import type { Metadata } from "next";
import NovaAI from "@/views/NovaAI";

export const metadata: Metadata = { title: "nova.ai on the platform", description: "Meet nova.ai: the recommender that turns a vague idea into a concrete build plan." };

export default function Page() {
  return <NovaAI />;
}
