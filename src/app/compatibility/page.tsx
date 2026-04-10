import Calculator from "@/views/Calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Destiny Matrix Compatibility Check",
  description:
    "Run a destiny matrix compatibility check for two birth dates and see relationship strengths, challenges, emotional alignment, and practical guidance.",
  keywords: [
    "destiny matrix compatibility",
    "compatibility numerology",
    "relationship matrix calculator",
    "partner energy match",
    "birth date compatibility",
    "couple numerology chart",
    "matrix love score",
  ],
  path: "/compatibility",
});

export default function CompatibilityPage() {
  return <Calculator initialTab="compatibility" />;
}

