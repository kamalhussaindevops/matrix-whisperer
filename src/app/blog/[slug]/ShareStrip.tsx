"use client";

import { Share2, Link2, Twitter, MessageCircle } from "lucide-react";

function showToast(message: string) {
  if (typeof document === "undefined") return;
  const el = document.createElement("div");
  el.textContent = message;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1e1b4b",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "12px",
    fontSize: "0.875rem",
    fontWeight: "600",
    zIndex: "10000",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

const shareBtn: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  flex: 1,
  padding: "8px 4px",
  background: "#f8f9fc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  color: "#334155",
  fontSize: "0.7rem",
  fontWeight: 600,
  cursor: "pointer",
  minHeight: "48px",
  transition: "background 0.2s, color 0.2s",
};

export default function ShareStrip({ title, description, slug }: { title: string; description: string; slug: string }) {
  const pageUrl = typeof window !== "undefined"
    ? window.location.href
    : `https://thematrix-destiny.netlify.app/blog/${slug}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url: pageUrl });
        return;
      } catch { /* fallback */ }
    }
    await navigator.clipboard?.writeText(pageUrl);
    showToast("Link copied!");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard?.writeText(pageUrl);
    showToast("Link copied to clipboard!");
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`,
      "_blank",
      "noopener",
    );
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl}`)}`,
      "_blank",
      "noopener",
    );
  };

  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        background: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        padding: "10px 16px",
        display: "flex",
        gap: "8px",
        zIndex: 50,
      }}
      className="share-strip"
    >
      <button type="button" onClick={handleNativeShare} style={shareBtn} aria-label="Share">
        <Share2 style={{ width: "18px", height: "18px" }} />
        <span>Share</span>
      </button>
      <button type="button" onClick={handleCopyLink} style={shareBtn} aria-label="Copy link">
        <Link2 style={{ width: "18px", height: "18px" }} />
        <span>Copy</span>
      </button>
      <button type="button" onClick={handleTwitter} style={shareBtn} aria-label="Share on Twitter/X">
        <Twitter style={{ width: "18px", height: "18px" }} />
        <span>Twitter</span>
      </button>
      <button type="button" onClick={handleWhatsApp} style={shareBtn} aria-label="Share on WhatsApp">
        <MessageCircle style={{ width: "18px", height: "18px" }} />
        <span>WhatsApp</span>
      </button>
    </div>
  );
}
