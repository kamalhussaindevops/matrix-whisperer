"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DateOfBirthSelector from "@/components/DateOfBirthSelector";
import MatrixVisualization from "@/components/MatrixVisualization";
import { calculateMatrix, MatrixResult } from "@/lib/matrixCalculations";
import { getInterpretation } from "@/lib/matrixInterpretations";

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  loading: () => <div className="shimmer" style={{ height: "400px", borderRadius: "32px", margin: "48px 0" }} />,
});

const defaultFaqs = [
  { q: "Is the Destiny Matrix Calculator free?", a: "Yes, completely free. Enter your birth date and get your full matrix with health chart, interpretations, and life purpose analysis — no sign up required." },
  { q: "What does the calculator include?", a: "A complete matrix with health chart (chakra system), soul comfort zone, talents, money energy, karmic tasks, relationship analysis, life purpose, personal year forecast, and more." },
  { q: "How accurate is the Destiny Matrix?", a: "Based on established numerological principles using 22 archetypal energies. It provides valuable self-reflection insights into your strengths, challenges, and life direction." },
  { q: "What is the Compatibility Matrix?", a: "It calculates the energy dynamics between two people, showing relationship strengths, challenges, love line compatibility, and growth potential." },
  { q: "Can I check my child's matrix?", a: "Yes! Our Child Matrix calculator helps parents understand their child's natural talents, challenges, and best development strategies." },
];

interface HomepageContent {
  hero?: { title?: string; subtitle?: string; ctaText?: string };
  whatIsMatrix?: { title?: string; body?: string; ctaText?: string; ctaLink?: string };
  cta?: { title?: string; subtitle?: string; buttonText?: string };
  faq?: { q: string; a: string }[];
}

const Index = ({ content }: { content?: HomepageContent }) => {
  const c = content ?? {};
  const hero = c.hero ?? {};
  const wim = c.whatIsMatrix ?? {};
  const cta = c.cta ?? {};
  const faqs = c.faq?.length ? c.faq : defaultFaqs;

  const [quickResult, setQuickResult] = useState<MatrixResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [dob, setDob] = useState<Date | undefined>();
  const [gender, setGender] = useState<"M" | "F">("F");

  const handleCalculate = () => {
    if (!dob) return;
    const result = calculateMatrix(dob, name || undefined, gender);
    setQuickResult(result);
  };

  return (
    <div style={{ background: "#f8f9fc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1 }}>

        {/* ─────────────────────── HERO ─────────────────────────── */}
        <section
          aria-label="Free Destiny Matrix Calculator"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "32px 0 24px",
            borderRadius: "0 0 32px 32px",
            textAlign: "center",
          }}
        >
          <div className="container mx-auto" style={{ padding: "0 16px" }}>
            <h1
              className="text-white"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "12px",
                lineHeight: 1.2,
              }}
            >
              {hero.title ?? "All-in-One Destiny Matrix Calculator"}
            </h1>

            <p
              className="text-white mx-auto"
              style={{
                fontSize: "clamp(0.95rem, 2.5vw, 1.25rem)",
                fontWeight: 400,
                opacity: 0.95,
                maxWidth: "540px",
                marginBottom: "28px",
                lineHeight: 1.6,
              }}
            >
              {hero.subtitle ?? "Discover life purpose, love line, money line, karmic tail, and compatibility — all from your birth date."}
            </p>

            {/* Simple personal matrix calculator card */}
            <div
              className="mx-auto"
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                boxShadow: "0 20px 35px -10px rgba(0,0,0,0.2)",
                padding: "24px",
                maxWidth: "480px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "16px",
                    background: "#ffffff",
                    color: "#1a1a2e",
                    width: "100%",
                    outline: "none",
                    boxSizing: "border-box",
                    minHeight: "52px",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; }}
                />
                <DateOfBirthSelector value={dob} onChange={setDob} />
                <div>
                  <div style={{ display: "flex", border: "1px solid #cbd5e1", borderRadius: "12px", overflow: "hidden" }}>
                    <button
                      type="button"
                      onClick={() => setGender("F")}
                      style={{
                        flex: 1,
                        padding: "12px",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        minHeight: "48px",
                        background: gender === "F" ? "#4f46e5" : "#ffffff",
                        color: gender === "F" ? "#ffffff" : "#475569",
                      }}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("M")}
                      style={{
                        flex: 1,
                        padding: "12px",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        border: "none",
                        borderLeft: "1px solid #cbd5e1",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        minHeight: "48px",
                        background: gender === "M" ? "#4f46e5" : "#ffffff",
                        color: gender === "M" ? "#ffffff" : "#475569",
                      }}
                    >
                      Male
                    </button>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", textAlign: "center", marginTop: "6px" }}>
                    Gender affects certain matrix positions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCalculate}
                  disabled={!dob}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 16px",
                    width: "100%",
                    background: !dob ? "#94a3b8" : "#4f46e5",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "1rem",
                    border: "none",
                    borderRadius: "12px",
                    cursor: !dob ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s",
                    minHeight: "52px",
                  }}
                  onMouseEnter={(e) => {
                    if (dob) (e.currentTarget as HTMLButtonElement).style.background = "#4338ca";
                  }}
                  onMouseLeave={(e) => {
                    if (dob) (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5";
                  }}
                >
                  <Sparkles style={{ width: "1rem", height: "1rem" }} />
                  Calculate My Matrix
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Quick result ─── */}
        {quickResult && (
          <section aria-label="Your matrix preview" style={{ padding: "24px 0 32px" }}>
            <div className="container mx-auto" style={{ padding: "0 16px" }}>
              <div
                style={{
                  maxWidth: "900px",
                  margin: "0 auto",
                  display: "grid",
                  gap: "24px",
                  gridTemplateColumns: "1fr",
                }}
                className="md:!grid-cols-2"
              >
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid #eef2ff",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <MatrixVisualization result={quickResult} size="large" />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#1e1b4b",
                      marginBottom: "14px",
                    }}
                  >
                    {quickResult.name && (
                      <span style={{ color: "#4f46e5" }}>{quickResult.name}&rsquo;s </span>
                    )}
                    Key Energies
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      marginBottom: "16px",
                    }}
                  >
                    {[
                      { label: "Life Purpose", value: quickResult.personalPurpose },
                      { label: "Center Energy", value: quickResult.center },
                      { label: "Comfort Zone", value: quickResult.comfortZone },
                      { label: "Money Energy", value: quickResult.money },
                      { label: "Talents", value: quickResult.talents },
                      { label: "Relationships", value: quickResult.relationship },
                    ].map((item) => {
                      const interp = getInterpretation(item.value);
                      return (
                        <div
                          key={item.label}
                          style={{
                            background: "#f8f9fc",
                            border: "1px solid #eef2ff",
                            borderRadius: "12px",
                            padding: "10px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "28px",
                                height: "28px",
                                borderRadius: "999px",
                                background: "#e0e7ff",
                                color: "#4f46e5",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {item.value}
                            </span>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                                {item.label}
                              </p>
                              <p style={{ fontSize: "0.65rem", color: "#64748b", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {interp.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Link
                    href="/calculator"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "12px",
                      background: "#4f46e5",
                      color: "#ffffff",
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      textDecoration: "none",
                      minHeight: "48px",
                    }}
                  >
                    View Full Detailed Analysis
                    <ArrowRight style={{ width: "16px", height: "16px" }} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────── CALCULATOR HUB ──────────────────── */}
        <section style={{ padding: "52px 0", background: "#f1f5f9" }}>
          <div className="container mx-auto" style={{ padding: "0 16px" }}>
            <h2
              style={{
                fontSize: "clamp(1.4rem, 4vw, 1.875rem)",
                fontWeight: 800,
                textAlign: "center",
                color: "#1e1b4b",
                marginBottom: "6px",
              }}
            >
              Calculator Hub
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "#475569",
                marginBottom: "32px",
                fontSize: "0.95rem",
              }}
            >
              Six powerful tools to uncover every aspect of your destiny matrix.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "14px",
                maxWidth: "960px",
                margin: "0 auto",
              }}
            >
              {[
                {
                  emoji: "🔮",
                  bg: "#e0e7ff",
                  iconColor: "#4f46e5",
                  title: "Personal Matrix",
                  desc: "Full birth chart with health, karmic tasks, talents, money energy, and life purpose.",
                  href: "/calculator",
                },
                {
                  emoji: "❤️",
                  bg: "#fee2e2",
                  iconColor: "#e11d48",
                  title: "Compatibility",
                  desc: "Relationship dynamics, strengths, challenges, and love line compatibility.",
                  href: "/compatibility",
                },
                {
                  emoji: "🌱",
                  bg: "#d1fae5",
                  iconColor: "#059669",
                  title: "Child Matrix",
                  desc: "Understand your child's talents, challenges, and best support strategies.",
                  href: "/child-matrix",
                },
                {
                  emoji: "✨",
                  bg: "#fef3c7",
                  iconColor: "#d97706",
                  title: "Arcana Calculator",
                  desc: "Discover your dominant archetype, shadow energy, guide, and life cycle path.",
                  href: "/arcana-calculator",
                },
                {
                  emoji: "🔥",
                  bg: "#ede9fe",
                  iconColor: "#7c3aed",
                  title: "Karmic Calculator",
                  desc: "Uncover karmic debt, lesson, tail, release point, and reward energy.",
                  href: "/karmic-calculator",
                },
                {
                  emoji: "📖",
                  bg: "#e0f2fe",
                  iconColor: "#0284c7",
                  title: "What is Matrix of Destiny?",
                  desc: "Read the complete Matrix of Destiny guide — what it is, how it works, and how to read your chart.",
                  href: "/learn",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid #eef2ff",
                    padding: "20px",
                    textDecoration: "none",
                    color: "inherit",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(79,70,229,0.12)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "12px",
                      background: item.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.35rem",
                      flexShrink: 0,
                    }}
                  >
                    {item.emoji}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e1b4b", marginBottom: "5px" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.55 }}>{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──────── WHAT IS THE MATRIX OF DESTINY? ───────── */}
        <section className="section" id="what-is-matrix" style={{ padding: "48px 0" }}>
          <div className="container mx-auto" style={{ padding: "0 16px", maxWidth: "800px" }}>
            <h2
              style={{
                fontSize: "clamp(1.4rem, 4vw, 1.875rem)",
                fontWeight: 700,
                textAlign: "center",
                color: "#1e1b4b",
                marginBottom: "16px",
              }}
            >
              {wim.title ?? "What is the Matrix of Destiny?"}
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "#475569",
                lineHeight: 1.65,
                maxWidth: "700px",
                margin: "0 auto 24px",
              }}
            >
              {wim.body ?? "The Matrix of Destiny is a self-discovery system that uses your date of birth to generate a personal destiny matrix chart — revealing your life purpose, karmic patterns, and energetic blueprint through the 22 major arcana. Created by Natalia Ladini in 2006, it combines numerology, Tarot, Kabbalistic wisdom, and the chakra energy system into one complete reading."}
            </p>
            <div style={{ textAlign: "center" }}>
              <Link
                href={wim.ctaLink ?? "/blog"}
                className="guide-cta-link"
                style={{
                  color: "#4f46e5",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "1rem",
                  borderBottom: "2px solid #e0e7ff",
                  paddingBottom: "2px",
                  transition: "border-color 0.2s, color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#4338ca";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#4f46e5";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#4f46e5";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e0e7ff";
                }}
              >
                {wim.ctaText ?? "Read the complete Matrix of Destiny guide — what it is, how it works, and how to read your chart"} &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ──────────────── WHAT YOUR MATRIX REVEALS ───────────── */}
        <section style={{ padding: "40px 0", background: "#f1f5f9" }}>
          <div className="container mx-auto" style={{ padding: "0 16px" }}>
            <h2
              style={{
                fontSize: "clamp(1.4rem, 4vw, 1.875rem)",
                fontWeight: 700,
                textAlign: "center",
                color: "#1e1b4b",
                marginBottom: "8px",
              }}
            >
              What Your Destiny Matrix Chart Reveals
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "#475569",
                marginBottom: "28px",
                fontSize: "0.95rem",
              }}
            >
              Six dimensions — all generated from your date of birth in the free calculator above.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                gap: "16px",
                maxWidth: "960px",
                margin: "0 auto",
              }}
            >
              {[
                { num: "01", title: "Core Essence Calculator — Your Inner Self", desc: "The central number in your destiny matrix chart — the energy that defines how you experience yourself from the inside out.", cta: "Read the complete Core Essence guide", link: "/learn/guide" },
                { num: "02", title: "Karmic Tail Calculator — Find Your Repeating Pattern", desc: "The repeating pattern from your ancestral lineage — and the reason certain struggles keep returning.", cta: "Read the complete Karmic Tail guide", link: "/karmic-calculator" },
                { num: "03", title: "Love Line Calculator — Your Relationship Blueprint", desc: "Your relationship blueprint — how you love, what you attract, and the energetic contract behind every connection you form.", cta: "Read the complete Love Line guide", link: "/compatibility" },
                { num: "04", title: "Money Line Calculator — Your Financial Energy", desc: "Your financial blueprint — where abundance flows naturally and where energy blocks are limiting your prosperity.", cta: "Read the complete Money Line guide", link: "/calculator" },
                { num: "05", title: "Life Purpose Calculator — Your Hidden Talents", desc: "Gifts encoded in your chart you may not recognise — and the soul mission that gives your path its deepest meaning.", cta: "Read the complete Life Purpose guide", link: "/calculator" },
                { num: "06", title: "Arcana Calculator — Your Archetypal Map", desc: "Your dominant archetype, shadow energy, guide, and the life cycle path that shapes your journey through all 22 energies.", cta: "Read the complete Arcana guide", link: "/arcana-calculator" },
              ].map((card) => (
                <Link
                  key={card.num}
                  href={card.link}
                  className="feature-card"
                  style={{
                    display: "block",
                    background: "#ffffff",
                    borderRadius: "24px",
                    padding: "24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "#e0e7ff",
                      color: "#4f46e5",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      marginBottom: "14px",
                    }}
                  >
                    {card.num}
                  </span>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1e1b4b", marginBottom: "8px", lineHeight: 1.3 }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.55, marginBottom: "16px" }}>
                    {card.desc}
                  </p>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4f46e5" }}>
                    {card.cta} &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────── TESTIMONIALS + GUIDES ──────────── */}
        <section style={{ padding: "0 16px" }}>
          <div className="container mx-auto">
            <Testimonials />
          </div>
        </section>

        {/* ──────────────── FAQ ─────────────────────────────────── */}
        <section
          style={{ padding: "40px 0", borderTop: "1px solid #e2e8f0" }}
          aria-label="Frequently asked questions"
        >
          <div
            className="container mx-auto"
            style={{ padding: "0 16px", maxWidth: "720px" }}
          >
            <h2
              style={{
                fontSize: "clamp(1.3rem, 4vw, 1.75rem)",
                fontWeight: 700,
                textAlign: "center",
                color: "#1e1b4b",
                marginBottom: "24px",
              }}
            >
              Frequently Asked Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "16px 18px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      minHeight: "48px",
                    }}
                  >
                    <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0f172a" }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      style={{
                        width: "18px",
                        height: "18px",
                        color: "#64748b",
                        flexShrink: 0,
                        marginLeft: "12px",
                        transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 18px 16px" }}>
                      <p style={{ color: "#475569", lineHeight: 1.6, margin: 0, fontSize: "0.9rem" }}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────── CTA ─────────────────────────────────── */}
        <section style={{ padding: "40px 0", textAlign: "center" }}>
          <div className="container mx-auto" style={{ padding: "0 16px" }}>
            <h2
              style={{
                fontSize: "clamp(1.3rem, 4vw, 1.75rem)",
                fontWeight: 700,
                color: "#1e1b4b",
                marginBottom: "12px",
              }}
            >
              {cta.title ?? "Ready to Discover Your Destiny?"}
            </h2>
            <p style={{ color: "#475569", marginBottom: "24px", fontSize: "0.95rem" }}>
              {cta.subtitle ?? "Less than a minute. Completely free. No sign up."}
            </p>
            <Link
              href="/calculator"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                background: "#4f46e5",
                color: "#ffffff",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                minHeight: "48px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#4338ca"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#4f46e5"; }}
            >
              {cta.buttonText ?? "Calculate Your Matrix Now"}
              <ArrowRight style={{ width: "16px", height: "16px" }} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Index;
