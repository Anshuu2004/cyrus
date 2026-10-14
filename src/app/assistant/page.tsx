import type { Metadata } from "next";
import Assistant from "@/views/Assistant";

export const metadata: Metadata = {
  title: "Assistant",
  description: "Ask cyrus's own helper - an open-source Llama model - about hackathons, the matcher, artifacts, free APIs and sign-in.",
};

export default function Page() {
  return <Assistant />;
}
