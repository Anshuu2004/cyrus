import type { Metadata } from "next";
import Apis from "@/views/Apis";

export const metadata: Metadata = {
  title: "Free APIs",
  description: "1996 free public APIs, filtered for HTTPS and labeled by auth - no key, free key, OAuth - with CORS and docs on every card.",
};

export default function Page() {
  return <Apis />;
}
