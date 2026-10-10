import type { Metadata } from "next";
import Legal from "@/views/Legal";

export const metadata: Metadata = { title: "Privacy" };

export default function Page() {
  return <Legal kind="privacy" />;
}
