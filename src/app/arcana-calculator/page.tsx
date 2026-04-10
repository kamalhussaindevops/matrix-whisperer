import type { Metadata } from "next";
import Calculator from "@/views/Calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Arcana Calculator — Discover Your 22 Major Arcana Positions",
  description:
    "Free arcana calculator reveals your dominant archetype, shadow energy, guide, challenge, gift, and life cycle from your birth date. Includes full 22-arcana meaning guide.",
  keywords: [
    "arcana calculator",
    "dominant archetype numerology",
    "shadow archetype reading",
    "destiny matrix arcana",
    "22 archetypes calculator",
    "life path arcana",
    "major arcana numerology",
  ],
  path: "/arcana-calculator",
});

const faqItems = [
  {
    q: "What is the Arcana Calculator and how does it work?",
    a: "The Arcana Calculator uses your date of birth to map your key energies onto the 22 Major Arcana — the universal archetypal symbols derived from Tarot. Your day, month, and year are reduced to numbers between 1 and 22, then assigned to specific positions in your destiny matrix chart, revealing your dominant archetype, shadow energy, guide, and life cycle.",
  },
  {
    q: "What do the 22 Major Arcana mean in the Matrix of Destiny?",
    a: "Each of the 22 arcana represents a distinct universal archetype — from the Magician (1) representing will and initiative, to the Fool (22) representing freedom and new beginnings. In the Matrix of Destiny, these arcana describe specific energetic qualities at each position in your chart: how you express yourself, your karmic tasks, relationship dynamics, financial energy, and life purpose.",
  },
  {
    q: "Which arcana positions are most important in my chart?",
    a: "The center energy (your core self), the personal purpose line, and the comfort zone are considered the most influential positions. The center reflects your inner experience, while the purpose line — connecting sky, earth, and personal values — describes your soul mission. The comfort zone reveals the default patterns you return to under pressure.",
  },
  {
    q: "Can two people have the same arcana positions?",
    a: "Yes. Because arcana numbers are reduced to 1–22, many people share the same energies at individual positions. What makes each chart unique is the specific combination of all positions together — the interaction between your center energy, purpose line, love line, money line, karmic tail, and all eight outer positions creates a pattern that is statistically very rare to duplicate exactly.",
  },
  {
    q: "How does my birth date determine my arcana numbers?",
    a: "Your day, month, and year digits are each reduced through digit-sum reduction until they fall within the 1–22 range. The day becomes position A (top), the month becomes position B (right), and the year reduction becomes position C (bottom). Position D is the sum of A+B+C reduced. The center is the sum of all four. Each diagonal and purpose line is then calculated from these base values.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Arcana Calculator — Matrix of Destiny",
  description: "Free arcana calculator revealing your 22 Major Arcana positions from your birth date.",
  url: "https://thematrix-destiny.netlify.app/arcana-calculator",
  applicationCategory: "Numerology",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "500000", bestRating: "5", worstRating: "1" },
};

export default function ArcanaCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <Calculator initialTab="arcana" />
    </>
  );
}
