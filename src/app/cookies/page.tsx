import type { Metadata } from "next";
import Legal from "@/views/Legal";

export const metadata: Metadata = { title: "Cookies" };

export default function Page() {
  return <Legal kind="cookies" />;
}
