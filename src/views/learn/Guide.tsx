"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";
import type { MarkdownPage } from "@/lib/getPageContent";

const Guide = ({ content }: { content?: MarkdownPage }) => {
  const title       = content?.title       ?? "Complete Guide to Reading Your Destiny Matrix";
  const subtitle    = content?.subtitle    ?? "";
  const badge       = content?.badge       ?? "Guide";
  const ctaText     = content?.ctaText     ?? "Try the Free Calculator";
  const ctaHref     = content?.ctaHref     ?? "/calculator";
  const contentHtml = content?.contentHtml ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16">
        <article className="container mx-auto max-w-2xl px-4">
          <header className="mb-10">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {badge}
            </span>
            <h1 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
            )}
          </header>

          <div
            className="space-y-6 text-muted-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <div className="mt-10 rounded-xl border border-border bg-secondary/50 p-6 text-center">
            <p className="font-display text-xl text-foreground">Put this knowledge into practice</p>
            <p className="mt-2 text-sm text-muted-foreground">Generate your matrix and apply what you've learned.</p>
            <Link
              href={ctaHref}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft hover:shadow-glow"
            >
              <Sparkles className="h-4 w-4" /> {ctaText}
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Guide;
