"use client";

import React, { Suspense, useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";
import { blogPosts } from "@/data/blog-posts";
import { ChevronDown, Lock, Sparkles, ShieldCheck, TriangleAlert, X, Star, Share2, Download, Link2, Twitter, Facebook, MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChakraRow,
  calculateCompatibility,
  calculateMatrix,
  CompatibilityResult,
  MatrixResult,
  reduceToArcana,
} from "@/lib/matrixCalculations";
import { getInterpretation } from "@/lib/matrixInterpretations";
import { profileFor } from "@/lib/arcanaProfile";
import { getTestimonialsForTab } from "@/data/testimonials";

const MatrixVisualization = dynamic(() => import("@/components/MatrixVisualization"), { ssr: false });
const HealthChart = dynamic(() => import("@/components/HealthChart"), { ssr: false });

type TabType = "personal" | "compatibility" | "child" | "arcana" | "karmic";

type DateParts = {
  day?: number;
  month?: number;
  year?: number;
};

type PersonalInputState = DateParts & {
  name: string;
  gender: "" | "M" | "F";
  dob: string;
};

type NameDateState = DateParts & {
  name: string;
};

type CompatTextInput = {
  name: string;
  dob: string;
};

const tabToPath: Record<TabType, string> = {
  personal: "/calculator",
  compatibility: "/compatibility",
  child: "/child-matrix",
  arcana: "/arcana-calculator",
  karmic: "/karmic-calculator",
};

const tabs: { id: TabType; label: string }[] = [
  { id: "personal", label: "Personal Matrix" },
  { id: "compatibility", label: "Compatibility" },
  { id: "child", label: "Child Matrix" },
  { id: "arcana", label: "Arcana Calculator" },
  { id: "karmic", label: "Karmic Calculator" },
];

const years = Array.from({ length: 2025 - 1900 + 1 }, (_, index) => 2025 - index);
const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ARCANA_PROFILE moved to @/lib/arcanaProfile for code-splitting

const chakraRows = [
  { key: "crown", label: "Crown (Sahasrara)", color: "#a78bfa" },
  { key: "thirdEye", label: "Third eye (Ajna)", color: "#60a5fa" },
  { key: "throat", label: "Throat (Vishuddha)", color: "#2dd4bf" },
  { key: "heart", label: "Heart (Anahata)", color: "#4ade80" },
  { key: "solar", label: "Solar plexus (Manipura)", color: "#fbbf24" },
  { key: "sacral", label: "Sacral (Swadhisthana)", color: "#fb923c" },
  { key: "root", label: "Root (Muladhara)", color: "#f87171" },
] as const;

function reduceTotal(values: number[]) {
  return reduceToArcana(values.reduce((sum, value) => sum + value, 0));
}

function computeHealthRows(result: MatrixResult) {
  const rows = [
    { name: chakraRows[0].label, color: chakraRows[0].color, physics: result.A, energy: result.A, emotions: reduceToArcana(result.A + result.A) },
    { name: chakraRows[1].label, color: chakraRows[1].color, physics: result.E, energy: result.E, emotions: reduceToArcana(result.E + result.E) },
    { name: chakraRows[2].label, color: chakraRows[2].color, physics: result.H, energy: result.H, emotions: reduceToArcana(result.H + result.H) },
    { name: chakraRows[3].label, color: chakraRows[3].color, physics: result.soulComfort, energy: result.soulComfort, emotions: reduceToArcana(result.soulComfort + result.soulComfort) },
    { name: chakraRows[4].label, color: chakraRows[4].color, physics: result.center, energy: result.center, emotions: reduceToArcana(result.center + result.center) },
    { name: chakraRows[5].label, color: chakraRows[5].color, physics: result.G, energy: result.H, emotions: reduceToArcana(result.G + result.H) },
    { name: chakraRows[6].label, color: chakraRows[6].color, physics: result.C, energy: result.G, emotions: reduceToArcana(result.C + result.G) },
  ];

  const totals = {
    physics: reduceTotal(rows.map((row) => row.physics)),
    energy: reduceTotal(rows.map((row) => row.energy)),
    emotions: reduceTotal(rows.map((row) => row.emotions)),
  };

  return { rows, totals };
}

// profileFor imported from @/lib/arcanaProfile

function buildDate(parts: DateParts): Date | undefined {
  if (!parts.day || !parts.month || !parts.year) return undefined;
  const candidate = new Date(parts.year, parts.month - 1, parts.day);
  if (
    candidate.getFullYear() !== parts.year ||
    candidate.getMonth() !== parts.month - 1 ||
    candidate.getDate() !== parts.day
  ) {
    return undefined;
  }
  if (candidate > new Date()) return undefined;
  return candidate;
}

function maskDobInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseDobInput(value: string): Date | undefined {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (year < 1900 || year > 2025) return undefined;

  const candidate = new Date(year, month - 1, day);
  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) {
    return undefined;
  }

  if (candidate > new Date()) return undefined;
  return candidate;
}

function sumDigits(value: number) {
  return String(Math.abs(value))
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}


function buildCombinedResult(a: MatrixResult, b: MatrixResult): MatrixResult {
  const avgDate = new Date((a.birthDate.getTime() + b.birthDate.getTime()) / 2);
  const base = calculateMatrix(avgDate, "Combined");
  const avg = (x: number, y: number) => reduceToArcana(Math.round((x + y) / 2));

  return {
    ...base,
    A: avg(a.A, b.A),
    B: avg(a.B, b.B),
    C: avg(a.C, b.C),
    D: avg(a.D, b.D),
    E: avg(a.E, b.E),
    F: avg(a.F, b.F),
    G: avg(a.G, b.G),
    H: avg(a.H, b.H),
    center: avg(a.center, b.center),
    skyPurpose: avg(a.skyPurpose, b.skyPurpose),
    earthPurpose: avg(a.earthPurpose, b.earthPurpose),
    personalPurpose: avg(a.personalPurpose, b.personalPurpose),
    comfortZone: avg(a.comfortZone, b.comfortZone),
    soulComfort: avg(a.soulComfort, b.soulComfort),
    firstImpression: avg(a.firstImpression, b.firstImpression),
    relationship: avg(a.relationship, b.relationship),
    money: avg(a.money, b.money),
    talents: avg(a.talents, b.talents),
    karmicTasks: avg(a.karmicTasks, b.karmicTasks),
    parentsRelation: avg(a.parentsRelation, b.parentsRelation),
  };
}

async function capture(node: HTMLElement) {
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(node, { backgroundColor: "#0d0520", scale: 2, useCORS: true, logging: false });
  const dataUrl = canvas.toDataURL("image/png");
  // Free canvas memory immediately after data extraction
  canvas.width = 0;
  canvas.height = 0;
  return dataUrl;
}

async function captureBlob(node: HTMLElement): Promise<Blob> {
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(node, { backgroundColor: "#0d0520", scale: 2, useCORS: true, logging: false });
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      canvas.width = 0;
      canvas.height = 0;
      if (blob) resolve(blob);
      else reject(new Error("capture failed"));
    }, "image/png");
  });
}

async function downloadPng(node: HTMLElement, filename: string) {
  const image = await capture(node);
  const link = document.createElement("a");
  link.href = image;
  link.download = filename;
  link.click();
}

async function buildPdfBlob(input: {
  title: string;
  chartNode?: HTMLElement | null;
  lines: string[];
}): Promise<Blob> {
  const { default: jsPDF } = await import("jspdf");
  const pdf = new jsPDF("p", "mm", "a4");
  const w = pdf.internal.pageSize.getWidth();
  const margin = 12;

  pdf.setFillColor(13, 5, 32);
  pdf.rect(0, 0, w, 297, "F");
  pdf.setTextColor(245, 240, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(input.title, margin, 14);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleString("en-US")}`, margin, 20);

  if (input.chartNode) {
    const img = await capture(input.chartNode);
    pdf.addImage(img, "PNG", margin, 24, w - margin * 2, 128);
  }

  pdf.addPage();
  pdf.setFillColor(13, 5, 32);
  pdf.rect(0, 0, w, 297, "F");
  pdf.setTextColor(245, 240, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text("Interpretation", margin, 14);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  let y = 22;
  for (const line of input.lines) {
    const wrapped = pdf.splitTextToSize(line, w - margin * 2);
    pdf.text(wrapped, margin, y);
    y += wrapped.length * 5 + 2;
    if (y > 280) {
      pdf.addPage();
      pdf.setFillColor(13, 5, 32);
      pdf.rect(0, 0, w, 297, "F");
      pdf.setTextColor(245, 240, 255);
      y = 16;
    }
  }

  return pdf.output("blob");
}

async function downloadPdf(input: {
  fileName: string;
  title: string;
  chartNode?: HTMLElement | null;
  lines: string[];
}) {
  const blob = await buildPdfBlob({ title: input.title, chartNode: input.chartNode, lines: input.lines });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = input.fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function showShareToast(message: string) {
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
    maxWidth: "calc(100vw - 48px)",
    textAlign: "center",
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function getShareUrl() {
  if (typeof window === "undefined") return "https://thematrix-destiny.netlify.app/";
  return window.location.href;
}

type ReportBundle = {
  shareTitle: string;
  shareText: string;
  pdfTitle: string;
  lines: string[];
  chartNode: () => HTMLElement | null;
  pngFileName: string;
  pdfFileName: string;
};

async function buildReportFiles(bundle: ReportBundle): Promise<File[]> {
  const files: File[] = [];
  const node = bundle.chartNode();
  if (node) {
    try {
      const pngBlob = await captureBlob(node);
      files.push(new File([pngBlob], bundle.pngFileName, { type: "image/png" }));
    } catch {
      /* ignore — fall through with whatever we have */
    }
  }
  try {
    const pdfBlob = await buildPdfBlob({ title: bundle.pdfTitle, chartNode: node, lines: bundle.lines });
    files.push(new File([pdfBlob], bundle.pdfFileName, { type: "application/pdf" }));
  } catch {
    /* ignore */
  }
  return files;
}

function saveFilesLocally(files: File[]) {
  files.forEach((file) => {
    const objectUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
  });
}

type WebShareNavigator = Navigator & {
  share?: (data: { title?: string; text?: string; url?: string; files?: File[] }) => Promise<void>;
  canShare?: (data: { files?: File[] }) => boolean;
};

async function nativeShareReport(bundle: ReportBundle) {
  const url = getShareUrl();
  showShareToast("Preparing your chart & report...");
  let files: File[] = [];
  try {
    files = await buildReportFiles(bundle);
  } catch {
    /* ignore */
  }

  const nav = typeof navigator !== "undefined" ? (navigator as WebShareNavigator) : null;

  if (nav && typeof nav.share === "function") {
    try {
      const canShareFiles = files.length > 0 && typeof nav.canShare === "function" && nav.canShare({ files });
      const shareData: { title?: string; text?: string; url?: string; files?: File[] } = {
        title: bundle.shareTitle,
        text: bundle.shareText,
        url,
      };
      if (canShareFiles) shareData.files = files;
      await nav.share(shareData);
      return true;
    } catch {
      /* user cancelled or unsupported — fall through */
    }
  }

  // Fallback: save files locally + copy link so the user can attach manually
  if (files.length) saveFilesLocally(files);
  try {
    await navigator.clipboard?.writeText(`${bundle.shareText} ${url}`);
    showShareToast("Report saved & link copied — attach the files when sharing");
  } catch {
    showShareToast("Report saved — attach the files when sharing");
  }
  return true;
}

async function shareToPlatform(
  bundle: ReportBundle,
  buildIntent: (text: string, url: string) => string,
  platformLabel: string,
) {
  showShareToast("Preparing your chart & report...");

  // Try native Web Share API with files first — on mobile this lets the user
  // pick the platform directly and attach the actual PNG + PDF.
  const nav = typeof navigator !== "undefined" ? (navigator as WebShareNavigator) : null;
  let files: File[] = [];
  try {
    files = await buildReportFiles(bundle);
  } catch {
    /* ignore */
  }

  if (nav && typeof nav.share === "function" && files.length > 0 && typeof nav.canShare === "function" && nav.canShare({ files })) {
    try {
      await nav.share({
        title: bundle.shareTitle,
        text: `${bundle.shareText} (share to ${platformLabel})`,
        url: getShareUrl(),
        files,
      });
      return;
    } catch {
      /* user cancelled — fall through to desktop fallback */
    }
  }

  // Desktop / unsupported browser fallback:
  // Save the files so the user has them, then open the platform's compose window.
  if (files.length) saveFilesLocally(files);
  showShareToast(`Report saved — attach the files in ${platformLabel}`);
  setTimeout(() => {
    const intentUrl = buildIntent(bundle.shareText, getShareUrl());
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  }, 700);
}

function twitterIntent(text: string, url: string) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}
function facebookIntent(_text: string, url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}
function whatsappIntent(text: string, url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
}
function telegramIntent(text: string, url: string) {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

async function copyShareLink() {
  try {
    await navigator.clipboard?.writeText(getShareUrl());
    showShareToast("Link copied to clipboard!");
  } catch {
    showShareToast("Unable to copy link");
  }
}

function ReportActionBar({ bundle }: { bundle: ReportBundle }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-1 flex items-center gap-2">
        <Share2 className="h-4 w-4 text-primary" />
        <h4 className="font-display text-base font-semibold text-foreground">Share &amp; download your report</h4>
      </div>
      <p className="mb-4 text-xs text-text-muted">
        Sharing attaches the chart image (PNG) and full PDF report — not just a text link.
      </p>

      {/* Social share row */}
      <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        <button
          type="button"
          onClick={() => nativeShareReport(bundle)}
          className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background px-2 py-2 text-[11px] font-semibold text-foreground transition hover:border-primary hover:bg-primary/10"
          aria-label="Share chart image and PDF report"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button
          type="button"
          onClick={() => shareToPlatform(bundle, twitterIntent, "Twitter")}
          className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background px-2 py-2 text-[11px] font-semibold text-foreground transition hover:border-[#1da1f2] hover:text-[#1da1f2]"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </button>
        <button
          type="button"
          onClick={() => shareToPlatform(bundle, facebookIntent, "Facebook")}
          className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background px-2 py-2 text-[11px] font-semibold text-foreground transition hover:border-[#1877f2] hover:text-[#1877f2]"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </button>
        <button
          type="button"
          onClick={() => shareToPlatform(bundle, whatsappIntent, "WhatsApp")}
          className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background px-2 py-2 text-[11px] font-semibold text-foreground transition hover:border-[#25d366] hover:text-[#25d366]"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => shareToPlatform(bundle, telegramIntent, "Telegram")}
          className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background px-2 py-2 text-[11px] font-semibold text-foreground transition hover:border-[#0088cc] hover:text-[#0088cc]"
          aria-label="Share on Telegram"
        >
          <Send className="h-4 w-4" />
          Telegram
        </button>
        <button
          type="button"
          onClick={() => copyShareLink()}
          className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background px-2 py-2 text-[11px] font-semibold text-foreground transition hover:border-primary hover:text-primary"
          aria-label="Copy link"
        >
          <Link2 className="h-4 w-4" />
          Copy Link
        </button>
      </div>

      {/* Download row */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={async () => {
            const node = bundle.chartNode();
            if (node) await downloadPng(node, bundle.pngFileName);
          }}
          className="h-11 rounded-[10px] bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-6 text-white hover:from-[#6d28d9] hover:to-[#4338ca]"
          variant="default"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
        <Button
          onClick={() =>
            downloadPdf({
              fileName: bundle.pdfFileName,
              title: bundle.pdfTitle,
              chartNode: bundle.chartNode(),
              lines: bundle.lines,
            })
          }
          className="h-11 rounded-[10px] bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-6 text-white hover:from-[#6d28d9] hover:to-[#4338ca]"
          variant="default"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - progress / 100);
  const color = progress > 70 ? "#059669" : progress >= 40 ? "#b45309" : "#dc2626";

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="170" height="170" viewBox="0 0 170 170">
        <circle cx="85" cy="85" r={radius} fill="none" stroke="#221545" strokeWidth="12" />
        <circle
          cx="85"
          cy="85"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 85 85)"
        />
      </svg>
      <div className="-mt-[108px] text-center">
        <p className="font-display text-4xl text-foreground">{progress}%</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-text-muted">Match</p>
      </div>
    </div>
  );
}

function DateTriplet({
  value,
  onChange,
}: {
  value: DateParts;
  onChange: (next: DateParts) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <select
        value={value.day ?? ""}
        onChange={(event) => onChange({ ...value, day: event.target.value ? Number(event.target.value) : undefined })}
        className="h-11 rounded-xl border border-border bg-page px-3 text-sm text-foreground"
      >
        <option value="">Day</option>
        {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>

      <select
        value={value.month ?? ""}
        onChange={(event) => onChange({ ...value, month: event.target.value ? Number(event.target.value) : undefined })}
        className="h-11 rounded-xl border border-border bg-page px-3 text-sm text-foreground"
      >
        <option value="">Month</option>
        {monthLabels.map((month, index) => (
          <option key={month} value={index + 1}>
            {month}
          </option>
        ))}
      </select>

      <select
        value={value.year ?? ""}
        onChange={(event) => onChange({ ...value, year: event.target.value ? Number(event.target.value) : undefined })}
        className="h-11 rounded-xl border border-border bg-page px-3 text-sm text-foreground"
      >
        <option value="">Year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

type AccordionItemData = {
  id: string;
  title: string;
  content: string;
  locked?: boolean;
};

function toChakraRows(
  rows: Array<{ name: string; physics: number; energy: number; emotions: number }>,
): ChakraRow[] {
  return rows.map((row) => {
    const match = row.name.match(/^(.*?) \((.*?)\)$/);
    return {
      name: match?.[1] ?? row.name,
      sanskrit: match?.[2] ?? "",
      physics: row.physics,
      energy: row.energy,
      emotions: row.emotions,
    };
  });
}

function faqSeparator() {
  return (
    <div className="relative my-5 border-t border-border">
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card px-4 py-1 text-xs uppercase tracking-[0.2em] text-accent">
        FAQ
      </span>
    </div>
  );
}

// ─── Tab → Blog slugs ───────────────────────────────────────────────────────
const tabBlogSlugs: Record<TabType, string[]> = {
  personal: ["destiny-matrix-numerology-guide", "advanced-numerology-pattern-analysis", "spiritual-numerology-and-modern-life-balance"],
  compatibility: ["destiny-matrix-compatibility-deep-dive", "matrix-comparison-for-partners-and-teams", "destiny-matrix-numerology-guide"],
  child: ["child-matrix-parenting-insights", "destiny-matrix-numerology-guide", "advanced-numerology-pattern-analysis"],
  arcana: ["advanced-numerology-pattern-analysis", "karmic-patterns-and-spiritual-growth", "spiritual-numerology-and-modern-life-balance"],
  karmic: ["karmic-patterns-and-spiritual-growth", "advanced-numerology-pattern-analysis", "year-forecast-destiny-matrix-planning"],
};

const tabBlogGradients: Record<TabType, string> = {
  personal: "linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)",
  compatibility: "linear-gradient(135deg,#e11d48 0%,#9333ea 100%)",
  child: "linear-gradient(135deg,#059669 0%,#0891b2 100%)",
  arcana: "linear-gradient(135deg,#d97706 0%,#7c3aed 100%)",
  karmic: "linear-gradient(135deg,#7c3aed 0%,#0891b2 100%)",
};

function RelatedBlogSection({ tab }: { tab: TabType }) {
  const slugs = tabBlogSlugs[tab];
  const posts = blogPosts.filter((p) => slugs.includes(p.slug)).sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug)).slice(0, 3);
  const grad = tabBlogGradients[tab];

  return (
    <div
      style={{
        background: "#f8f9fc",
        borderRadius: "20px",
        border: "1px solid #eef2ff",
        padding: "28px 28px 32px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "4px" }}>Related Articles</h3>
        <p style={{ fontSize: "0.82rem", color: "#64748b" }}>Deepen your understanding with our expert guides</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none", display: "block" }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #eef2ff",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "transform 0.2s, box-shadow 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  height: "110px",
                  background: grad,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "2.2rem", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}>📖</span>
              </div>
              {/* Body */}
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.67rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#7c3aed",
                    background: "#ede9fe",
                    borderRadius: "6px",
                    padding: "2px 8px",
                    marginBottom: "8px",
                    width: "fit-content",
                  }}
                >
                  {post.category}
                </span>
                <h4
                  style={{
                    fontSize: "0.87rem",
                    fontWeight: 700,
                    color: "#1e1b4b",
                    lineHeight: 1.4,
                    marginBottom: "8px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  } as React.CSSProperties}
                >
                  {post.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.77rem",
                    color: "#475569",
                    lineHeight: 1.55,
                    marginBottom: "14px",
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  } as React.CSSProperties}
                >
                  {post.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{post.readTime}</span>
                  <span
                    style={{
                      fontSize: "0.77rem",
                      fontWeight: 700,
                      color: "#4f46e5",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    Read more →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Static FAQs (always visible, no result dependency) ─────────────────────
const staticFaqs: Record<TabType, { q: string; a: string }[]> = {
  personal: [
    { q: "Is the Destiny Matrix Calculator free?", a: "Yes, completely free. Enter your birth date and get your full matrix with health chart, interpretations, and life purpose analysis — no sign up required." },
    { q: "What does the personal matrix include?", a: "A complete matrix with health chart (chakra system), soul comfort zone, talents, money energy, karmic tasks, relationship analysis, life purpose, personal year forecast, and more." },
    { q: "How accurate is the Destiny Matrix?", a: "Based on established numerological principles using 22 archetypal energies. It provides valuable self-reflection insights into your strengths, challenges, and life direction." },
    { q: "What is the center number in the matrix?", a: "The center number is the core of your destiny matrix — the energy that defines how you experience yourself from the inside out. It reflects your dominant life lesson and primary energetic frequency." },
    { q: "Can the matrix help with career choices?", a: "Yes, especially through the talent, purpose, and money lines. These positions describe how you create value, where motivation comes naturally, and what work environment supports your growth." },
    { q: "How do I read the health chart?", a: "Read the health chart as a symbolic balance map for body, energy, and emotions. It highlights which chakras feel strong, which need support, and where repeated imbalance may appear." },
  ],
  compatibility: [
    { q: "What is destiny matrix compatibility?", a: "Destiny matrix compatibility compares the energetic blueprints of two people using their birth dates, revealing relationship dynamics, shared strengths, friction points, and long-term growth potential." },
    { q: "How is the compatibility score calculated?", a: "The score combines shared matrix energies, center resonance, and key line differences between both charts. A higher score means less energetic friction; mid-range scores often indicate strong growth potential with conscious effort." },
    { q: "Can two people with very different matrices be compatible?", a: "Yes — difference often means complementary growth. Pairs with contrast can be highly successful when communication and emotional safety are strong. The matrix helps identify where adaptation is needed so differences become strengths." },
    { q: "What does the combined compatibility matrix show?", a: "The combined matrix represents your joint energetic field as a couple — how you function as a unit when making decisions, handling pressure, and building shared goals." },
    { q: "Can compatibility improve over time?", a: "Yes, compatibility evolves with personal growth, healing, and life stage transitions. Conscious habits can raise practical compatibility even when raw chart differences stay the same." },
  ],
  child: [
    { q: "What is the child destiny matrix?", a: "The child matrix maps innate energies present from birth into a structured pattern. It helps parents understand temperament, emotional wiring, and developmental strengths to provide better support." },
    { q: "What age can I use this for?", a: "You can calculate it from birth since the matrix is birth-date based. Early years reveal emotional and behavioral patterns first. As the child grows, additional lines become easier to observe in real life." },
    { q: "Why do I need both parent birth dates?", a: "Parent dates don't change the child matrix itself, but comparing parent and child charts highlights resonance and friction zones in communication — making it easier to choose supportive parenting strategies." },
    { q: "How can I use the child matrix for education?", a: "Use it to identify attention style, motivation style, and stress triggers in learning environments. Then adapt pacing, teaching format, and feedback style accordingly — this often improves confidence and reduces friction around schoolwork." },
    { q: "What are the most important numbers in a child's matrix?", a: "Center, soul comfort, talents, relationship line, and purpose are the most practical anchors. Together they describe regulation, abilities, social style, and long-term direction." },
  ],
  arcana: [
    { q: "What is the arcana calculator?", a: "The arcana calculator identifies your dominant archetype, shadow energy, spiritual guide, and life cycle path using a multi-layer calculation from your birth date and name." },
    { q: "What does the dominant arcana mean?", a: "Your dominant arcana is the primary archetypal energy that shapes your personality, decisions, and life path. It represents your core symbolic identity drawn from the 22 major arcana." },
    { q: "What is shadow energy in the arcana reading?", a: "Shadow energy is the archetype you tend to suppress or project onto others. Understanding it helps you integrate unconscious patterns and gain access to hidden strengths." },
    { q: "What is a soul guide in the arcana map?", a: "Your soul guide is the archetypal energy that acts as an inner compass — the wisdom source you can call on when facing important crossroads or difficult transitions." },
    { q: "How is the arcana calculator different from the personal matrix?", a: "The personal matrix gives a broad overview of all life areas. The arcana calculator focuses specifically on archetypal identity, symbolic patterns, and the energetic cycle that governs your life path." },
  ],
  karmic: [
    { q: "What is karmic debt in the destiny matrix?", a: "Karmic debt refers to unresolved energetic patterns carried from past cycles — not as punishment, but as recurring behavioral loops that ask for conscious awareness and intentional change." },
    { q: "What does the karmic tail reveal?", a: "The karmic tail shows the inherited ancestral or karmic pattern that most frequently recurs in your life. Identifying it gives you the clarity to break the loop and grow beyond it." },
    { q: "Can karmic patterns be changed?", a: "Yes. Karmic patterns are tendencies, not fixed destiny. Through awareness, accountability, and consistent behavioral change, you can shift these patterns significantly over time." },
    { q: "What is the karmic reward?", a: "The karmic reward is the positive energy and life quality that emerges once you have worked through and integrated the karmic lesson — your soul's 'graduation gift' for doing the inner work." },
    { q: "How does the karmic calculator differ from the personal matrix?", a: "While the personal matrix covers all life areas broadly, the karmic calculator zooms in specifically on soul lessons, ancestral patterns, karmic debt, release points, and the reward waiting after integration." },
  ],
};

function StaticFaqSection({ tab }: { tab: TabType }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = staticFaqs[tab];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        border: "1px solid #eef2ff",
        padding: "28px",
      }}
    >
      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "4px" }}>Frequently Asked Questions</h3>
      <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "20px" }}>Common questions about this calculator</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              borderRadius: "14px",
              border: "1px solid #eef2ff",
              background: openIdx === i ? "#f8f9fc" : "#ffffff",
              overflow: "hidden",
              transition: "background 0.15s",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "14px 18px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                gap: "12px",
              }}
            >
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.4 }}>{faq.q}</span>
              <ChevronDown
                style={{
                  width: "16px",
                  height: "16px",
                  color: "#7c3aed",
                  flexShrink: 0,
                  transform: openIdx === i ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
            {openIdx === i && (
              <div style={{ padding: "0 18px 16px" }}>
                <p style={{ color: "#475569", lineHeight: 1.65, margin: 0, fontSize: "0.87rem" }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoAccordion({
  title,
  items,
  openId,
  onToggle,
  onUnlock,
}: {
  title: string;
  items: AccordionItemData[];
  openId: string;
  onToggle: (id: string) => void;
  onUnlock: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-display text-3xl text-foreground">{title}</h3>
      <div className="mt-2 h-1 w-64 rounded-full bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#4f46e5]" />

      <div className="mt-5 space-y-3">
        {items.map((item) => {
          const isOpen = openId === item.id;

          if (item.locked) {
            return (
              <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-card opacity-45" style={{ cursor: "not-allowed" }}>
                <div className="flex items-center justify-between px-6 py-5">
                  <span className="text-base text-foreground">{item.title}</span>
                  <Lock className="h-4 w-4 text-text-muted" />
                </div>
                <div className="relative bg-page px-6 py-4">
                  <p className="text-sm leading-7 text-text-muted" style={{ filter: "blur(4px)" }}>
                    This section contains premium depth analysis and layered interpretation based on matrix interactions.
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={onUnlock}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                      🔒 Unlock Full Reading
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={item.id} className={`overflow-hidden rounded-xl border border-border ${isOpen ? "bg-elevated border-l-[3px] border-l-primary" : "bg-card"}`}>
              <button
                type="button"
                onClick={() => onToggle(item.id)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className={`text-base ${isOpen ? "text-text-secondary" : "text-foreground"}`}>{item.title}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4 text-text-secondary" />
                </motion.span>
              </button>
              {isOpen ? (
                <div className="bg-elevated px-6 py-4 text-sm leading-7 text-text-secondary">{item.content}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calculator({ initialTab = "personal" }: { initialTab?: TabType }) {
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isCalculating, setIsCalculating] = useState(false);

  const [personalInput, setPersonalInput] = useState<PersonalInputState>({ name: "", dob: "", gender: "", day: undefined, month: undefined, year: 1990 });
  const [personalCalculated, setPersonalCalculated] = useState<PersonalInputState | null>(null);
  const [personalResult, setPersonalResult] = useState<MatrixResult | null>(null);

  const [compatInput, setCompatInput] = useState<{ p1: CompatTextInput; p2: CompatTextInput }>({
    p1: { name: "", dob: "" },
    p2: { name: "", dob: "" },
  });
  const [compatErrors, setCompatErrors] = useState<{ p1Dob?: string; p2Dob?: string }>({});
  const [compatCalculated, setCompatCalculated] = useState<typeof compatInput | null>(null);
  const [compatResult, setCompatResult] = useState<CompatibilityResult | null>(null);

  const [childInput, setChildInput] = useState<{
    child: NameDateState;
    mother: NameDateState;
    father: NameDateState;
  }>({
    child: { name: "", day: undefined, month: undefined, year: 1990 },
    mother: { name: "", day: undefined, month: undefined, year: 1990 },
    father: { name: "", day: undefined, month: undefined, year: 1990 },
  });
  const [childCalculated, setChildCalculated] = useState<typeof childInput | null>(null);
  const [childResult, setChildResult] = useState<MatrixResult | null>(null);
  const [influence, setInfluence] = useState<{ maternal: number; paternal: number } | null>(null);

  // Arcana Calculator state
  const [arcanaInput, setArcanaInput] = useState<PersonalInputState>({ name: "", dob: "", gender: "", day: undefined, month: undefined, year: 1990 });
  const [arcanaResult, setArcanaResult] = useState<{ dominant: number; shadow: number; guide: number; challenge: number; gift: number; path: number; essence: number; cycle: number } | null>(null);

  // Karmic Calculator state
  const [karmicInput, setKarmicInput] = useState<PersonalInputState>({ name: "", dob: "", gender: "", day: undefined, month: undefined, year: 1990 });
  const [karmicResult, setKarmicResult] = useState<{ debt: number; lesson: number; tail: number; release: number; reward: number; anchor: number; mirror: number } | null>(null);

  const personalRef = useRef<HTMLDivElement | null>(null);
  const compatibilityRef = useRef<HTMLDivElement | null>(null);
  const childRef = useRef<HTMLDivElement | null>(null);
  const arcanaRef = useRef<HTMLDivElement | null>(null);
  const karmicRef = useRef<HTMLDivElement | null>(null);
  const [openPersonalAccordion, setOpenPersonalAccordion] = useState<string>("soul");
  const [openCompatibilityAccordion, setOpenCompatibilityAccordion] = useState<string>("relationship-energy");
  const [openChildAccordion, setOpenChildAccordion] = useState<string>("child-soul");
  const [openFaqAccordion, setOpenFaqAccordion] = useState<string>("");
  const [showLockedModal, setShowLockedModal] = useState(false);

  const personalReady = Boolean(personalInput.name.trim() && personalInput.dob.length === 10 && personalInput.gender);
  const p1Ready = Boolean(compatInput.p1.name.trim() && compatInput.p1.dob.length === 10);
  const p2Ready = Boolean(compatInput.p2.name.trim() && compatInput.p2.dob.length === 10);
  const compatReady = p1Ready && p2Ready;
  const childReady = Boolean(
    childInput.child.name.trim() &&
      childInput.child.day &&
      childInput.child.month &&
      childInput.child.year &&
      childInput.mother.name.trim() &&
      childInput.mother.day &&
      childInput.mother.month &&
      childInput.mother.year &&
      childInput.father.name.trim() &&
      childInput.father.day &&
      childInput.father.month &&
      childInput.father.year,
  );
  const arcanaReady = Boolean(arcanaInput.name.trim() && arcanaInput.dob.length === 10);
  const karmicReady = Boolean(karmicInput.name.trim() && karmicInput.dob.length === 10);

  const calculatePersonal = useCallback(() => {
    const date = parseDobInput(personalInput.dob);
    if (!date || !personalInput.name.trim() || !personalInput.gender) return;
    const gender: "M" | "F" = personalInput.gender;

    setIsCalculating(true);
    setTimeout(() => {
      setPersonalResult(calculateMatrix(date, personalInput.name.trim(), gender));
      setPersonalCalculated(personalInput);
      setIsCalculating(false);
    }, 220);
  }, [personalInput.dob, personalInput.name, personalInput.gender]);

  const calculateCompat = useCallback(() => {
    const p1Date = parseDobInput(compatInput.p1.dob);
    const p2Date = parseDobInput(compatInput.p2.dob);

    const nextErrors: { p1Dob?: string; p2Dob?: string } = {};
    if (!p1Date) nextErrors.p1Dob = "Invalid date. Use DD/MM/YYYY";
    if (!p2Date) nextErrors.p2Dob = "Invalid date. Use DD/MM/YYYY";
    setCompatErrors(nextErrors);

    if (!p1Date || !p2Date || !compatInput.p1.name.trim() || !compatInput.p2.name.trim()) return;

    setIsCalculating(true);
    setTimeout(() => {
      setCompatResult(calculateCompatibility(p1Date, p2Date, compatInput.p1.name.trim(), compatInput.p2.name.trim()));
      setCompatCalculated(compatInput);
      setIsCalculating(false);
    }, 220);
  }, [
    compatInput.p1.name,
    compatInput.p1.dob,
    compatInput.p2.name,
    compatInput.p2.dob,
  ]);

  const calculateChild = useCallback(() => {
    const childDate = buildDate(childInput.child);
    const motherDate = buildDate(childInput.mother);
    const fatherDate = buildDate(childInput.father);
    if (!childDate || !motherDate || !fatherDate) return;

    setIsCalculating(true);
    setTimeout(() => {
      const childMatrix = calculateMatrix(childDate, childInput.child.name.trim());
      const motherMatrix = calculateMatrix(motherDate, childInput.mother.name.trim());
      const fatherMatrix = calculateMatrix(fatherDate, childInput.father.name.trim());

      setChildResult(childMatrix);
      setInfluence({
        maternal: Math.max(35, 100 - Math.abs(childMatrix.center - motherMatrix.center) * 6),
        paternal: Math.max(35, 100 - Math.abs(childMatrix.center - fatherMatrix.center) * 6),
      });
      setChildCalculated(childInput);
      setIsCalculating(false);
    }, 220);
  }, [
    childInput.child.day,
    childInput.child.month,
    childInput.child.year,
    childInput.child.name,
    childInput.mother.day,
    childInput.mother.month,
    childInput.mother.year,
    childInput.mother.name,
    childInput.father.day,
    childInput.father.month,
    childInput.father.year,
    childInput.father.name,
  ]);

  const calculateArcana = useCallback(() => {
    const date = parseDobInput(arcanaInput.dob);
    if (!date || !arcanaInput.name.trim()) return;
    setIsCalculating(true);
    setTimeout(() => {
      const d = date.getDate(), m = date.getMonth() + 1, y = date.getFullYear();
      const dayA = reduceToArcana(d);
      const monthA = reduceToArcana(m);
      const yearA = reduceToArcana(sumDigits(y));
      const cross = reduceToArcana(dayA * 2 + monthA);
      const spiral = reduceToArcana(yearA * 3 + dayA);
      const dominant = reduceToArcana(dayA + monthA + yearA);
      const shadow = reduceToArcana(Math.abs(dayA - monthA) + Math.abs(monthA - yearA) + 1);
      const guide = reduceToArcana(cross + spiral);
      const challenge = reduceToArcana(Math.abs(cross - spiral) + dayA);
      const gift = reduceToArcana(dominant + guide);
      const path = reduceToArcana(shadow + challenge + gift);
      const essence = reduceToArcana(dominant + shadow + guide + challenge);
      const cycle = reduceToArcana(essence + path + gift);
      setArcanaResult({ dominant, shadow, guide, challenge, gift, path, essence, cycle });
      setIsCalculating(false);
    }, 220);
  }, [arcanaInput.dob, arcanaInput.name]);

  const calculateKarmic = useCallback(() => {
    const date = parseDobInput(karmicInput.dob);
    if (!date || !karmicInput.name.trim()) return;
    setIsCalculating(true);
    setTimeout(() => {
      const d = date.getDate(), m = date.getMonth() + 1, y = date.getFullYear();
      const dayA = reduceToArcana(d);
      const monthA = reduceToArcana(m);
      const yearA = reduceToArcana(sumDigits(y));
      const baseSum = reduceToArcana(dayA + monthA + yearA);
      const debt = reduceToArcana(yearA + Math.abs(dayA - monthA) + 1);
      const lesson = reduceToArcana(dayA * 2 + yearA);
      const tail = reduceToArcana(monthA + yearA + Math.abs(dayA - yearA));
      const release = reduceToArcana(debt + lesson);
      const reward = reduceToArcana(baseSum + release);
      const anchor = reduceToArcana(tail + debt + dayA);
      const mirror = reduceToArcana(Math.abs(reward - anchor) + lesson);
      setKarmicResult({ debt, lesson, tail, release, reward, anchor, mirror });
      setIsCalculating(false);
    }, 220);
  }, [karmicInput.dob, karmicInput.name]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (pathname !== tabToPath[tab]) {
      router.push(tabToPath[tab]);
    }
  };

  const combined = compatResult ? buildCombinedResult(compatResult.person1, compatResult.person2) : null;

  const emotional = compatResult ? Math.max(35, 100 - Math.abs(compatResult.person1.relationship - compatResult.person2.relationship) * 6) : 0;
  const karmic = compatResult ? Math.max(30, 100 - Math.abs(compatResult.person1.karmicTasks - compatResult.person2.karmicTasks) * 5) : 0;
  const purpose = compatResult ? Math.max(30, 100 - Math.abs(compatResult.person1.personalPurpose - compatResult.person2.personalPurpose) * 5) : 0;
  const communication = compatResult ? Math.max(35, 100 - Math.abs(compatResult.person1.firstImpression - compatResult.person2.firstImpression) * 6) : 0;

  const personalLines = personalResult
    ? [
        `DAY ${personalResult.A}: ${getInterpretation(personalResult.A).name}`,
        `MONTH ${personalResult.B}: ${getInterpretation(personalResult.B).name}`,
        `YEAR ${personalResult.C}: ${getInterpretation(personalResult.C).name}`,
        `SUM ${personalResult.D}: ${getInterpretation(personalResult.D).name}`,
        `CENTER ${personalResult.center}: ${getInterpretation(personalResult.center).advice}`,
        `LIFE PURPOSE ${personalResult.personalPurpose}: ${getInterpretation(personalResult.personalPurpose).advice}`,
      ]
    : [];

  const healthSection = personalResult ? computeHealthRows(personalResult) : null;
  const personalProfile = personalResult ? profileFor(personalResult.soulComfort) : null;
  const firstProfile = personalResult ? profileFor(personalResult.firstImpression) : null;
  const karmicProfile = personalResult ? profileFor(personalResult.karmicTasks) : null;
  const relationshipProfile = personalResult ? profileFor(personalResult.relationship) : null;
  const moneyProfile = personalResult ? profileFor(personalResult.money) : null;
  const talentProfile = personalResult ? profileFor(personalResult.talents) : null;
  const familyProfile = personalResult ? profileFor(personalResult.parentsRelation) : null;

  const personalAccordionItems = personalResult
    ? [
        {
          id: "soul",
          title: "Soul comfort",
          content: `Your Soul Comfort number is ${personalResult.soulComfort} - ${personalProfile?.name}. You feel most at ease in environments where ${personalProfile?.core}. At your best, ${personalProfile?.gift}. In difficult phases, tension rises when ${personalProfile?.lesson}. Your personal regulation strategy is to return to values, pace, and practices that make this arcana feel grounded in daily life.`,
        },
        {
          id: "first",
          title: "First impression",
          content: `Your First Impression number is ${personalResult.firstImpression} - ${firstProfile?.name}. People initially read your field as ${firstProfile?.core}. Socially, ${firstProfile?.gift}. If misunderstood, others may project ${firstProfile?.lesson}. A strong first-contact strategy is to pair your natural presence with simple, clear communication in the first few minutes of interaction.`,
        },
        {
          id: "karmic",
          title: "Karmic tasks & previous life",
          content: `Your Karmic Tail number is ${personalResult.karmicTasks} - ${karmicProfile?.name}. This indicates inherited patterns around ${karmicProfile?.lesson}. The mastery path asks for conscious choices rooted in ${karmicProfile?.core}. As this matures, ${karmicProfile?.gift}. Repetition decreases when you replace automatic reactions with intentional rituals, reflection, and accountability.`,
        },
        {
          id: "relationship",
          title: "Relationship",
          content: `Your Relationship line number is ${personalResult.relationship} - ${relationshipProfile?.name}. In love, you thrive when ${relationshipProfile?.relationship}. Emotional security builds when both partners support ${relationshipProfile?.core}. Friction appears when ${relationshipProfile?.lesson}. The healthiest partner dynamic for you includes mutual growth goals, emotional honesty, and shared responsibility for the relationship climate.`,
        },
        {
          id: "money",
          title: "Money",
          content: `Your Money line number is ${personalResult.money} - ${moneyProfile?.name}. Financial flow opens when ${moneyProfile?.money}. Your strongest strategy is to combine discipline with your natural ${moneyProfile?.gift}. Income tends to stagnate when ${moneyProfile?.lesson}. Sustainable wealth for your matrix is built through clarity of value, long-term planning, and steady execution of proven strengths.`,
        },
        {
          id: "talents",
          title: "Talents",
          content: `Your Talent number is ${personalResult.talents} - ${talentProfile?.name}. Your natural gifts include ${talentProfile?.talent}. You create high impact when your work aligns with ${talentProfile?.core}. Hidden potential unlocks when you move beyond ${talentProfile?.lesson}. Career directions that match this field typically reward your ability to turn insight into tangible outcomes for people or systems.`,
        },
        {
          id: "family",
          title: "Relationship with kids & parents",
          content: `Your Family line number is ${personalResult.parentsRelation} - ${familyProfile?.name}. In family dynamics, ${familyProfile?.family}. Your parenting and intergenerational style improves when anchored in ${familyProfile?.core}. The repeating challenge is ${familyProfile?.lesson}. Healing in this area grows through consistent boundaries, compassionate listening, and conscious rewriting of inherited communication patterns.`,
        },
      ]
    : [];

  const personalFaqItems: AccordionItemData[] = personalResult
    ? [
        { id: "pf1", title: "What does the personal matrix show?", content: `Your personal matrix shows the energetic blueprint encoded in your birth date and name. It reveals core behavior patterns, purpose themes, strengths, and recurring challenges. When read carefully, it becomes a practical guide for decisions, relationships, and growth.` },
        { id: "pf2", title: "How is the personal matrix calculated?", content: `The matrix is built from your birth day, month, year, and their arcana reductions across the chart. Each position represents a different life domain, and combined values show how those domains interact. The result is not random; it is a structured symbolic map derived from your date of birth.` },
        { id: "pf3", title: "What does the center number mean?", content: `The center number is the heart of the matrix and usually reflects your core life mission in action. It shows how your energies integrate when you are aligned and functioning well. In stressful periods, it also reveals the fastest path back to balance.` },
        { id: "pf4", title: "Why do I need my full date of birth?", content: `The full date is required because the matrix relies on the interaction between day, month, and year energies. Each part contributes distinct signals that cannot be separated without changing the meaning. Using all three produces a complete and reliable matrix structure.` },
        { id: "pf5", title: "Can the personal matrix help with career choice?", content: `Yes, especially through the talent, purpose, and money lines. These positions describe how you create value, where motivation comes naturally, and what work environment supports your growth. It is best used as a direction tool rather than a narrow job label.` },
        { id: "pf6", title: "How should I read the health chart?", content: `Read the health chart as a symbolic balance map for body, energy, and emotions. It highlights which chakras feel strong, which need support, and where repeated imbalance may appear. The chart works best as a self-awareness tool alongside real-world health habits.` },
        { id: "pf7", title: "Is the personal matrix fixed for life?", content: `Yes, the base matrix from your birth data remains constant. What changes is how the energies express as you grow, heal, and make choices. The numbers stay the same, but your relationship to them can mature significantly.` },
        { id: "pf8", title: "What does the soul comfort number mean?", content: `Soul comfort describes where you naturally feel safe, relaxed, and emotionally restored. It often explains why certain environments or habits feel "right" while others feel draining. Understanding it helps you build routines that support nervous system stability.` },
        { id: "pf9", title: "How do I use the matrix in daily life?", content: `Use it for reflection, planning, and noticing patterns in behavior or stress. It can help you choose better timing, communicate more clearly, and recognize when you need rest or action. The strongest results come from combining insight with consistent behavior changes.` },
        { id: "pf10", title: "Can the matrix predict my future exactly?", content: `No, it is not a literal prediction system. It provides a symbolic framework for tendencies, lessons, and likely growth directions. The matrix is most accurate when used as a guide for conscious choice rather than as deterministic fate.` },
      ]
    : [];

  const compatibilityLines = compatResult
    ? [
        `Compatibility score: ${compatResult.compatibilityScore}%`,
        `Emotional: ${Math.round(emotional)}%`,
        `Karmic: ${Math.round(karmic)}%`,
        `Purpose: ${Math.round(purpose)}%`,
        `Communication: ${Math.round(communication)}%`,
        `Strengths: ${compatResult.strengths.join(" ")}`,
        `Challenges: ${compatResult.challenges.join(" ")}`,
        `Advice: ${compatResult.advice}`,
      ]
    : [];

  const childLines = childResult
    ? [
        `Center ${childResult.center}: ${getInterpretation(childResult.center).name}`,
        `Talents ${childResult.talents}: ${getInterpretation(childResult.talents).positive}`,
        `Strength ${childResult.personalPurpose}: ${getInterpretation(childResult.personalPurpose).advice}`,
        `Challenges ${childResult.karmicTasks}: ${getInterpretation(childResult.karmicTasks).negative}`,
      ]
    : [];

  const arcanaLines = arcanaResult
    ? [
        `Dominant Arcana ${arcanaResult.dominant}: ${getInterpretation(arcanaResult.dominant).name} — your core archetypal identity.`,
        `Shadow Energy ${arcanaResult.shadow}: ${getInterpretation(arcanaResult.shadow).name} — hidden patterns to integrate.`,
        `Spirit Guide ${arcanaResult.guide}: ${getInterpretation(arcanaResult.guide).name} — your guiding archetype.`,
        `Challenge ${arcanaResult.challenge}: ${getInterpretation(arcanaResult.challenge).name} — growth edge to master.`,
        `Soul Gift ${arcanaResult.gift}: ${getInterpretation(arcanaResult.gift).name} — innate talent to share.`,
        `Life Path ${arcanaResult.path}: ${getInterpretation(arcanaResult.path).name} — direction of your journey.`,
        `Essence ${arcanaResult.essence}: ${getInterpretation(arcanaResult.essence).name} — your deepest energetic signature.`,
        `Cycle ${arcanaResult.cycle}: ${getInterpretation(arcanaResult.cycle).name} — current evolutionary phase.`,
      ]
    : [];

  const karmicLines = karmicResult
    ? [
        `Karmic Debt ${karmicResult.debt}: ${getInterpretation(karmicResult.debt).name} — unresolved energy from past cycles.`,
        `Soul Lesson ${karmicResult.lesson}: ${getInterpretation(karmicResult.lesson).name} — the teaching your soul chose.`,
        `Karmic Tail ${karmicResult.tail}: ${getInterpretation(karmicResult.tail).name} — ancestral pattern carried forward.`,
        `Release Point ${karmicResult.release}: ${getInterpretation(karmicResult.release).name} — where healing becomes possible.`,
        `Karmic Reward ${karmicResult.reward}: ${getInterpretation(karmicResult.reward).name} — gift unlocked through resolution.`,
        `Anchor Energy ${karmicResult.anchor}: ${getInterpretation(karmicResult.anchor).name} — grounding force in transformation.`,
        `Mirror ${karmicResult.mirror}: ${getInterpretation(karmicResult.mirror).name} — what others reflect back to you.`,
      ]
    : [];


  const compatHealth1 = compatResult ? computeHealthRows(compatResult.person1) : null;
  const compatHealth2 = compatResult ? computeHealthRows(compatResult.person2) : null;
  const childHealth = childResult ? computeHealthRows(childResult) : null;

  const healthCompatibility = compatHealth1 && compatHealth2
    ? compatHealth1.rows.map((row, index) => {
        const other = compatHealth2.rows[index];
        const diff = Math.abs(row.energy - other.energy);
        return {
          chakra: row.name,
          status: diff <= 2 ? "harmonious" : diff <= 6 ? "adaptive" : "conflicting",
        };
      })
    : [];

  const compatibilityAccordionItems: AccordionItemData[] = compatResult && combined
    ? [
        { id: "relationship-energy", title: "Relationship energy", content: `Your combined center is ${combined.center} (${profileFor(combined.center).name}). This number describes the emotional atmosphere you create together and how quickly you recover from conflict. The relationship stabilizes when both partners consciously practice ${profileFor(combined.center).core} in daily communication. Long-term harmony grows because ${profileFor(combined.center).gift}.` },
        { id: "communication-style", title: "Communication style", content: `Communication is shaped by ${compatResult.person1.firstImpression} and ${compatResult.person2.firstImpression}. Person one naturally expresses through ${profileFor(compatResult.person1.firstImpression).core}, while person two leads with ${profileFor(compatResult.person2.firstImpression).core}. Misunderstandings are reduced when you translate intent before reacting and align on shared language around needs. The pair becomes strong at dialogue when both avoid ${profileFor(combined.firstImpression).lesson}.` },
        { id: "emotional-connection", title: "Emotional connection", content: `Heart resonance is shown through relationship numbers ${compatResult.person1.relationship} and ${compatResult.person2.relationship}. Emotional closeness increases when each partner receives care in their native style, not just in their own style. Your matrix suggests emotional bonding improves through rhythm, rituals, and direct reassurance in stressful cycles. Together you unlock deeper intimacy by embodying ${profileFor(combined.relationship).gift}.` },
        { id: "karmic-bond", title: "Karmic bond", content: `Karmic interaction is indicated by ${compatResult.person1.karmicTasks} and ${compatResult.person2.karmicTasks}. This connection carries lessons around repeating patterns, accountability, and conscious repair after rupture. The relationship becomes karmically productive when both partners replace blame with curiosity and practical agreements. Shared growth accelerates because ${profileFor(combined.karmicTasks).core}.` },
        { id: "money-growth", title: "Money & growth together", content: `Financial compatibility flows through money numbers ${compatResult.person1.money} and ${compatResult.person2.money}. One partner may favor security while the other favors expansion, and both are needed for sustainable progress. The healthiest strategy is to separate safety budget, growth budget, and experimentation budget with clear review cycles. Prosperity increases when the couple operationalizes ${profileFor(combined.money).money}.` },
        { id: "physical-attraction", title: "Physical attraction", content: `Physical chemistry is read from root and sacral dynamics reflected in your lower matrix channels. Attraction is naturally activated by polarity, novelty, and emotional safety happening together. The connection remains strong when desire is paired with trust-building behaviors and consistent relational care. Your joint pattern indicates attraction deepens through ${profileFor(combined.G).core} and ${profileFor(combined.H).core}.` },
        { id: "long-term", title: "Long term potential", content: `Long-term potential is anchored in purpose alignment ${compatResult.person1.personalPurpose} and ${compatResult.person2.personalPurpose}. Even with differences, this pair can sustain growth when vision, responsibility, and pace are negotiated explicitly. Major milestones are best approached with quarterly planning and clear emotional check-ins. The matrix shows durable potential because ${profileFor(combined.personalPurpose).gift}.` },
        { id: "past-life", title: "Past life connection", content: "", locked: true },
        { id: "children-potential", title: "Children potential", content: "", locked: true },
        { id: "soul-contract", title: "Soul contract", content: "", locked: true },
      ]
    : [];

  const compatibilityFaqItems: AccordionItemData[] = compatResult
    ? [
        { id: "cf1", title: "How is the compatibility score calculated?", content: `The score combines shared matrix energies, center resonance, and key line differences between both charts. It balances harmony markers with growth-friction markers so the number reflects both ease and challenge. A higher score means less energetic friction, while mid-range scores usually indicate strong growth potential with conscious work.` },
        { id: "cf2", title: "What does the combined compatibility matrix show?", content: `The combined matrix represents your joint energetic field as a couple rather than two separate personalities. It highlights how you function as a unit when making decisions, handling pressure, and building shared goals. Think of it as the relationship identity that emerges when both individual systems interact.` },
        { id: "cf3", title: "Can two people with very different matrices be compatible?", content: `Yes, difference does not mean incompatibility; it often means complementary growth. Pairs with contrast can be highly successful when communication structure and emotional safety are strong. The matrix helps identify where translation and adaptation are needed so differences become strengths.` },
        { id: "cf4", title: "What is a karmic bond in destiny matrix compatibility?", content: `A karmic bond appears when key karmic or relationship numbers repeatedly interact across both charts. It usually signals unfinished emotional lessons around boundaries, trust, or responsibility. These relationships can be transformational when both people choose awareness over repetition.` },
        { id: "cf5", title: "What does the Soul Contract mean for a couple?", content: `A soul contract describes the deeper lesson set that your relationship activates over time. It explains why certain themes keep returning until consciously integrated. In practice, it helps couples focus on the purpose behind conflict, not just the surface trigger.` },
        { id: "cf6", title: "How do I interpret the M and F lines in compatibility?", content: `The M and F lines represent active and receptive expression patterns in the relationship system. Balanced interaction between these lines supports good polarity, attraction, and joint decision-making. Imbalances suggest where one partner over-functions and the other under-expresses.` },
        { id: "cf7", title: "What chakra alignment matters most in relationships?", content: `Heart and throat alignment usually drive emotional security and communication quality. Root and sacral influence chemistry, safety, and physical connection. Long-term stability comes from integrating all centers, with extra attention to the weakest shared points.` },
        { id: "cf8", title: "Can compatibility change over time?", content: `Yes, compatibility evolves with personal growth, healing work, and life stage transitions. The base matrix remains constant, but expression quality can significantly improve or decline. Conscious habits can raise practical compatibility even when raw differences stay the same.` },
        { id: "cf9", title: "Is destiny matrix compatibility the same as astrology compatibility?", content: `No, they are different systems with different symbolic structures and timing logic. Astrology emphasizes planetary cycles, while destiny matrix emphasizes birth-number archetypes and line interactions. Many people use both together for broader perspective.` },
        { id: "cf10", title: "How accurate is destiny matrix compatibility analysis?", content: `Accuracy depends on correct birth data and honest self-observation while interpreting results. The matrix is strongest as a behavioral and energetic map, not as deterministic fate. Used well, it offers actionable guidance for communication, alignment, and relationship growth.` },
      ]
    : [];

  const childAccordionItems: AccordionItemData[] = childResult
    ? [
        { id: "child-soul", title: "Child's soul comfort", content: `Your child carries Soul Comfort number ${childResult.soulComfort} (${profileFor(childResult.soulComfort).name}). This child feels safest when their environment reflects ${profileFor(childResult.soulComfort).core}. Consistent routines and emotionally predictable responses make their nervous system settle quickly. Confidence expands as they are encouraged to express ${profileFor(childResult.soulComfort).gift}.` },
        { id: "child-talents", title: "Natural talents", content: `Talent number ${childResult.talents} indicates strengths in ${profileFor(childResult.talents).talent}. These gifts become visible when learning is practical, playful, and purpose-linked. The fastest development appears when adults reinforce process over pressure. Over time this talent can become a meaningful life vocation.` },
        { id: "child-learning", title: "Learning style", content: `Learning pattern is influenced by numbers ${childResult.firstImpression} and ${childResult.talents}. This child absorbs information best through layered repetition with emotional context and clear examples. Short feedback loops and visual structure improve retention dramatically. Encouragement works better than correction-heavy teaching.` },
        { id: "child-emotional", title: "Emotional needs", content: `Emotional line ${childResult.relationship} shows the child needs secure connection and clear co-regulation from caregivers. They respond strongly to tone and relational atmosphere before words. Emotional literacy practices help them name feelings and recover faster after stress. Stability grows when adults model calm repair after conflict.` },
        { id: "child-mother", title: "Relationship with mother", content: `Maternal dynamic is reflected by child center ${childResult.center} interacting with maternal influence patterns. The bond strengthens when mother energy provides consistency without overcontrol. This child benefits from being guided through choices rather than forced into outcomes. Emotional trust rises when needs are validated first, then redirected.` },
        { id: "child-father", title: "Relationship with father", content: `Paternal dynamic is shaped by father energy in discipline, boundaries, and confidence modeling. This child responds best to firm but warm guidance and practical engagement. Predictable limits create safety, while shared projects build trust. The relationship grows strongest when correction is paired with encouragement.` },
        { id: "child-purpose", title: "Life purpose", content: `Life mission number ${childResult.personalPurpose} indicates a long path of ${profileFor(childResult.personalPurpose).core}. In early years this appears as recurring interests and a specific way of solving problems. Supporting this purpose means exposing the child to meaningful challenges with age-appropriate responsibility. Their contribution potential expands through sustained confidence and value-based guidance.` },
        { id: "child-karmic", title: "Karmic program", content: "", locked: true },
        { id: "child-teen", title: "Teen years forecast", content: "", locked: true },
        { id: "child-career", title: "Career & money potential", content: "", locked: true },
      ]
    : [];

  const childFaqItems: AccordionItemData[] = childResult
    ? [
        { id: "chf1", title: "What is a child destiny matrix?", content: `A child destiny matrix maps innate energies present from birth into a structured symbolic pattern. It helps parents understand temperament, emotional wiring, and developmental strengths. Used properly, it supports guidance, not labeling.` },
        { id: "chf2", title: "How is the child matrix different from a personal matrix?", content: `The calculation base is similar, but interpretation priorities are different for children. Child readings focus on development support, regulation needs, and educational alignment rather than adult life outcomes. It is a parenting guidance lens rather than a prediction tool.` },
        { id: "chf3", title: "What age can I calculate a child matrix for?", content: `You can calculate it from birth because the matrix is birth-date based. Early years usually reveal emotional and behavioral patterns first. As the child grows, additional lines become easier to observe in real life.` },
        { id: "chf4", title: "How do parent birth dates affect the child's matrix?", content: `Parent dates do not change the child matrix itself, but they influence interaction dynamics and expression. Comparing parent and child charts highlights resonance and friction zones in communication. This makes it easier to choose supportive parenting strategies.` },
        { id: "chf5", title: "What does the child's karmic program mean?", content: `Karmic program refers to recurring lessons the child may revisit through relationships and choices. It is not punishment; it is a development theme requiring maturity over time. Parents help most by modeling healthy responses to that theme.` },
        { id: "chf6", title: "How can I use the child matrix to support education?", content: `Use it to identify attention style, motivation style, and stress triggers in learning environments. Then adapt pacing, teaching format, and feedback style accordingly. This often improves confidence and reduces conflict around schoolwork.` },
        { id: "chf7", title: "What are the most important numbers in a child's matrix?", content: `Center, soul comfort, talents, relationship line, and purpose are usually the most practical anchors. Together they describe regulation, abilities, social style, and long-term direction. Tracking these over time helps parenting stay aligned with the child.` },
        { id: "chf8", title: "Can I calculate a matrix for an unborn child?", content: `A provisional matrix can be generated if a birth date is known, but practical interpretation is limited before real-world expression. After birth, observation confirms how energies present behaviorally. Treat prenatal readings as tentative only.` },
        { id: "chf9", title: "How often should I review my child's destiny matrix?", content: `A yearly review is typically enough, with extra checks at major transitions like school changes or puberty onset. The numbers stay fixed, but expression evolves with age and context. Periodic review helps adapt parenting style effectively.` },
        { id: "chf10", title: "Is the child matrix the same as a natal astrology chart?", content: `No, these are distinct symbolic systems with different methods and interpretive language. Astrology uses planetary positions, while destiny matrix uses birth-number structures. Some families combine both for complementary insight.` },
      ]
    : [];


  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border bg-background py-8 sm:py-14 text-center">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-2xl sm:text-3xl md:text-5xl">Destiny Matrix Calculator</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">Personal matrix, compatibility, child reading, and year forecast — all in one place.</p>
            <div className="mt-6 flex justify-start sm:justify-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`rounded-xl px-4 sm:px-5 py-2.5 text-sm font-semibold transition whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] text-white"
                      : "border border-border bg-card text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {isCalculating && (
          <div className="sticky top-16 z-30 border-b border-border bg-card/95 py-2 backdrop-blur">
            <p className="text-center text-sm text-primary">Calculating matrix...</p>
          </div>
        )}

        <section className="py-6 sm:py-10">
          <div className="container mx-auto px-4">
            {activeTab === "personal" && (
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card p-5 sm:p-8"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] xl:grid-cols-[1.2fr_1fr_1fr_auto]">
                    <Input
                      value={personalInput.name}
                      onChange={(event) => setPersonalInput((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Enter your full name"
                      className="h-12 border-input bg-input text-foreground"
                    />
                    <Input
                      value={personalInput.dob}
                      onChange={(event) => setPersonalInput((prev) => ({ ...prev, dob: maskDobInput(event.target.value) }))}
                      placeholder="DD/MM/YYYY"
                      inputMode="numeric"
                      className="h-12 border-input bg-card text-foreground"
                    />

                    <div className="flex rounded-xl border border-input bg-background p-1">
                      <button
                        type="button"
                        onClick={() => setPersonalInput((prev) => ({ ...prev, gender: "M" }))}
                        className={`flex-1 rounded-lg px-3 text-sm ${personalInput.gender === "M" ? "bg-primary text-white" : "text-muted-foreground"}`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonalInput((prev) => ({ ...prev, gender: "F" }))}
                        className={`flex-1 rounded-lg px-3 text-sm ${personalInput.gender === "F" ? "bg-primary text-white" : "text-muted-foreground"}`}
                      >
                        Female
                      </button>
                    </div>

                    <Button
                      onClick={calculatePersonal}
                      disabled={!personalReady || isCalculating}
                      className="col-span-1 sm:col-span-2 h-12 rounded-[10px] bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-6 text-base font-semibold text-white hover:from-[#6d28d9] hover:to-[#4338ca] lg:col-span-1"
                    >
                      Calculate Matrix
                    </Button>
                  </div>
                </motion.div>

                {personalResult && personalCalculated && (
                  <>
                    <div ref={personalRef} className="rounded-2xl border border-border bg-card p-4">
                      <Suspense fallback={<div className="h-[560px] rounded-xl bg-background" />}>
                        <MatrixVisualization result={personalResult} size="large" />
                      </Suspense>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="font-display text-xl">Core Numbers</h3>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                          <li>Day: {personalResult.A} - {getInterpretation(personalResult.A).name}</li>
                          <li>Month: {personalResult.B} - {getInterpretation(personalResult.B).name}</li>
                          <li>Year: {personalResult.C} - {getInterpretation(personalResult.C).name}</li>
                          <li>Sum: {personalResult.D} - {getInterpretation(personalResult.D).name}</li>
                          <li>Center: {personalResult.center} - {getInterpretation(personalResult.center).name}</li>
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="font-display text-xl">Purpose Numbers</h3>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                          <li>Sky {personalResult.skyPurpose}: {getInterpretation(personalResult.skyPurpose).advice}</li>
                          <li>Life {personalResult.personalPurpose}: {getInterpretation(personalResult.personalPurpose).advice}</li>
                          <li>Earth {personalResult.earthPurpose}: {getInterpretation(personalResult.earthPurpose).advice}</li>
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="font-display text-xl">Current Year Forecast</h3>
                        <p className="mt-3 font-display text-4xl text-[#ca8a04]">{personalResult.personalYear}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{getInterpretation(personalResult.personalYear).advice}</p>
                      </div>
                    </div>

                    {healthSection && (
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="font-display text-3xl text-foreground">Health chart</h3>
                        <div className="mt-4 overflow-x-auto">
                          <table className="w-full min-w-[740px] border-separate border-spacing-y-2">
                            <thead>
                              <tr>
                                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">Name of chakra</th>
                                <th className="px-3 py-2 text-center text-xs uppercase tracking-[0.14em] text-muted-foreground">Physics</th>
                                <th className="px-3 py-2 text-center text-xs uppercase tracking-[0.14em] text-muted-foreground">Energy</th>
                                <th className="px-3 py-2 text-center text-xs uppercase tracking-[0.14em] text-muted-foreground">Emotions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {healthSection.rows.map((row, index) => (
                                <tr key={row.name} className={`${index % 2 === 0 ? "bg-secondary" : "bg-muted"} rounded-lg`}>
                                  <td className="rounded-l-lg border border-border px-3 py-3">
                                    <span style={{ color: row.color }} className="font-medium">{row.name}</span>
                                  </td>
                                  {[row.physics, row.energy, row.emotions].map((value, valueIndex) => (
                                    <td key={`${row.name}-${valueIndex}`} className={`${valueIndex === 2 ? "rounded-r-lg" : ""} border border-border px-3 py-3 text-center`}>
                                      <span
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border text-base text-foreground"
                                        style={{ borderColor: row.color, background: "var(--background)" }}
                                      >
                                        {value}
                                      </span>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                              <tr className="bg-[color:var(--secondary)]">
                                <td className="rounded-l-lg border border-border px-3 py-3 text-sm font-bold text-accent">Result</td>
                                <td className="border border-border px-3 py-3 text-center text-lg font-bold text-accent">{healthSection.totals.physics}</td>
                                <td className="border border-border px-3 py-3 text-center text-lg font-bold text-accent">{healthSection.totals.energy}</td>
                                <td className="rounded-r-lg border border-border px-3 py-3 text-center text-lg font-bold text-accent">{healthSection.totals.emotions}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="rounded-2xl border border-border bg-card p-8">
                      <div className="grid gap-6 md:grid-cols-3 md:divide-x md:divide-border">
                        <div className="md:pr-6">
                          <h3 className="font-display text-xl text-foreground">Personal purpose</h3>
                          <p className="mt-2 text-sm text-accent"><span className="font-bold">Soul searching</span> <span className="text-text-secondary">- tasks for your fulfillment before 40 y.o.</span></p>
                          <div className="mt-5">
                            <svg viewBox="0 0 240 160" className="w-full max-w-[260px]">
                              <line x1="82" y1="44" x2="82" y2="116" stroke="#7c3aed" strokeWidth="2" />
                              <line x1="82" y1="80" x2="172" y2="80" stroke="#7c3aed" strokeWidth="2" />
                              <circle cx="82" cy="44" r="22" fill="#1a0f35" stroke="#3b1f6e" strokeWidth="2" />
                              <circle cx="82" cy="116" r="22" fill="#1a0f35" stroke="#3b1f6e" strokeWidth="2" />
                              <circle cx="186" cy="80" r="26" fill="#1a0f35" stroke="#7c3aed" strokeWidth="2" />
                              <text x="34" y="48" fill="#f43f5e" fontSize="12">Sky</text>
                              <text x="28" y="120" fill="#f43f5e" fontSize="12">Earth</text>
                              <text x="82" y="49" textAnchor="middle" fill="#f5f0ff" fontSize="16" fontFamily="Cinzel, serif">{personalResult.skyPurpose}</text>
                              <text x="82" y="121" textAnchor="middle" fill="#f5f0ff" fontSize="16" fontFamily="Cinzel, serif">{personalResult.earthPurpose}</text>
                              <text x="186" y="85" textAnchor="middle" fill="#c4b5fd" fontSize="18" fontFamily="Cinzel, serif">{personalResult.personalPurpose}</text>
                            </svg>
                          </div>
                        </div>

                        <div className="md:px-6">
                          <h3 className="font-display text-xl text-foreground">Social purpose</h3>
                          <p className="mt-2 text-sm text-accent"><span className="font-bold">Implementation in society.</span> <span className="text-text-secondary">What can and should you do for the world? Activated at 40 y.o.</span></p>
                          <div className="mt-5">
                            <svg viewBox="0 0 240 160" className="w-full max-w-[260px]">
                              <line x1="82" y1="44" x2="82" y2="116" stroke="#7c3aed" strokeWidth="2" />
                              <line x1="82" y1="80" x2="172" y2="80" stroke="#7c3aed" strokeWidth="2" />
                              <circle cx="82" cy="44" r="22" fill="#1a0f35" stroke="#3b1f6e" strokeWidth="2" />
                              <circle cx="82" cy="116" r="22" fill="#1a0f35" stroke="#3b1f6e" strokeWidth="2" />
                              <circle cx="186" cy="80" r="26" fill="#1a0f35" stroke="#7c3aed" strokeWidth="2" />
                              <text x="42" y="48" fill="#f43f5e" fontSize="12">M</text>
                              <text x="44" y="120" fill="#f43f5e" fontSize="12">F</text>
                              <text x="82" y="49" textAnchor="middle" fill="#f5f0ff" fontSize="16" fontFamily="Cinzel, serif">{personalResult.E}</text>
                              <text x="82" y="121" textAnchor="middle" fill="#f5f0ff" fontSize="16" fontFamily="Cinzel, serif">{personalResult.H}</text>
                              <text x="186" y="85" textAnchor="middle" fill="#c4b5fd" fontSize="18" fontFamily="Cinzel, serif">{reduceToArcana(personalResult.E + personalResult.H)}</text>
                            </svg>
                          </div>
                        </div>

                        <div className="md:pl-6">
                          <h3 className="font-display text-xl text-foreground">General purpose</h3>
                          <p className="mt-2 text-sm text-accent"><span className="font-bold">Experience gained throughout life.</span> <span className="text-text-secondary">Starts working for you at 60 y.o.</span></p>
                          <div className="mt-8 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#ca8a04] bg-card font-display text-2xl text-foreground">
                              {personalResult.personalPurpose}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5">
                      <div className="mb-5">
                        <h3 className="font-display text-3xl text-foreground">Your personal destiny matrix information</h3>
                        <div className="mt-2 h-1 w-72 rounded-full bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#4f46e5]" />
                      </div>

                      <div className="space-y-3">
                        {personalAccordionItems.map((item) => {
                          const isOpen = openPersonalAccordion === item.id;
                          return (
                            <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-card">
                              <button
                                type="button"
                                onClick={() => setOpenPersonalAccordion(isOpen ? "" : item.id)}
                                className="flex w-full items-center justify-between px-6 py-5 text-left"
                              >
                                <span className="text-base text-foreground">{item.title}</span>
                                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                  <ChevronDown className="h-4 w-4 text-text-secondary" />
                                </motion.span>
                              </button>
                              {isOpen ? (
                                <div className="bg-page px-6 py-4 text-sm leading-7 text-text-muted">
                                  {item.content}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}

                        {["Generic tasks", "Personal year's forecast"].map((title) => (
                          <div key={title} className="overflow-hidden rounded-xl border border-border bg-card">
                            <div className="flex items-center justify-between px-6 py-5">
                              <span className="text-base text-foreground">{title}</span>
                              <Lock className="h-4 w-4 text-text-muted" />
                            </div>
                            <div className="relative bg-page px-6 py-4">
                              <p className="text-sm leading-7 text-text-muted" style={{ filter: "blur(4px)" }}>
                                This extended reading includes advanced interpretation layers, life-period mapping, and actionable personalized guidance.
                              </p>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => setShowLockedModal(true)}
                                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                                >
                                  🔒 Unlock Full Reading
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <ReportActionBar
                      bundle={{
                        shareTitle: `${personalCalculated.name}'s Destiny Matrix`,
                        shareText: `I just calculated my destiny matrix — center ${personalResult.center}, life purpose ${personalResult.personalPurpose}. Try yours free:`,
                        pdfTitle: `Personal Matrix - ${personalCalculated.name}`,
                        lines: personalLines,
                        chartNode: () => personalRef.current,
                        pngFileName: `matrix-${personalCalculated.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.png`,
                        pdfFileName: `matrix-report-${format(new Date(), "yyyy-MM-dd")}.pdf`,
                      }}
                    />

                    {faqSeparator()}

                    <InfoAccordion
                      title="Personalized interpretation"
                      items={personalFaqItems}
                      openId={openFaqAccordion}
                      onToggle={(id) => setOpenFaqAccordion((prev) => (prev === id ? "" : id))}
                      onUnlock={() => setShowLockedModal(true)}
                    />
                  </>
                )}

                {/* Always visible — blog + FAQ */}
                <RelatedBlogSection tab="personal" />
                <StaticFaqSection tab="personal" />
              </div>
            )}

            {activeTab === "compatibility" && (
              <div className="space-y-8">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                    <Input
                      value={compatInput.p1.name}
                      onChange={(event) => setCompatInput((prev) => ({ ...prev, p1: { ...prev.p1, name: event.target.value } }))}
                      placeholder="Enter name"
                      className="h-12 border-border bg-card text-foreground"
                    />
                    <div>
                      <Input
                        value={compatInput.p1.dob}
                        onChange={(event) => setCompatInput((prev) => ({ ...prev, p1: { ...prev.p1, dob: maskDobInput(event.target.value) } }))}
                        placeholder="DD/MM/YYYY"
                        inputMode="numeric"
                        className="h-12 border-border bg-card text-foreground"
                      />
                      {compatErrors.p1Dob ? <p className="mt-1 text-xs text-red-400">{compatErrors.p1Dob}</p> : null}
                    </div>
                    <Input
                      value={compatInput.p2.name}
                      onChange={(event) => setCompatInput((prev) => ({ ...prev, p2: { ...prev.p2, name: event.target.value } }))}
                      placeholder="Enter name"
                      className="h-12 border-border bg-card text-foreground"
                    />
                    <div>
                      <Input
                        value={compatInput.p2.dob}
                        onChange={(event) => setCompatInput((prev) => ({ ...prev, p2: { ...prev.p2, dob: maskDobInput(event.target.value) } }))}
                        placeholder="DD/MM/YYYY"
                        inputMode="numeric"
                        className="h-12 border-border bg-card text-foreground"
                      />
                      {compatErrors.p2Dob ? <p className="mt-1 text-xs text-red-400">{compatErrors.p2Dob}</p> : null}
                    </div>
                    <Button
                      onClick={calculateCompat}
                      disabled={!compatReady || isCalculating}
                      className="col-span-1 sm:col-span-2 h-12 rounded-[10px] bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-6 text-base font-bold text-white hover:from-[#6d28d9] hover:to-[#4338ca] lg:col-span-1"
                    >
                      GET STARTED
                    </Button>
                  </div>
                </div>

                {compatResult && combined && compatCalculated && (
                  <>
                    <div ref={compatibilityRef} className="rounded-2xl border border-border bg-card p-5">
                      <div className="grid items-start gap-5 grid-cols-1 lg:grid-cols-[1fr_0.75fr_1fr]">
                        <div>
                          <div className="mb-3 flex items-center justify-between">
                            <p className="font-display text-lg text-accent">Your Matrix</p>
                            <span className="rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-text-secondary">CURRENT AGE: {compatResult.person1.currentAge} YEARS</span>
                          </div>
                          <Suspense fallback={<div className="h-[420px] rounded-xl bg-page" />}>
                            <MatrixVisualization result={compatResult.person1} size="normal" showAges showIntermediateAges />
                          </Suspense>
                        </div>

                        <div>
                          <p className="mb-3 text-center font-display text-lg text-accent">Compatibility matrix</p>
                          <Suspense fallback={<div className="h-[360px] rounded-xl bg-page" />}>
                            <MatrixVisualization result={combined} size="compact" showAges={false} showIntermediateAges={false} showPurposeBar={false} />
                          </Suspense>
                        </div>

                        <div>
                          <div className="mb-3 flex items-center justify-between">
                            <p className="font-display text-lg text-accent">Partner&apos;s Matrix</p>
                            <span className="rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-text-secondary">CURRENT AGE: {compatResult.person2.currentAge} YEARS</span>
                          </div>
                          <Suspense fallback={<div className="h-[420px] rounded-xl bg-page" />}>
                            <MatrixVisualization result={compatResult.person2} size="normal" showAges showIntermediateAges />
                          </Suspense>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-0">
                      <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
                        <div className="p-5">
                          <h4 className="font-display text-xl text-foreground">Relationships</h4>
                          <p className="mt-1 text-sm text-accent">Soul searching</p>
                          <p className="mt-2 text-xs text-text-muted">tasks for your fulfillment before 40 y.o.</p>
                          <p className="mt-4 font-display text-lg text-[#ca8a04]">Sky {compatResult.person1.skyPurpose} {"->"} {reduceToArcana(compatResult.person1.skyPurpose + compatResult.person2.skyPurpose)}</p>
                          <p className="mt-1 font-display text-lg text-[#ca8a04]">Earth {compatResult.person2.earthPurpose} {"->"} {reduceToArcana(compatResult.person1.earthPurpose + compatResult.person2.earthPurpose)}</p>
                        </div>
                        <div className="p-5">
                          <h4 className="font-display text-xl text-foreground">Partnership</h4>
                          <p className="mt-1 text-sm text-accent">Implementation in society</p>
                          <p className="mt-2 text-xs text-text-muted">What can and should you do for the world? Activated at 40 y.o.</p>
                          <p className="mt-4 font-display text-lg text-[#ca8a04]">Male {compatResult.person1.personalPurpose} + Female {compatResult.person2.personalPurpose} {"->"} {combined.personalPurpose}</p>
                        </div>
                        <div className="p-5">
                          <h4 className="font-display text-xl text-foreground">Unity</h4>
                          <p className="mt-1 text-sm text-accent">Experience gained throughout life</p>
                          <p className="mt-2 text-xs text-text-muted">Starts working for you at 60 y.o.</p>
                          <p className="mt-4 font-display text-4xl text-[#ca8a04]">{combined.center}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5">
                      <div className="mb-5 flex justify-center">
                        <ScoreRing score={compatResult.compatibilityScore} />
                      </div>
                      {[
                        { label: "Emotional harmony", value: emotional },
                        { label: "Karmic connection", value: karmic },
                        { label: "Life purpose alignment", value: purpose },
                        { label: "Communication energy", value: communication },
                      ].map((row) => (
                        <div key={row.label} className="mb-4 last:mb-0">
                          <div className="mb-1 flex items-center justify-between text-sm text-text-secondary">
                            <span>{row.label}</span>
                            <span>{Math.round(row.value)}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-elevated">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#0e7490] to-[#059669]" style={{ width: `${Math.round(row.value)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {compatHealth1 && compatHealth2 ? (
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <div className="grid gap-4 lg:grid-cols-2">
                          <HealthChart
                            healthChart={toChakraRows(compatHealth1.rows)}
                            title={`${compatResult.person1.name || "Person 1"}'s Health Chart`}
                            accentTitleColor="#c4b5fd"
                          />
                          <HealthChart
                            healthChart={toChakraRows(compatHealth2.rows)}
                            title={`${compatResult.person2.name || "Person 2"}'s Health Chart`}
                            accentTitleColor="#c4b5fd"
                          />
                        </div>

                        <div className="mt-4 rounded-xl border border-border bg-card p-4">
                          <p className="text-sm font-semibold text-foreground">Health Compatibility</p>
                          <div className="mt-2 grid gap-2 md:grid-cols-2">
                            {healthCompatibility.map((item) => (
                              <div key={item.chakra} className="flex items-center justify-between rounded-lg border border-border bg-page px-3 py-2">
                                <span className="text-sm text-text-secondary">{item.chakra}</span>
                                <span className={`text-xs font-semibold uppercase tracking-[0.12em] ${item.status === "harmonious" ? "text-[#059669]" : item.status === "adaptive" ? "text-[#b45309]" : "text-[#dc2626]"}`}>
                                  {item.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <InfoAccordion
                      title="Your compatibility matrix information"
                      items={compatibilityAccordionItems}
                      openId={openCompatibilityAccordion}
                      onToggle={(id) => setOpenCompatibilityAccordion((prev) => (prev === id ? "" : id))}
                      onUnlock={() => setShowLockedModal(true)}
                    />

                    {faqSeparator()}

                    <InfoAccordion
                      title="Your compatibility insights"
                      items={compatibilityFaqItems}
                      openId={openFaqAccordion}
                      onToggle={(id) => setOpenFaqAccordion((prev) => (prev === id ? "" : id))}
                      onUnlock={() => setShowLockedModal(true)}
                    />

                    <ReportActionBar
                      bundle={{
                        shareTitle: `${compatCalculated.p1.name} & ${compatCalculated.p2.name} — Compatibility`,
                        shareText: `Our destiny matrix compatibility is ${compatResult.compatibilityScore}%! Calculate yours free:`,
                        pdfTitle: `Compatibility Report - ${compatCalculated.p1.name} & ${compatCalculated.p2.name}`,
                        lines: compatibilityLines,
                        chartNode: () => compatibilityRef.current,
                        pngFileName: `compatibility-${format(new Date(), "yyyy-MM-dd")}.png`,
                        pdfFileName: `compatibility-report-${format(new Date(), "yyyy-MM-dd")}.pdf`,
                      }}
                    />
                  </>
                )}

                {/* Always visible — blog + FAQ */}
                <RelatedBlogSection tab="compatibility" />
                <StaticFaqSection tab="compatibility" />
              </div>
            )}

            {activeTab === "child" && (
              <div className="space-y-8">
                <div className="grid gap-6 xl:grid-cols-3">
                  {[
                    { key: "child", title: "Child" },
                    { key: "mother", title: "Mother" },
                    { key: "father", title: "Father" },
                  ].map((card) => {
                    const data = childInput[card.key as keyof typeof childInput];
                    return (
                      <div key={card.key} className="rounded-2xl border border-border bg-card p-6">
                        <h3 className="font-display text-xl">{card.title}</h3>
                        <div className="mt-4 space-y-3">
                          <Input
                            value={data.name}
                            onChange={(event) =>
                              setChildInput((prev) => ({
                                ...prev,
                                [card.key]: { ...(prev[card.key as keyof typeof prev] as NameDateState), name: event.target.value },
                              }))
                            }
                            placeholder={`${card.title} full name`}
                            className="h-11 border-border bg-page"
                          />
                          <DateTriplet
                            value={data}
                            onChange={(next) =>
                              setChildInput((prev) => ({
                                ...prev,
                                [card.key]: { ...(prev[card.key as keyof typeof prev] as NameDateState), ...next },
                              }))
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center">
                  <Button onClick={calculateChild} disabled={!childReady || isCalculating} className="h-12 rounded-[10px] bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-6 text-base text-white hover:from-[#6d28d9] hover:to-[#4338ca]">
                    Calculate Child Matrix
                  </Button>
                </div>

                {childResult && influence && childCalculated && (
                  <>
                    <div ref={childRef} className="rounded-2xl border border-border bg-card p-5">
                      <Suspense fallback={<div className="h-[560px] rounded-xl bg-page" />}>
                        <MatrixVisualization result={childResult} size="large" />
                      </Suspense>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <h4 className="font-display text-lg">Maternal Influence</h4>
                        <p className="mt-2 font-display text-4xl text-[#0d9488]">{Math.round(influence.maternal)}%</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <h4 className="font-display text-lg">Paternal Influence</h4>
                        <p className="mt-2 font-display text-4xl text-[#0d9488]">{Math.round(influence.paternal)}%</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-border bg-page p-4">
                          <Sparkles className="h-5 w-5 text-[#059669]" />
                          <h5 className="mt-2 font-display text-lg">Talents</h5>
                          <p className="mt-2 text-sm text-text-secondary">{getInterpretation(childResult.talents).advice}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-page p-4">
                          <ShieldCheck className="h-5 w-5 text-[#3b82f6]" />
                          <h5 className="mt-2 font-display text-lg">Strengths</h5>
                          <p className="mt-2 text-sm text-text-secondary">{getInterpretation(childResult.personalPurpose).positive}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-page p-4">
                          <TriangleAlert className="h-5 w-5 text-[#dc2626]" />
                          <h5 className="mt-2 font-display text-lg">Challenges</h5>
                          <p className="mt-2 text-sm text-text-secondary">{getInterpretation(childResult.karmicTasks).negative}</p>
                        </div>
                      </div>
                    </div>

                    {childHealth ? (
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <HealthChart
                          healthChart={toChakraRows(childHealth.rows)}
                          title={`${childCalculated.child.name || "Child"}'s Health Chart`}
                          accentTitleColor="#c4b5fd"
                        />

                        <div className="mt-4 rounded-xl border border-border bg-card p-4">
                          <h4 className="font-display text-lg text-foreground">Parental Health Influence</h4>
                          <div className="mt-3 grid gap-2 md:grid-cols-2">
                            <div className="rounded-lg border border-border bg-page p-3">
                              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Mother</p>
                              <p className="mt-1 text-sm text-text-secondary">Dominant influence on emotional regulation and heart-throat expression.</p>
                              <p className="mt-1 font-display text-xl text-[#0d9488]">{Math.round(influence.maternal)}%</p>
                            </div>
                            <div className="rounded-lg border border-border bg-page p-3">
                              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Father</p>
                              <p className="mt-1 text-sm text-text-secondary">Dominant influence on grounding, discipline, and root-solar activation.</p>
                              <p className="mt-1 font-display text-xl text-[#0d9488]">{Math.round(influence.paternal)}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <InfoAccordion
                      title="Your child's destiny matrix information"
                      items={childAccordionItems}
                      openId={openChildAccordion}
                      onToggle={(id) => setOpenChildAccordion((prev) => (prev === id ? "" : id))}
                      onUnlock={() => setShowLockedModal(true)}
                    />

                    {faqSeparator()}

                    <InfoAccordion
                      title="Your child's personalized insights"
                      items={childFaqItems}
                      openId={openFaqAccordion}
                      onToggle={(id) => setOpenFaqAccordion((prev) => (prev === id ? "" : id))}
                      onUnlock={() => setShowLockedModal(true)}
                    />

                    <ReportActionBar
                      bundle={{
                        shareTitle: `${childCalculated.child.name} — Child Destiny Matrix`,
                        shareText: `Just discovered my child's destiny matrix — talents, strengths, and natural gifts all revealed. Try it free for your child:`,
                        pdfTitle: `Child Matrix Report - ${childCalculated.child.name}`,
                        lines: childLines,
                        chartNode: () => childRef.current,
                        pngFileName: `child-matrix-${format(new Date(), "yyyy-MM-dd")}.png`,
                        pdfFileName: `child-report-${format(new Date(), "yyyy-MM-dd")}.pdf`,
                      }}
                    />
                  </>
                )}

                {/* Always visible — blog + FAQ */}
                <RelatedBlogSection tab="child" />
                <StaticFaqSection tab="child" />
              </div>
            )}

            {activeTab === "arcana" && (
              <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5 sm:p-8">
                  <h3 className="font-display text-xl text-foreground mb-1">Arcana Energy Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-5">Discover your dominant arcana, shadow energy, spiritual guide, and life path through a unique multi-layer calculation.</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input value={arcanaInput.name} onChange={(e) => setArcanaInput((p) => ({ ...p, name: e.target.value }))} placeholder="Your full name" className="h-12 border-input bg-card text-foreground" />
                    <Input value={arcanaInput.dob} onChange={(e) => setArcanaInput((p) => ({ ...p, dob: maskDobInput(e.target.value) }))} placeholder="DD/MM/YYYY" inputMode="numeric" className="h-12 border-input bg-card text-foreground" />
                    <Button onClick={calculateArcana} disabled={!arcanaReady || isCalculating} className="col-span-1 sm:col-span-2 h-12 rounded-[10px] bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-6 text-base font-semibold text-white hover:from-[#6d28d9] hover:to-[#4338ca]">
                      Calculate Arcana Map
                    </Button>
                  </div>
                </motion.div>

                {arcanaResult && (
                  <>
                    <div ref={arcanaRef} className="rounded-2xl border border-border bg-card p-6">
                      <h3 className="font-display text-2xl text-foreground mb-2">Your Arcana Map</h3>
                      <div className="mt-2 h-1 w-48 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#e11d48]" />
                      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                          { label: "Dominant Arcana", value: arcanaResult.dominant, color: "#7c3aed", desc: "Your core archetypal identity" },
                          { label: "Shadow Energy", value: arcanaResult.shadow, color: "#e11d48", desc: "Hidden patterns to integrate" },
                          { label: "Spirit Guide", value: arcanaResult.guide, color: "#0891b2", desc: "Your guiding archetype" },
                          { label: "Challenge", value: arcanaResult.challenge, color: "#d97706", desc: "Growth edge to master" },
                          { label: "Soul Gift", value: arcanaResult.gift, color: "#059669", desc: "Innate talent to share" },
                          { label: "Life Path", value: arcanaResult.path, color: "#4f46e5", desc: "Direction of your journey" },
                          { label: "Essence", value: arcanaResult.essence, color: "#9333ea", desc: "Your deepest energetic signature" },
                          { label: "Cycle", value: arcanaResult.cycle, color: "#0e7490", desc: "Current evolutionary phase" },
                        ].map((item) => {
                          const interp = getInterpretation(item.value);
                          return (
                            <div key={item.label} className="rounded-xl border border-border bg-background p-4 text-center">
                              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2" style={{ borderColor: item.color, background: `${item.color}15` }}>
                                <span className="font-display text-xl font-bold" style={{ color: item.color }}>{item.value}</span>
                              </div>
                              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-foreground">{item.label}</p>
                              <p className="mt-1 text-xs font-medium" style={{ color: item.color }}>{interp.name}</p>
                              <p className="mt-1 text-[11px] text-muted-foreground">{item.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h3 className="font-display text-xl text-foreground mb-4">Arcana Energy Flow</h3>
                      <div className="flex justify-center">
                        <svg viewBox="0 0 400 200" className="w-full max-w-[500px]">
                          <defs>
                            <linearGradient id="arcFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#7c3aed" />
                              <stop offset="50%" stopColor="#e11d48" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                          <path d="M 40 100 Q 120 30 200 100 Q 280 170 360 100" fill="none" stroke="url(#arcFlow)" strokeWidth="3" strokeLinecap="round" />
                          {[
                            { x: 40, y: 100, v: arcanaResult.dominant, c: "#7c3aed" },
                            { x: 120, y: 50, v: arcanaResult.guide, c: "#0891b2" },
                            { x: 200, y: 100, v: arcanaResult.essence, c: "#9333ea" },
                            { x: 280, y: 150, v: arcanaResult.challenge, c: "#d97706" },
                            { x: 360, y: 100, v: arcanaResult.gift, c: "#059669" },
                          ].map((n, i) => (
                            <g key={i}>
                              <circle cx={n.x} cy={n.y} r="20" fill={`${n.c}20`} stroke={n.c} strokeWidth="2" />
                              <text x={n.x} y={n.y + 5} textAnchor="middle" fill={n.c} style={{ fontSize: 14, fontWeight: 700, fontFamily: "Inter" }}>{n.v}</text>
                            </g>
                          ))}
                        </svg>
                      </div>
                    </div>

                    <ReportActionBar
                      bundle={{
                        shareTitle: `${arcanaInput.name || "My"} Arcana Map`,
                        shareText: `Just discovered my dominant arcana (${arcanaResult.dominant}), shadow energy, and soul gift — the destiny matrix arcana calculator nailed it. Try it free:`,
                        pdfTitle: `Arcana Map - ${arcanaInput.name || "Your Reading"}`,
                        lines: arcanaLines,
                        chartNode: () => arcanaRef.current,
                        pngFileName: `arcana-map-${format(new Date(), "yyyy-MM-dd")}.png`,
                        pdfFileName: `arcana-report-${format(new Date(), "yyyy-MM-dd")}.pdf`,
                      }}
                    />
                  </>
                )}

                {/* Always visible — blog + FAQ */}
                <RelatedBlogSection tab="arcana" />
                <StaticFaqSection tab="arcana" />
              </div>
            )}

            {activeTab === "karmic" && (
              <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5 sm:p-8">
                  <h3 className="font-display text-xl text-foreground mb-1">Karmic Debt Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-5">Uncover karmic debts, soul lessons, ancestral patterns, and the rewards awaiting after resolution.</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input value={karmicInput.name} onChange={(e) => setKarmicInput((p) => ({ ...p, name: e.target.value }))} placeholder="Your full name" className="h-12 border-input bg-card text-foreground" />
                    <Input value={karmicInput.dob} onChange={(e) => setKarmicInput((p) => ({ ...p, dob: maskDobInput(e.target.value) }))} placeholder="DD/MM/YYYY" inputMode="numeric" className="h-12 border-input bg-card text-foreground" />
                    <Button onClick={calculateKarmic} disabled={!karmicReady || isCalculating} className="col-span-1 sm:col-span-2 h-12 rounded-[10px] bg-gradient-to-r from-[#e11d48] to-[#9333ea] px-6 text-base font-semibold text-white hover:from-[#be123c] hover:to-[#7e22ce]">
                      Calculate Karmic Map
                    </Button>
                  </div>
                </motion.div>

                {karmicResult && (
                  <>
                    <div ref={karmicRef} className="rounded-2xl border border-border bg-card p-6">
                      <h3 className="font-display text-2xl text-foreground mb-2">Your Karmic Blueprint</h3>
                      <div className="mt-2 h-1 w-48 rounded-full bg-gradient-to-r from-[#e11d48] to-[#9333ea]" />
                      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {[
                          { label: "Karmic Debt", value: karmicResult.debt, color: "#e11d48", desc: "Unresolved energy from past cycles" },
                          { label: "Soul Lesson", value: karmicResult.lesson, color: "#7c3aed", desc: "The teaching your soul chose" },
                          { label: "Karmic Tail", value: karmicResult.tail, color: "#9333ea", desc: "Ancestral pattern carried forward" },
                          { label: "Release Point", value: karmicResult.release, color: "#0891b2", desc: "Where healing becomes possible" },
                          { label: "Karmic Reward", value: karmicResult.reward, color: "#059669", desc: "Gift unlocked through resolution" },
                          { label: "Anchor Energy", value: karmicResult.anchor, color: "#d97706", desc: "Grounding force in transformation" },
                          { label: "Mirror", value: karmicResult.mirror, color: "#4f46e5", desc: "What others reflect back to you" },
                        ].map((item) => {
                          const interp = getInterpretation(item.value);
                          return (
                            <div key={item.label} className="rounded-xl border border-border bg-background p-4 text-center">
                              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2" style={{ borderColor: item.color, background: `${item.color}15` }}>
                                <span className="font-display text-xl font-bold" style={{ color: item.color }}>{item.value}</span>
                              </div>
                              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-foreground">{item.label}</p>
                              <p className="mt-1 text-xs font-medium" style={{ color: item.color }}>{interp.name}</p>
                              <p className="mt-1 text-[11px] text-muted-foreground">{item.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h3 className="font-display text-xl text-foreground mb-4">Karmic Resolution Path</h3>
                      <div className="flex justify-center">
                        <svg viewBox="0 0 400 240" className="w-full max-w-[500px]">
                          <defs>
                            <linearGradient id="karmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#e11d48" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                          <path d="M 60 200 L 120 140 L 200 160 L 280 80 L 340 40" fill="none" stroke="url(#karmGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 4" />
                          {[
                            { x: 60, y: 200, v: karmicResult.debt, c: "#e11d48", l: "Debt" },
                            { x: 120, y: 140, v: karmicResult.lesson, c: "#7c3aed", l: "Lesson" },
                            { x: 200, y: 160, v: karmicResult.tail, c: "#9333ea", l: "Tail" },
                            { x: 280, y: 80, v: karmicResult.release, c: "#0891b2", l: "Release" },
                            { x: 340, y: 40, v: karmicResult.reward, c: "#059669", l: "Reward" },
                          ].map((n, i) => (
                            <g key={i}>
                              <circle cx={n.x} cy={n.y} r="22" fill={`${n.c}20`} stroke={n.c} strokeWidth="2.5" />
                              <text x={n.x} y={n.y + 5} textAnchor="middle" fill={n.c} style={{ fontSize: 14, fontWeight: 700, fontFamily: "Inter" }}>{n.v}</text>
                              <text x={n.x} y={n.y + 36} textAnchor="middle" fill="#64748b" style={{ fontSize: 9, fontFamily: "Inter" }}>{n.l}</text>
                            </g>
                          ))}
                        </svg>
                      </div>
                    </div>

                    <ReportActionBar
                      bundle={{
                        shareTitle: `${karmicInput.name || "My"} Karmic Blueprint`,
                        shareText: `My karmic tail calculator just revealed my soul lesson, karmic debt, and release point. Eye-opening! Calculate yours:`,
                        pdfTitle: `Karmic Blueprint - ${karmicInput.name || "Your Reading"}`,
                        lines: karmicLines,
                        chartNode: () => karmicRef.current,
                        pngFileName: `karmic-blueprint-${format(new Date(), "yyyy-MM-dd")}.png`,
                        pdfFileName: `karmic-report-${format(new Date(), "yyyy-MM-dd")}.pdf`,
                      }}
                    />
                  </>
                )}

                {/* Always visible — blog + FAQ */}
                <RelatedBlogSection tab="karmic" />
                <StaticFaqSection tab="karmic" />
              </div>
            )}
          </div>
        </section>
      </main>

      {showLockedModal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-2xl text-foreground">Coming soon</h4>
              <button
                type="button"
                onClick={() => setShowLockedModal(false)}
                className="rounded-lg border border-border p-1 text-text-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm text-text-secondary">Coming soon - full readings launching soon.</p>
            <Button onClick={() => setShowLockedModal(false)} className="mt-5 h-10 w-full rounded-lg bg-primary text-white">
              Close
            </Button>
          </div>
        </div>
      ) : null}

      {/* ─── Contextual Testimonials ─── */}
      <section style={{ padding: "40px 0", borderTop: "1px solid #e2e8f0", background: "#f8f9fc" }}>
        <div className="container mx-auto" style={{ padding: "0 16px", maxWidth: "900px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, textAlign: "center", color: "#1e1b4b", marginBottom: "20px" }}>
            What users say about this calculator
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
            {getTestimonialsForTab(activeTab).slice(0, 3).map((t, i) => (
              <div
                key={i}
                className="testimonial-card"
                style={{
                  background: "#fff",
                  padding: "18px",
                  borderRadius: "14px",
                  border: "1px solid #eef2ff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <div style={{ display: "flex", gap: "2px", marginBottom: "8px" }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} style={{ width: "0.75rem", height: "0.75rem", color: "#fbbf24", fill: "#fbbf24" }} />
                  ))}
                </div>
                <p style={{ color: "#1e1b4b", fontSize: "0.82rem", lineHeight: 1.55, fontStyle: "italic", marginBottom: "12px" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>{t.initials}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.78rem", display: "block" }}>{t.name}</span>
                    <span style={{ color: "#64748b", fontSize: "0.68rem" }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

