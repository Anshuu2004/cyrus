import type { Metadata } from "next";
import About from "@/views/About";

export const metadata: Metadata = { title: "About", description: "The story, the method and the companies behind the index." };

export default function Page() {
  return <About />;
}
