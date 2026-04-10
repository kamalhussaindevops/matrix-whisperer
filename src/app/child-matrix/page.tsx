import Calculator from "@/views/Calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Child Matrix Numerology Calculator",
  description:
    "Calculate a child matrix chart to understand talents, learning style, emotional patterns, and developmental strengths using destiny matrix numerology.",
  keywords: [
    "child matrix calculator",
    "child numerology chart",
    "parenting numerology tool",
    "kids destiny matrix",
    "child talents numerology",
    "birth date child reading",
    "family matrix insights",
  ],
  path: "/child-matrix",
});

export default function ChildMatrixPage() {
  return <Calculator initialTab="child" />;
}

