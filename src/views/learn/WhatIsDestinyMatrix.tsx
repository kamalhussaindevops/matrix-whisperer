"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";

const WhatIsDestinyMatrix = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="flex-1 py-16">
      <article className="container mx-auto max-w-2xl px-4">
        <header className="mb-10">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Introduction</span>
          <h1 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-5xl">
            What is the Destiny Matrix?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A modern numerological system that decodes the energies present at your birth.
          </p>
        </header>

        <div className="prose-custom space-y-6 text-muted-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:text-base">
          <p>
            The Destiny Matrix is a numerological system based on 22 archetypal energies. By analyzing the numbers derived from your birth date, it creates a geometric map—your personal matrix—that reveals your strengths, challenges, life purpose, and karmic lessons.
          </p>

          <h2>How Does It Work?</h2>
          <p>
            Your birth date contains three key numbers: the day, month, and year. These numbers are reduced to values between 1 and 22, each corresponding to one of the 22 Major Arcana energies. These energies are then placed into specific positions on a diamond-shaped grid.
          </p>
          <p>
            The positions on the grid represent different aspects of your life: your conscious self, emotional nature, karmic lessons, life purpose, comfort zone, and more. The intersections of the grid's lines create additional energies that add depth to your reading.
          </p>

          <h2>Origins</h2>
          <p>
            The Destiny Matrix method draws from several ancient traditions including Pythagorean numerology, the Tarot's Major Arcana system, and modern energy psychology. It was systematized into its current form in the early 21st century, combining these traditions into a practical self-discovery tool.
          </p>

          <h2>What Can You Learn?</h2>
          <p>
            From your Destiny Matrix, you can discover your personal purpose and life mission, understand your natural talents and gifts, identify patterns and challenges you may face, gain clarity on relationships and career paths, and recognize your comfort zone patterns.
          </p>

          <div className="mt-10 rounded-xl border border-border bg-secondary/50 p-6 text-center">
            <p className="font-display text-xl text-foreground">Ready to discover your matrix?</p>
            <Link
              href="/calculator"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft hover:shadow-glow"
            >
              <Sparkles className="h-4 w-4" /> Try the Free Calculator
            </Link>
          </div>
        </div>
      </article>
    </main>
    <Footer />
  </div>
);

export default WhatIsDestinyMatrix;
