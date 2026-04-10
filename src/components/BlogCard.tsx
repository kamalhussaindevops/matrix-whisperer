"use client";

import Link from "next/link";
import BlogCardImage from "@/components/BlogCardImage";

interface BlogCardPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishedAt: string;
  ogImage?: string;
}

interface BlogCardProps {
  post: BlogCardPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: "block",
        background: "#ffffff",
        borderRadius: "24px",
        border: "1px solid #eef2ff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 20px 25px -12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
      }}
    >
      <BlogCardImage category={post.category} title={post.title} ogImage={post.ogImage} />
      <div style={{ padding: "20px" }}>
        <span
          style={{
            display: "inline-block",
            background: "#e0e7ff",
            color: "#4f46e5",
            borderRadius: "999px",
            fontSize: "0.7rem",
            fontWeight: 600,
            padding: "4px 10px",
            marginBottom: "8px",
          }}
        >
          {post.category}
        </span>
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#1e1b4b",
            margin: "0 0 8px",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#475569",
            lineHeight: 1.6,
            margin: "0 0 12px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
            {post.readTime} &middot; {post.publishedAt}
          </span>
          <span style={{ color: "#4f46e5", fontWeight: 600, fontSize: "0.875rem" }}>
            Read article &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
