"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { interpretations } from "@/lib/matrixInterpretations";
import { Sparkles } from "lucide-react";

const NumberMeanings = () => {
  const allEnergies = Object.values(interpretations);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <header className="mb-10">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Reference</span>
            <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
              Destiny Matrix Number Meanings
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore the meaning of all 22 archetypal energies.
            </p>
          </header>

          <div className="space-y-4">
            {allEnergies.map((energy) => (
              <div key={energy.number} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary">
                    {energy.number}
                  </span>
                  <div>
                    <h2 className="font-display text-lg text-foreground">{energy.name}</h2>
                    <p className="text-xs text-muted-foreground">{energy.archetype}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{energy.positive}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft hover:shadow-glow"
            >
              <Sparkles className="h-4 w-4" /> Calculate Your Matrix
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NumberMeanings;
