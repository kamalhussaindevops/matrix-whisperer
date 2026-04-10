import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  author_name: string;
  author_role: string;
  ogImage: string;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

/** gray-matter parses bare YAML dates into Date objects — convert back to YYYY-MM-DD string */
function toDateString(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10); // "2026-03-28"
  }
  return String(value);
}

export function getAllBlogPosts(): BlogPostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = getSlugFromFilename(filename);
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
    const { data } = matter(raw);

    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      category: data.category ?? "Numerology",
      publishedAt: toDateString(data.publishedAt),
      readTime: data.readTime ?? "10 min read",
      tags: data.tags ?? [],
      author_name: data.author_name ?? "",
      author_role: data.author_role ?? "",
      ogImage: data.ogImage ?? "",
    } satisfies BlogPostMeta;
  });

  // Sort newest first
  return posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkHtml, { sanitize: false }).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    category: data.category ?? "Numerology",
    publishedAt: toDateString(data.publishedAt),
    readTime: data.readTime ?? "10 min read",
    tags: data.tags ?? [],
    author_name: data.author_name ?? "",
    author_role: data.author_role ?? "",
    ogImage: data.ogImage ?? "",
    contentHtml,
  };
}
