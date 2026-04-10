import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { baseUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/calculator",
    "/compatibility",
    "/child-matrix",
    "/arcana-calculator",
    "/karmic-calculator",
    "/blog",
    "/learn",
    "/learn/what-is-destiny-matrix",
    "/learn/number-meanings",
    "/learn/guide",
    "/about",
    "/contact",
    "/privacy",
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
