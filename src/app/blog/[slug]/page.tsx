import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/getBlogPosts";
import ShareStrip from "./ShareStrip";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts
    .filter(
      (item) =>
        item.slug !== post.slug &&
        (item.category === post.category || item.tags.some((t) => post.tags.includes(t))),
    )
    .slice(0, 3);

  const pageUrl = `https://thematrix-destiny.netlify.app/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author_name, jobTitle: post.author_role },
    datePublished: post.publishedAt,
    publisher: { "@type": "Organization", name: "DestinyMatrix", url: "https://thematrix-destiny.netlify.app" },
    url: pageUrl,
  };

  return (
    <div style={{ background: "#f8f9fc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Navbar />

      <main style={{ flex: 1 }}>
        <article>
          {/* Header */}
          <header style={{ borderBottom: "1px solid #e2e8f0", padding: "32px 0 24px" }}>
            <div className="container mx-auto" style={{ padding: "0 16px", maxWidth: "740px" }}>
              <Link
                href="/blog"
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "16px",
                  minHeight: "44px",
                }}
              >
                &larr; Back to blog
              </Link>

              <span
                style={{
                  display: "inline-block",
                  background: "#e0e7ff",
                  color: "#4f46e5",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "4px 10px",
                  marginBottom: "14px",
                }}
              >
                {post.category}
              </span>

              <h1
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                  marginBottom: "16px",
                }}
              >
                {post.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "0.875rem",
                  color: "#64748b",
                }}
              >
                <span>{post.readTime}</span>
                <span>{post.publishedAt}</span>
                <span>by {post.author_name} &middot; {post.author_role}</span>
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="container mx-auto" style={{ padding: "40px 16px", maxWidth: "740px" }}>
            <div
              style={{ color: "#475569", lineHeight: 1.75, fontSize: "1rem" }}
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* Continue your journey CTA */}
            <div
              style={{
                marginTop: "48px",
                background: "#eef2ff",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #e0e7ff",
              }}
            >
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e1b4b", marginBottom: "8px" }}>
                Continue your matrix journey
              </h2>
              <p style={{ fontSize: "0.875rem", color: "#475569", marginBottom: "16px" }}>
                Apply this article with the live tools: calculate your base chart, compare two charts, and review your current forecast cycle.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <Link
                  href="/calculator"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "10px 20px",
                    background: "#4f46e5",
                    color: "#ffffff",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    minHeight: "44px",
                  }}
                >
                  Open Calculator
                </Link>
                <Link
                  href="/compatibility"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "10px 20px",
                    background: "#ffffff",
                    color: "#1e1b4b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    minHeight: "44px",
                  }}
                >
                  Compatibility Check
                </Link>
                <Link
                  href="/arcana-calculator"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "10px 20px",
                    background: "#ffffff",
                    color: "#1e1b4b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    minHeight: "44px",
                  }}
                >
                  Arcana Calculator
                </Link>
              </div>
            </div>

            {/* Author bio */}
            <div
              style={{
                marginTop: "40px",
                background: "#ffffff",
                borderRadius: "20px",
                padding: "20px",
                border: "1px solid #eef2ff",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#667eea,#764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {post.author_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem", marginBottom: "4px" }}>
                  {post.author_name}
                </p>
                <p style={{ color: "#4f46e5", fontSize: "0.8rem", fontWeight: 600, marginBottom: "8px" }}>
                  {post.author_role}
                </p>
                <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.55 }}>
                  A specialist in numerology and destiny matrix interpretation, helping readers apply
                  ancient symbolic systems to modern decision-making and personal growth.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section style={{ borderTop: "1px solid #e2e8f0", padding: "48px 0" }}>
            <div className="container mx-auto" style={{ padding: "0 16px", maxWidth: "1100px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e1b4b", marginBottom: "24px" }}>
                Related Posts
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "20px",
                }}
              >
                {relatedPosts.map((related) => (
                  <BlogCard key={related.slug} post={related} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Sticky share strip — client component handles interactivity */}
      <ShareStrip title={post.title} description={post.description} slug={post.slug} />

      <style>{`
        .prose-content p { margin-bottom: 1.25rem; }
        .prose-content h2 {
          font-size: 1.375rem;
          font-weight: 700;
          color: #1e1b4b;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .prose-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e1b4b;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .prose-content a { color: #4f46e5; text-underline-offset: 3px; }
        .prose-content blockquote {
          border-left: 4px solid #4f46e5;
          background: #eef2ff;
          padding: 16px 20px;
          border-radius: 0 12px 12px 0;
          margin: 1.5rem 0;
        }
        .prose-content code {
          background: #f1f5f9;
          color: #4f46e5;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.875em;
        }
        @media (min-width: 768px) {
          .share-strip { display: none !important; }
        }
      `}</style>
    </div>
  );
}
