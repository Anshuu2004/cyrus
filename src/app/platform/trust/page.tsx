import type { Metadata } from "next";
import Trust from "@/views/Trust";

export const metadata: Metadata = { title: "Trust centre", description: "Where the data comes from, how it is refreshed and what we never do with your account." };

export default function Page() {
  return <Trust />;
}
