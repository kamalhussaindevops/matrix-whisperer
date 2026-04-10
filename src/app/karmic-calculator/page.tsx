import type { Metadata } from "next";
import Calculator from "@/views/Calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Karmic Tail Calculator — Uncover Your Repeating Karmic Patterns",
  description:
    "Free karmic tail calculator reveals ancestral patterns, karmic debt, lesson, release point, and reward from your birth date. Includes guide to breaking karmic cycles.",
  keywords: [
    "karmic calculator",
    "karmic tail calculator",
    "karmic debt numerology",
    "karma lesson calculator",
    "destiny matrix karma",
    "karmic patterns numerology",
    "karmic release point",
  ],
  path: "/karmic-calculator",
});

const faqItems = [
  {
    q: "What is the Karmic Tail in the Matrix of Destiny?",
    a: "The Karmic Tail is a sequence of numbers derived from your birth date that describes inherited ancestral patterns — emotional loops, behavioral tendencies, and energetic themes passed down through your lineage. Unlike karmic debt (which is earned through your own choices), the karmic tail represents patterns you inherited at birth that influence your default responses until you become aware of them and choose differently.",
  },
  {
    q: "How is the Karmic Tail calculated from my birth date?",
    a: "The karmic tail is calculated from specific position combinations in your destiny matrix. It typically involves the C position (reduced year) and the G position (the diagonal between C and D), along with their interaction with the center energy. These positions together describe the ancestral energetic thread that runs through your chart — the pattern your lineage most needs to resolve in your lifetime.",
  },
  {
    q: "Can I change or overcome my karmic patterns?",
    a: "Yes. The Matrix of Destiny is not a fatalistic system. The karmic tail describes tendencies and inherited defaults, not fixed outcomes. Awareness is the first step: once you can see the pattern clearly, you can interrupt it with deliberate choices. Most practitioners find that consistent small behavioral changes — rooted in understanding the specific energy involved — produce lasting shifts over weeks and months rather than years.",
  },
  {
    q: "What is the difference between the Karmic Tail and life purpose?",
    a: "The life purpose (personal purpose line) describes what you are moving toward — the soul mission you are here to fulfill. The karmic tail describes what you are moving from — the inherited pattern that must be acknowledged and transcended for your purpose to fully express. In a healthy chart reading, both are studied together: the tail shows the starting point and the purpose shows the destination.",
  },
  {
    q: "How many numbers are in the Karmic Tail and what do they mean?",
    a: "The karmic tail typically consists of two to four position values. The first number describes the core ancestral pattern — the energy most deeply embedded in your lineage. The second describes how that pattern manifests in your daily behavior and relationships. Additional positions reveal the release point (the energy that breaks the cycle when consciously applied) and the reward energy (what opens up in your life once the pattern is resolved).",
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
  name: "Karmic Tail Calculator — Matrix of Destiny",
  description: "Free karmic tail calculator revealing ancestral patterns and karmic cycles from your birth date.",
  url: "https://thematrix-destiny.netlify.app/karmic-calculator",
  applicationCategory: "Numerology",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "500000", bestRating: "5", worstRating: "1" },
};

export default function KarmicCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <Calculator initialTab="karmic" />
    </>
  );
}
