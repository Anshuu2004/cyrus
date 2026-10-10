import type { Metadata } from "next";
import { ResourceDetail } from "@/views/Resources";

export const metadata: Metadata = { title: "Resource", description: "Learning resource with why-it-matters and how-to-use notes." };

export default function Page() {
  return <ResourceDetail />;
}
