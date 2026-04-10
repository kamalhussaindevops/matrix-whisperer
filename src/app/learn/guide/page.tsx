import Guide from "@/views/learn/Guide";
import { buildMetadata } from "@/lib/seo";
import { getMarkdownPage } from "@/lib/getPageContent";

export const metadata = buildMetadata({
  title: "How to Read Your Destiny Matrix",
  description:
    "Follow a complete guide to read your destiny matrix chart, decode key positions, and turn raw numbers into actionable life direction insights.",
  keywords: [
    "how to read destiny matrix",
    "matrix chart reading guide",
    "numerology interpretation steps",
    "destiny matrix tutorial",
    "life purpose chart analysis",
    "matrix beginner guide",
  ],
  path: "/learn/guide",
});

export default async function GuidePage() {
  const content = await getMarkdownPage("guide.md");
  return <Guide content={content} />;
}

