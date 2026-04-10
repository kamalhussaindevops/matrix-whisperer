import WhatIsDestinyMatrix from "@/views/learn/WhatIsDestinyMatrix";
import { buildMetadata } from "@/lib/seo";
import { getMarkdownPage } from "@/lib/getPageContent";

export const metadata = buildMetadata({
  title: "What Is Destiny Matrix Numerology",
  description:
    "Understand what destiny matrix numerology is, where it comes from, and how a birth date becomes a practical map of purpose and growth.",
  keywords: [
    "what is destiny matrix",
    "matrix numerology explained",
    "archetypal numerology system",
    "birth date matrix method",
    "destiny matrix origins",
    "spiritual chart basics",
  ],
  path: "/learn/what-is-destiny-matrix",
});

export default async function WhatIsDestinyMatrixPage() {
  const content = await getMarkdownPage("what-is-destiny-matrix.md");
  return <WhatIsDestinyMatrix content={content} />;
}

