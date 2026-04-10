"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import type { BlogPostMeta } from "@/lib/getBlogPosts";

type Category = "All" | "Numerology" | "Compatibility" | "Forecasting" | "Spirituality";

const categories: Category[] = ["All", "Numerology", "Compatibility", "Forecasting", "Spirituality"];

const POSTS_PER_PAGE = 6;

interface Props {
  posts: BlogPostMeta[];
}

export default function BlogListing({ posts }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [posts, search, activeCategory]);

  const featured = filtered[0];
  const rest = filtered.slice(1, visibleCount + 1);
  const remaining = filtered.length - 1 - visibleCount;

  return (
    <>
      {/* ─── Hero strip ─── */}
      <section
        style={{
          background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
          padding: "40px 0",
        }}
      >
        <div className="container mx-auto" style={{ padding: "0 16px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              marginBottom: "12px",
            }}
          >
            Destiny Matrix Blog
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.1rem",
              maxWidth: "540px",
              margin: "0 auto 24px",
            }}
          >
            Guides, insights, and deep dives into your chart
          </p>

          {/* Search bar */}
          <div style={{ maxWidth: "480px", margin: "0 auto 20px" }}>
            <input
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(POSTS_PER_PAGE); }}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: "12px",
                border: "none",
                fontSize: "16px",
                background: "#ffffff",
                color: "#1a1a2e",
                outline: "none",
                boxSizing: "border-box",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          {/* Category filter pills */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "0 4px",
            }}
            className="scrollbar-hide"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setActiveCategory(cat); setVisibleCount(POSTS_PER_PAGE); }}
                style={{
                  whiteSpace: "nowrap",
                  padding: "8px 18px",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: activeCategory === cat ? 700 : 500,
                  background: activeCategory === cat ? "#ffffff" : "rgba(255,255,255,0.2)",
                  color: activeCategory === cat ? "#4f46e5" : "#ffffff",
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                  minHeight: "48px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Articles ─── */}
      <section style={{ padding: "40px 0" }}>
        <div className="container mx-auto" style={{ padding: "0 16px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#475569" }}>
              <p style={{ fontSize: "1.1rem" }}>No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "0",
                    background: "#ffffff",
                    borderRadius: "24px",
                    border: "1px solid #eef2ff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                    textDecoration: "none",
                    color: "inherit",
                    marginBottom: "32px",
                    transition: "box-shadow 0.2s",
                  }}
                  className="featured-post-card"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 20px 25px -12px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ padding: "32px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        background: "#e0e7ff",
                        color: "#4f46e5",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        padding: "4px 10px",
                        marginBottom: "12px",
                      }}
                    >
                      {featured.category}
                    </span>
                    <h2
                      style={{
                        fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                        fontWeight: 800,
                        color: "#1e1b4b",
                        lineHeight: 1.25,
                        marginBottom: "12px",
                      }}
                    >
                      {featured.title}
                    </h2>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        color: "#475569",
                        lineHeight: 1.6,
                        marginBottom: "16px",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {featured.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{featured.readTime}</span>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{featured.publishedAt}</span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          color: "#4f46e5",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        Read article &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Article grid */}
              {rest.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "24px",
                    marginBottom: "32px",
                  }}
                >
                  {rest.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              )}

              {/* Load more */}
              {remaining > 0 && (
                <div style={{ textAlign: "center", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
                    style={{
                      padding: "12px 32px",
                      borderRadius: "999px",
                      border: "2px solid #4f46e5",
                      background: "#ffffff",
                      color: "#4f46e5",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.2s, color 0.2s",
                      minHeight: "48px",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5";
                      (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
                      (e.currentTarget as HTMLButtonElement).style.color = "#4f46e5";
                    }}
                  >
                    Load {Math.min(remaining, POSTS_PER_PAGE)} more articles ({remaining} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (min-width: 768px) {
          .featured-post-card {
            grid-template-columns: 2fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          [style*="minmax(320px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
