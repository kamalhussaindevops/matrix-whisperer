"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Section { title: string; body: string }
interface PrivacyContent {
  heading?: string;
  lastUpdated?: string;
  intro?: string;
  sections?: Section[];
}

const Privacy = ({ content = {} }: { content?: PrivacyContent }) => {
  const heading     = content.heading     ?? "Privacy Policy";
  const lastUpdated = content.lastUpdated ?? "";
  const intro       = content.intro       ?? "";
  const sections    = content.sections    ?? [
    { title: "Data Collection", body: "The Destiny Matrix Calculator processes your birth date entirely in your browser. We do not store, transmit, or save any personal data you enter." },
    { title: "Cookies",         body: "We may use essential cookies for site functionality. No tracking cookies are used without your consent." },
    { title: "Analytics",       body: "We may collect anonymous usage statistics to improve the site. This data cannot be used to identify individual users." },
    { title: "Contact",         body: "For privacy-related inquiries, please contact us at hello@destinymatrix.com." },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto max-w-2xl px-4">

          <h1 className="font-display text-4xl text-foreground md:text-5xl">{heading}</h1>
          {lastUpdated && (
            <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
          )}
          {intro && (
            <p className="mt-4 text-muted-foreground">{intro}</p>
          )}

          <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-semibold text-foreground mb-2">{s.title}</h2>
                <p>{s.body}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
