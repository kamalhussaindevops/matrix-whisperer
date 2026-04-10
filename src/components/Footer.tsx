"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "All Calculators", href: "/calculator" },
      { label: "Arcana Calculator", href: "/arcana-calculator" },
      { label: "Karmic Calculator", href: "/karmic-calculator" },
      { label: "Compatibility", href: "/compatibility" },
      { label: "Child Matrix", href: "/child-matrix" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "What is Destiny Matrix", href: "/learn/what-is-destiny-matrix" },
      { label: "Number Meanings", href: "/learn/number-meanings" },
      { label: "Reading Guide", href: "/learn/guide" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const Footer = () => {
  const [openCol, setOpenCol] = useState<string | null>(null);

  return (
    <footer className="footer-root">
      {/* Gradient top border */}
      <div className="footer-gradient-border" />

      {/* CTA Section */}
      <div className="footer-inner">
        <div className="footer-cta">
          <div>
            <h3 className="footer-cta-title">Ready to explore your insights?</h3>
            <p className="footer-cta-desc">Discover powerful calculators and guides in one place.</p>
          </div>
          <div className="footer-cta-buttons">
            <Link href="/calculator" className="footer-btn-primary">Try Calculators</Link>
            <Link href="/blog" className="footer-btn-outline">Explore Blog</Link>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">DestinyMatrix</Link>
            <p className="footer-brand-desc">
              All-in-one calculator platform designed for clarity and insights — powered by 22 archetypal energies.
            </p>
            {/* Social row */}
            <div className="footer-social">
              {/* X / Twitter */}
              <a href="#" aria-label="X (Twitter)" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M17.5 4l-6.768 6.768"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
              </a>
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              {/* Pinterest */}
              <a href="#" aria-label="Pinterest" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.548 2.143-.83 3.33-.236.995.498 1.806 1.476 1.806 1.772 0 3.138-1.867 3.138-4.561 0-2.386-1.715-4.054-4.163-4.054-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.774.741 2.276a.3.3 0 0 1 .069.286c-.075.314-.243.995-.276 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.522 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
              </a>
              {/* Reddit */}
              <a href="#" aria-label="Reddit" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.8"/><path d="M5 12.8a10.94 10.94 0 0 1 2.28-1.74"/><path d="M11.45 9.5a10.75 10.75 0 0 1 1.1-.1 10.75 10.75 0 0 1 1.1.1"/><path d="M13.5 14.5a3.5 3.5 0 0 1-3 0"/><circle cx="16.5" cy="11.5" r="1"/><circle cx="7.5" cy="11.5" r="1"/><path d="M15 6a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/><path d="M14 7.5a8 8 0 0 0-4 0"/></svg>
              </a>
              {/* TikTok */}
              <a href="#" aria-label="TikTok" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" aria-label="YouTube" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
            </div>
          </div>

          {/* Link columns — desktop visible, mobile accordion */}
          {columns.map((col) => (
            <div key={col.heading} className="footer-col">
              {/* Desktop heading */}
              <h4 className="footer-col-heading footer-col-heading-desktop">{col.heading}</h4>
              {/* Mobile accordion trigger */}
              <button
                type="button"
                className="footer-col-heading footer-col-heading-mobile"
                onClick={() => setOpenCol(openCol === col.heading ? null : col.heading)}
              >
                {col.heading}
                <ChevronDown
                  size={16}
                  className="footer-chevron"
                  style={{ transform: openCol === col.heading ? "rotate(180deg)" : "rotate(0)" }}
                />
              </button>
              <ul
                className="footer-links"
                data-open={openCol === col.heading ? "true" : "false"}
              >
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-inner">
        <div className="footer-bottom">
          <span>&copy; 2026 DestinyMatrix. All rights reserved.</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
