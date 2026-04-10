import Calculator from "@/views/Calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Destiny Matrix Personal Calculator",
  description:
    "Generate your personal destiny matrix chart from your birth date and explore life mission, money energy, talents, chakra health chart, and yearly themes.",
  keywords: [
    "personal destiny matrix",
    "birth date matrix calculator",
    "numerology chart online",
    "matrix personal purpose",
    "chakra health matrix",
    "destiny chart reading",
    "matrix numerology tool",
  ],
  path: "/calculator",
});

export default function CalculatorPage() {
  return <Calculator initialTab="personal" />;
}

