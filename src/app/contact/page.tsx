import Contact from "@/views/Contact";
import { buildMetadata } from "@/lib/seo";
import { getJsonPage } from "@/lib/getPageContent";

export const metadata = buildMetadata({
  title: "Contact Destiny Matrix Support",
  description:
    "Contact the destiny matrix team for questions, partnerships, feedback, and support about our numerology calculators and interpretation tools.",
  keywords: [
    "contact destiny matrix",
    "numerology support",
    "matrix calculator help",
    "destiny matrix feedback",
    "numerology contact page",
    "customer support numerology",
  ],
  path: "/contact",
});

export default function ContactPage() {
  const content = getJsonPage("contact.json");
  return <Contact content={content} />;
}

