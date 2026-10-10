import type { Metadata } from "next";
import Legal from "@/views/Legal";

export const metadata: Metadata = { title: "Terms" };

export default function Page() {
  return <Legal kind="terms" />;
}
