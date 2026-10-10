import type { Metadata } from "next";
import Features from "@/views/Features";

export const metadata: Metadata = { title: "Features", description: "Everything cyrus.ai does: catalog, calendar, matcher, recommender and self-refreshing data." };

export default function Page() {
  return <Features />;
}
