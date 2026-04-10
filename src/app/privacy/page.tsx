import Privacy from "@/views/Privacy";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Destiny Matrix Privacy Policy",
  description:
    "Read how our destiny matrix calculator handles browser-based data, privacy commitments, cookies, and anonymous analytics in clear terms.",
  keywords: [
    "destiny matrix privacy",
    "numerology privacy policy",
    "browser data processing",
    "matrix calculator security",
    "cookie policy numerology",
    "anonymous analytics",
  ],
  path: "/privacy",
});

export default function PrivacyPage() {
  return <Privacy />;
}

