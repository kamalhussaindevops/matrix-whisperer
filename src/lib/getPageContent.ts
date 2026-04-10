import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

/** Read a JSON page file — returns parsed object or empty object on error */
export function getJsonPage<T = Record<string, unknown>>(filename: string): T {
  const filePath = path.join(PAGES_DIR, filename);
  if (!fs.existsSync(filePath)) return {} as T;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return {} as T;
  }
}

export interface MarkdownPage {
  title: string;
  subtitle?: string;
  badge?: string;
  ctaText?: string;
  ctaHref?: string;
  contentHtml: string;
}

/** Read a Markdown page file — returns frontmatter + HTML body */
export async function getMarkdownPage(filename: string): Promise<MarkdownPage> {
  const filePath = path.join(PAGES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return { title: "", contentHtml: "" };
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkHtml, { sanitize: false }).process(content);
  return {
    title: data.title ?? "",
    subtitle: data.subtitle ?? "",
    badge: data.badge ?? "",
    ctaText: data.ctaText ?? "",
    ctaHref: data.ctaHref ?? "/calculator",
    contentHtml: processed.toString(),
  };
}
