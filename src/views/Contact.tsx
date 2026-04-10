"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Topic { icon?: string; title: string; body: string }
interface ContactContent {
  heading?: string;
  description?: string;
  email?: string;
  responseTime?: string;
  topics?: Topic[];
}

const Contact = ({ content = {} }: { content?: ContactContent }) => {
  const heading      = content.heading      ?? "Contact Us";
  const description  = content.description  ?? "Have questions or feedback? We'd love to hear from you.";
  const email        = content.email        ?? "hello@destinymatrix.com";
  const responseTime = content.responseTime ?? "";
  const topics       = content.topics       ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto max-w-2xl px-4">

          <h1 className="font-display text-4xl text-foreground md:text-5xl">{heading}</h1>
          <p className="mt-4 text-muted-foreground">{description}</p>

          {topics.length > 0 && (
            <div className="mt-8 grid gap-4">
              {topics.map((t) => (
                <div key={t.title} className="rounded-xl border border-border bg-card p-5 shadow-soft flex gap-4 items-start">
                  {t.icon && <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{t.icon}</span>}
                  <div>
                    <p className="font-semibold text-foreground">{t.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">
              Email us at{" "}
              <a href={`mailto:${email}`} className="font-medium text-primary hover:underline">
                {email}
              </a>
            </p>
            {responseTime && (
              <p className="mt-2 text-xs text-muted-foreground">{responseTime}</p>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
