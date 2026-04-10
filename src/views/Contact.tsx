"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="flex-1 py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="font-display text-4xl text-foreground md:text-5xl">Contact Us</h1>
        <p className="mt-4 text-muted-foreground">
          Have questions or feedback? We'd love to hear from you.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-soft">
          <p className="text-sm text-muted-foreground">
            Email us at <span className="font-medium text-foreground">hello@destinymatrix.com</span>
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Contact;
