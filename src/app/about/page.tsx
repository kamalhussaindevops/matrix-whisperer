import About from "@/views/About";
import { buildMetadata } from "@/lib/seo";
import { getJsonPage } from "@/lib/getPageContent";

export const metadata = buildMetadata({
  title: "About Destiny Matrix Platform",
  description:
    "Learn the mission behind our destiny matrix numerology platform and how we combine ancient archetypal wisdom with practical modern insights.",
  keywords: [
    "about destiny matrix",
    "numerology platform",
    "matrix of destiny mission",
    "spiritual self discovery",
    "destiny chart project",
    "numerology experts",
  ],
  path: "/about",
});

export default function AboutPage() {
  const content = getJsonPage("about.json");
  return <About content={content} />;
}

