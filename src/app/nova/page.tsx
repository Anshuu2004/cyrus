import type { Metadata } from "next";
import Nova from "@/views/Nova";

export const metadata: Metadata = { title: "nova.ai", description: "The nova.ai recommender: describe what you want to build, get matched skills, orgs and programs." };

export default function Page() {
  return <Nova />;
}
