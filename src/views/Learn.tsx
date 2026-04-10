"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Sparkles } from "lucide-react";

const articles = [
  {
    title: "What is the Destiny Matrix?",
    path: "/learn/what-is-destiny-matrix",
    description: "A complete introduction to the Destiny Matrix system, its origins, and how it works to reveal the energies in your life.",
    tag: "Introduction",
  },
  {
    title: "Destiny Matrix Number Meanings (1-22)",
    path: "/learn/number-meanings",
    description: "Explore the meaning of all 22 archetypal energies used in the Destiny Matrix system. Learn what each number reveals.",
    tag: "Reference",
  },
  {
    title: "Complete Guide to Reading Your Matrix",
    path: "/learn/guide",
    description: "A step-by-step guide to understanding the positions, lines, and intersections in your personal Destiny Matrix.",
    tag: "Guide",
  },
];

const Learn = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border py-14 text-center bg-constellation">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-3xl text-foreground sm:text-4xl md:text-5xl">
              Learn About <span className="text-gradient-primary">Destiny Matrix</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Educational guides and in-depth articles to help you understand and use the Destiny Matrix system.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-3xl px-4 space-y-6">
            {articles.map((article) => (
              <Link
                key={article.path}
                href={article.path}
                className="group block rounded-xl border border-border bg-gradient-card p-6 shadow-soft transition-all hover:border-primary/30 hover:shadow-glow"
              >
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {article.tag}
                </span>
                <h2 className="mt-3 font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{article.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read article <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border py-12 text-center bg-constellation">
          <Link
            href="/calculator"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-primary px-8 text-base font-bold text-primary-foreground shadow-glow hover:scale-105 transition-all"
          >
            <Sparkles className="h-4 w-4" /> Try the Free Calculator
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
