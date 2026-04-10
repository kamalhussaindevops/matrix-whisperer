import Index from "@/views/Index";
import { buildMetadata } from "@/lib/seo";
import homepageContent from "../../content/pages/homepage.json";

export const metadata = buildMetadata({
  title: "Destiny Matrix Calculator — Free Life Purpose Reading | DestinyMatrix",
  description:
    "Use the free destiny matrix calculator to reveal life purpose, karmic tasks, love line, money line, and compatibility — instant results, no sign up required.",
  keywords: [
    "destiny matrix calculator free",
    "matrix of destiny chart",
    "free numerology calculator online",
    "life purpose destiny matrix",
    "karmic tail love line numerology",
    "destiny matrix compatibility calculator",
    "money line numerology reading",
    "22 archetypes birth date chart",
  ],
  path: "/",
});

// JSON-LD schemas — Homepage: WebApplication + BreadcrumbList + FAQPage + Organization
const jsonLdSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Destiny Matrix Calculator",
    "alternateName": "Matrix of Destiny Calculator",
    "description":
      "Free online destiny matrix calculator that reveals life purpose, karmic tasks, love line, money line, and compatibility through 22 archetypal energies.",
    "url": "https://thematrix-destiny.netlify.app",
    "applicationCategory": "Numerology",
    "operatingSystem": "Any",
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "500000",
      "bestRating": "5",
      "worstRating": "1",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://thematrix-destiny.netlify.app",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is the Destiny Matrix Calculator free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our calculator is completely free. Enter your birth date and get your full matrix with health chart, interpretations, and life purpose analysis — no sign up required.",
        },
      },
      {
        "@type": "Question",
        "name": "What does the destiny matrix calculator include?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You get a complete matrix with health chart (chakra system), soul comfort zone, talents, money line, karmic tasks, relationship analysis, love line, life purpose, personal year forecast, and much more.",
        },
      },
      {
        "@type": "Question",
        "name": "What is the Compatibility Matrix?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Compatibility Matrix calculates the energy dynamics between two people, showing relationship strengths, challenges, love line compatibility, and potential areas for growth.",
        },
      },
      {
        "@type": "Question",
        "name": "How accurate is the Destiny Matrix?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Destiny Matrix is based on established numerological principles using the 22 archetypal energies. It provides valuable self-reflection insights into your strengths, challenges, and life direction.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DestinyMatrix",
    "url": "https://thematrix-destiny.netlify.app",
    "description":
      "Free online destiny matrix calculator and numerology tools — discover your life purpose, love line, money line, and compatibility.",
    "sameAs": [],
  },
];

export default function HomePage() {
  return (
    <>
      {jsonLdSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Index content={homepageContent} />
    </>
  );
}
