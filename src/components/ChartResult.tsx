"use client";

import React, { useCallback, useRef, useState } from "react";
import { Share2, Download, FileText } from "lucide-react";
import type { MatrixResult } from "@/lib/matrixCalculations";
import { getInterpretation } from "@/lib/matrixInterpretations";

interface ChartResultProps {
  result: MatrixResult;
  children?: React.ReactNode;
}

function showToast(message: string) {
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

export default function ChartResult({ result, children }: ChartResultProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const dob = result.birthDate
    ? `${result.birthDate.getDate()}/${result.birthDate.getMonth() + 1}/${result.birthDate.getFullYear()}`
    : "unknown";

  const handleShare = useCallback(async () => {
    const shareUrl = window.location.href;
    const shareText = `My Matrix of Destiny Chart — Center: ${result.center}, Purpose: ${result.personalPurpose}, Personal Year: ${result.personalYear}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Matrix of Destiny Chart",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // fallback
      }
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied! Share it anywhere.");
    }
  }, [result]);

  const handleDownloadPNG = useCallback(async () => {
    if (!chartRef.current || downloading) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        imageTimeout: 0,
      });
      const link = document.createElement("a");
      link.download = `destiny-matrix-${dob.replace(/\//g, "-")}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      // Free memory
      canvas.width = 0;
      canvas.height = 0;
    } finally {
      setDownloading(false);
    }
  }, [dob, downloading]);

  const handleDownloadPDF = useCallback(async () => {
    if (!chartRef.current || downloading) return;
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      // PAGE 1 — Cover
      pdf.setFillColor(102, 126, 234);
      pdf.rect(0, 0, pageW, 60, "F");
      pdf.setFillColor(118, 75, 162);
      pdf.rect(0, 55, pageW, 10, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("Matrix of Destiny", pageW / 2, 28, { align: "center" });
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Date of Birth: ${dob}`, pageW / 2, 40, { align: "center" });
      pdf.setFontSize(10);
      pdf.text(
        `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
        pageW / 2,
        50,
        { align: "center" }
      );

      // Capture chart as image
      const canvas = await html2canvas(chartRef.current, { scale: 2, backgroundColor: "#fff", useCORS: true });
      const chartImgData = canvas.toDataURL("image/png", 1.0);
      const chartAspect = canvas.height / canvas.width;
      const chartW = pageW - 40;
      const chartH = chartW * chartAspect;
      pdf.addImage(chartImgData, "PNG", 20, 68, chartW, Math.min(chartH, 100));

      // Key values table
      const tableY = 68 + Math.min(chartH, 100) + 10;
      pdf.setTextColor(30, 27, 75);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Key Energies", 20, tableY);

      const rows: [string, string][] = [
        ["Center Energy", String(result.center)],
        ["Comfort Zone", String(result.comfortZone)],
        ["Life Purpose", String(result.personalPurpose)],
        ["Money Energy", String(result.money)],
        ["Talents", String(result.talents)],
        ["Personal Year", String(result.personalYear)],
        ["Karmic Tasks", String(result.karmicTasks)],
      ];

      let rowY = tableY + 8;
      rows.forEach(([label, value], i) => {
        if (rowY > pageH - 30) {
          pdf.addPage();
          rowY = 20;
        }
        if (i % 2 === 0) {
          pdf.setFillColor(238, 242, 255);
          pdf.rect(20, rowY - 5, pageW - 40, 12, "F");
        }
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(79, 70, 229);
        pdf.text(label, 22, rowY + 2);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(71, 85, 105);
        pdf.text(value, pageW / 2, rowY + 2);
        rowY += 14;
      });

      // PAGE 2 — Arcana descriptions
      pdf.addPage();
      pdf.setFillColor(102, 126, 234);
      pdf.rect(0, 0, pageW, 20, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Arcana Descriptions", pageW / 2, 13, { align: "center" });

      let descY = 30;
      const uniqueNums = result.allNumbers.slice(0, 10);
      uniqueNums.forEach((num) => {
        if (descY > pageH - 40) {
          pdf.addPage();
          descY = 20;
        }
        const interp = getInterpretation(num);
        pdf.setTextColor(30, 27, 75);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${num}. ${interp.name}`, 20, descY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(71, 85, 105);
        pdf.setFontSize(9);
        const desc = interp.lightMeaning || interp.description || "";
        const lines = pdf.splitTextToSize(desc, pageW - 40);
        pdf.text(lines, 20, descY + 6);
        descY += 6 + lines.length * 5 + 8;
      });

      // Footer on every page
      const totalPages = pdf.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, pageH - 14, pageW, 14, "F");
        pdf.setTextColor(148, 163, 184);
        pdf.setFontSize(8);
        pdf.text("destinymatrix.com - Free Destiny Matrix Calculator", 20, pageH - 5);
        pdf.text(`Page ${p} of ${totalPages}`, pageW - 20, pageH - 5, { align: "right" });
      }

      pdf.save(`destiny-matrix-${dob.replace(/\//g, "-")}.pdf`);

      // Free memory
      canvas.width = 0;
      canvas.height = 0;
    } finally {
      setDownloading(false);
    }
  }, [result, dob, downloading]);

  return (
    <div>
      {/* Chart content area — capture target */}
      <div ref={chartRef}>{children}</div>

      {/* Action bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
        className="action-bar"
      >
        <button
          type="button"
          onClick={handleShare}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "14px 24px",
            background: "linear-gradient(135deg,#667eea,#764ba2)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "1rem",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            minHeight: "52px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
        >
          <Share2 style={{ width: "18px", height: "18px" }} />
          Share Chart
        </button>

        <button
          type="button"
          onClick={handleDownloadPNG}
          disabled={downloading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "14px 24px",
            background: "#4f46e5",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "1rem",
            border: "none",
            borderRadius: "12px",
            cursor: downloading ? "not-allowed" : "pointer",
            minHeight: "52px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!downloading) (e.currentTarget as HTMLButtonElement).style.background = "#4338ca";
          }}
          onMouseLeave={(e) => {
            if (!downloading) (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5";
          }}
        >
          <Download style={{ width: "18px", height: "18px" }} />
          Download PNG
        </button>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={downloading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "14px 24px",
            background: "#ffffff",
            color: "#4f46e5",
            fontWeight: 700,
            fontSize: "1rem",
            border: "2px solid #4f46e5",
            borderRadius: "12px",
            cursor: downloading ? "not-allowed" : "pointer",
            minHeight: "52px",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!downloading) {
              (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            }
          }}
          onMouseLeave={(e) => {
            if (!downloading) {
              (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
              (e.currentTarget as HTMLButtonElement).style.color = "#4f46e5";
            }
          }}
        >
          <FileText style={{ width: "18px", height: "18px" }} />
          Download PDF
        </button>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .action-bar {
            flex-direction: row !important;
          }
          .action-bar button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
