import type { Metadata } from "next";
import How from "@/views/How";

export const metadata: Metadata = { title: "How it works", description: "Three steps from browsing the catalog to shipping a merged PR." };

export default function Page() {
  return <How />;
}
