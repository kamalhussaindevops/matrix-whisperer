"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="flex-1 py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="font-display text-4xl text-foreground md:text-5xl">About DestinyMatrix</h1>
        <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            DestinyMatrix is a modern numerology platform designed to make the ancient wisdom of the 22 archetypal energies accessible to everyone. We believe self-knowledge is the foundation of a fulfilling life.
          </p>
          <p>
            Our free calculator uses established numerological principles to generate your personal Destiny Matrix from your birth date. Every interpretation is carefully crafted to provide meaningful, actionable insights.
          </p>
          <p>
            We're committed to building the most accurate, beautiful, and user-friendly Destiny Matrix tool available. Our goal is to combine the depth of traditional numerology with the precision and clarity of modern design.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default About;
