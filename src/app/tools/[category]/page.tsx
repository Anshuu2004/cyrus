import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolsCategory from "@/views/Tools/ToolsCategory";
import { TOOL_CATEGORIES } from "@/lib/tools/types";

export function generateStaticParams() {
  return TOOL_CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = TOOL_CATEGORIES.find((c) => c.id === category);
  if (!cat) return {};
  return { title: `Artifacts: ${cat.label}`, description: cat.blurb };
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = TOOL_CATEGORIES.find((c) => c.id === category);
  if (!cat) notFound();
  return <ToolsCategory catId={cat.id} />;
}
