import Calculator from "@/views/Calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Arcana Calculator — Discover Your Dominant & Shadow Archetypes",
  description:
    "Free arcana calculator reveals your dominant archetype, shadow energy, guide, challenge, gift, path, essence, and life cycle from your birth date.",
  keywords: [
    "arcana calculator",
    "dominant archetype numerology",
    "shadow archetype reading",
    "destiny matrix arcana",
  ],
  path: "/year-forecast",
});

export default function YearForecastPage() {
  return <Calculator initialTab="arcana" />;
}
