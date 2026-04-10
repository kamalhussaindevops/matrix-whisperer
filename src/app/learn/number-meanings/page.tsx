import NumberMeanings from "@/views/learn/NumberMeanings";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Destiny Matrix Number Meanings 1-22",
  description:
    "Explore all destiny matrix number meanings from 1 to 22, including archetypes, strengths, lessons, and practical interpretation tips.",
  keywords: [
    "destiny matrix numbers",
    "number meanings 1-22",
    "matrix archetypes",
    "numerology number guide",
    "tarot arcana energies",
    "matrix interpretation reference",
  ],
  path: "/learn/number-meanings",
});

export default function NumberMeaningsPage() {
  return <NumberMeanings />;
}

