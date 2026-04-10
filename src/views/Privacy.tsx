"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="flex-1 py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="font-display text-4xl text-foreground md:text-5xl">Privacy Policy</h1>
        <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed [&_h2]:font-sans [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-2">
          <p>Last updated: March 2026</p>
          <h2>Data Collection</h2>
          <p>The Destiny Matrix Calculator processes your birth date entirely in your browser. We do not store, transmit, or save any personal data you enter.</p>
          <h2>Cookies</h2>
          <p>We may use essential cookies for site functionality. No tracking cookies are used without your consent.</p>
          <h2>Analytics</h2>
          <p>We may collect anonymous usage statistics to improve the site. This data cannot be used to identify individual users.</p>
          <h2>Contact</h2>
          <p>For privacy-related inquiries, please contact us at hello@destinymatrix.com.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
