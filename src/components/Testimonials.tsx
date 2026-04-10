"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "United States",
    date: "Verified Jan 2026",
    text: "The most accurate destiny matrix chart I have found. The health chart and chakra analysis blew my mind.",
    initials: "SM",
    color: "#7c3aed",
  },
  {
    name: "Marco R.",
    location: "Italy",
    date: "Verified Dec 2025",
    text: "The destiny matrix compatibility calculator helped me understand my relationship dynamics perfectly.",
    initials: "MR",
    color: "#2563eb",
  },
  {
    name: "Elena V.",
    location: "Germany",
    date: "Verified Nov 2025",
    text: "The child matrix calculator helped me understand my daughter's potential. Genuinely life-changing.",
    initials: "EV",
    color: "#d97706",
  },
  {
    name: "Aisha B.",
    location: "United Kingdom",
    date: "Verified Mar 2026",
    text: "The karmic tail calculator perfectly described patterns I have been noticing in my life. Extraordinary.",
    initials: "AB",
    color: "#0891b2",
  },
  {
    name: "Liam K.",
    location: "Canada",
    date: "Verified Feb 2026",
    text: "I have tried many numerology tools. This is the only one that felt accurate from the first calculation.",
    initials: "LK",
    color: "#059669",
  },
  {
    name: "Priya S.",
    location: "India",
    date: "Verified Oct 2025",
    text: "The arcana calculator reveals hidden archetypes so clearly. Reading my chart felt like meeting myself.",
    initials: "PS",
    color: "#db2777",
  },
  {
    name: "Noah W.",
    location: "Australia",
    date: "Verified Sep 2025",
    text: "Simple, free, and surprisingly deep. The life purpose guide helped me realign my career direction.",
    initials: "NW",
    color: "#ea580c",
  },
  {
    name: "Chloe D.",
    location: "France",
    date: "Verified Apr 2026",
    text: "Best matrix of destiny calculator online. The detailed report and PDF download are incredibly useful.",
    initials: "CD",
    color: "#9333ea",
  },
];

export default function Testimonials() {
  return (
    <section
      style={{
        background: "#f1f5f9",
        borderRadius: "32px",
        padding: "48px 24px",
        margin: "48px 0",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          textAlign: "center",
          color: "#1e1b4b",
          marginBottom: "8px",
        }}
      >
        Rated 4.9/5 &middot; 500,000+ users worldwide
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "#475569",
          marginBottom: "32px",
          fontSize: "0.95rem",
        }}
      >
        Real reviews from our community of destiny matrix explorers.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "16px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
        className="testimonials-grid"
      >
        {testimonials.map((item, i) => (
          <div
            key={i}
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  style={{ width: "1rem", height: "1rem", color: "#fbbf24", fill: "#fbbf24" }}
                />
              ))}
            </div>
            <p
              style={{
                color: "#1a1a2e",
                fontStyle: "italic",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                marginBottom: "14px",
                flexGrow: 1,
              }}
            >
              &ldquo;{item.text}&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 700 }}>
                  {item.initials}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.85rem", display: "block" }}>
                  {item.name}
                </span>
                <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                  {item.location} &middot; {item.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .testimonials-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (min-width: 1024px) {
          .testimonials-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 767px) {
          section[style*="padding: 48px 24px"] {
            padding: 32px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
