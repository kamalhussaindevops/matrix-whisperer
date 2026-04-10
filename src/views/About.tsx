"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Stat { value: string; label: string }
interface AboutContent {
  heading?: string;
  tagline?: string;
  paragraphs?: string[];
  stats?: Stat[];
  cta?: { text?: string; href?: string };
}

const About = ({ content = {} }: { content?: AboutContent }) => {
  const heading    = content.heading    ?? "About DestinyMatrix";
  const tagline    = content.tagline    ?? "";
  const paragraphs = content.paragraphs ?? [
    "DestinyMatrix is a modern numerology platform designed to make the ancient wisdom of the 22 archetypal energies accessible to everyone. We believe self-knowledge is the foundation of a fulfilling life.",
    "Our free calculator uses established numerological principles to generate your personal Destiny Matrix from your birth date. Every interpretation is carefully crafted to provide meaningful, actionable insights.",
    "We're committed to building the most accurate, beautiful, and user-friendly Destiny Matrix tool available. Our goal is to combine the depth of traditional numerology with the precision and clarity of modern design.",
  ];
  const stats   = content.stats    ?? [];
  const ctaText = content.cta?.text ?? "Try the Free Calculator";
  const ctaHref = content.cta?.href ?? "/calculator";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto max-w-2xl px-4">

          <h1 className="font-display text-4xl text-foreground md:text-5xl">{heading}</h1>
          {tagline && (
            <p className="mt-3 text-lg font-medium text-primary">{tagline}</p>
          )}

          <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {stats.length > 0 && (
            <div className="mt-10 grid grid-cols-3 gap-4 rounded-xl border border-border bg-card p-6 shadow-soft text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl text-primary">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:scale-105 transition-all"
            >
              {ctaText}
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
