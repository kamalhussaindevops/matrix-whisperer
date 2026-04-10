"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";

const Guide = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="flex-1 py-16">
      <article className="container mx-auto max-w-2xl px-4">
        <header className="mb-10">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Guide</span>
          <h1 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-5xl">
            Complete Guide to Reading Your Destiny Matrix
          </h1>
        </header>

        <div className="space-y-6 text-muted-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4">
          <p>
            This guide walks you through every position in the Destiny Matrix and what it means for your life. After generating your matrix, use this reference to understand each number's placement.
          </p>

          <h2>Step 1: Understanding the Grid</h2>
          <p>
            The Destiny Matrix is displayed as a diamond shape with four main points (top, right, bottom, left) and a center. These five positions represent your core energies. The intersections between the main points create four additional energies that add nuance.
          </p>

          <h2>Step 2: The Four Corners</h2>
          <p>
            <strong className="text-foreground">Top (Day Energy):</strong> Represents your conscious self—the qualities you show to the world and are aware of. This is derived from your birth day.
          </p>
          <p>
            <strong className="text-foreground">Right (Month Energy):</strong> Represents your emotional nature and inner world. This comes from your birth month.
          </p>
          <p>
            <strong className="text-foreground">Bottom (Year Energy):</strong> Represents your karmic lessons—the challenges and growth opportunities you carry from past experiences.
          </p>
          <p>
            <strong className="text-foreground">Left (Sum Energy):</strong> Represents the synthesis of your other three main energies, showing how they combine in practice.
          </p>

          <h2>Step 3: The Center</h2>
          <p>
            The center of your matrix is the sum of all four corner energies, reduced to 1-22. This is your core essence—the fundamental energy that underlies everything else in your matrix.
          </p>

          <h2>Step 4: Purpose Line</h2>
          <p>
            Your purpose is calculated from the diagonal energies. The <strong className="text-foreground">Sky Purpose</strong> (top + right) shows your spiritual direction. The <strong className="text-foreground">Earth Purpose</strong> (bottom + left) shows your material direction. Together they form your <strong className="text-foreground">Personal Purpose</strong>.
          </p>

          <h2>Step 5: Reading the Intersections</h2>
          <p>
            The four intersection points between the main corners add depth. They reveal the energies that emerge when different aspects of your personality interact—showing how your conscious self relates to your emotions, how your karma interacts with your synthesis, and so on.
          </p>

          <h2>Step 6: Comfort Zone</h2>
          <p>
            The comfort zone energy is calculated from all four intersection points. It reveals the energy pattern you default to when you're not consciously choosing—your autopilot mode. Understanding this helps you recognize when you're coasting and when you're growing.
          </p>

          <div className="mt-10 rounded-xl border border-border bg-secondary/50 p-6 text-center">
            <p className="font-display text-xl text-foreground">Put this knowledge into practice</p>
            <p className="mt-2 text-sm text-muted-foreground">Generate your matrix and apply what you've learned.</p>
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

export default Guide;
