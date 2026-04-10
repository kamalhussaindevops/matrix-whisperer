import Learn from "@/views/Learn";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Learn Destiny Matrix Numerology",
  description:
    "Study destiny matrix numerology with practical guides on chart structure, archetypal number meanings, and step-by-step interpretation skills.",
  keywords: [
    "learn destiny matrix",
    "numerology education",
    "matrix chart guide",
    "number meanings 1 to 22",
    "destiny matrix tutorial",
    "matrix interpretation training",
  ],
  path: "/learn",
});

export default function LearnPage() {
  return <Learn />;
}

