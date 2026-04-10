"use client";

import * as React from "react";
import { MatrixResult, reduceToArcana } from "@/lib/matrixCalculations";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface MatrixVisualizationProps {
  result: MatrixResult;
  size?: "normal" | "large" | "compact";
  svgRef?: React.Ref<SVGSVGElement>;
  showAges?: boolean;
  showIntermediateAges?: boolean;
  showPurposeBar?: boolean;
}

type Point = { x: number; y: number };

function interpolate(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

const MatrixVisualization = ({
  result,
  size = "normal",
  svgRef,
  showAges = true,
  showIntermediateAges = true,
  showPurposeBar = true,
}: MatrixVisualizationProps) => {
  const isMobile = useIsMobile();

  // On mobile: tighter viewBox, bigger radius relative to canvas = bigger nodes
  const sizeScale = isMobile ? 1.15 : size === "large" ? 1 : size === "compact" ? 0.78 : 0.9;
  const vw = isMobile ? 460 : size === "large" ? 760 : size === "compact" ? 500 : 620;
  const vh = isMobile ? 480 : size === "large" ? 720 : size === "compact" ? 510 : 590;

  const cx = vw / 2;
  const cy = isMobile ? vh * 0.42 : vh * 0.44;
  const outerR = isMobile ? 185 : 215 * sizeScale;

  const polar = (angleDeg: number, r: number) => {
    const angle = (Math.PI / 180) * angleDeg;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const oct = {
    top: polar(-90, outerR),
    topRight: polar(-45, outerR),
    right: polar(0, outerR),
    bottomRight: polar(45, outerR),
    bottom: polar(90, outerR),
    bottomLeft: polar(135, outerR),
    left: polar(180, outerR),
    topLeft: polar(-135, outerR),
  };

  const octPoints = [oct.top, oct.topRight, oct.right, oct.bottomRight, oct.bottom, oct.bottomLeft, oct.left, oct.topLeft]
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  const diag = {
    topLeft: interpolate({ x: cx, y: cy }, oct.topLeft, 0.56),
    topRight: interpolate({ x: cx, y: cy }, oct.topRight, 0.56),
    bottomLeft: interpolate({ x: cx, y: cy }, oct.bottomLeft, 0.56),
    bottomRight: interpolate({ x: cx, y: cy }, oct.bottomRight, 0.56),
  };

  const rowY = cy;
  const row = {
    farLeft: { x: cx - outerR * 0.98, y: rowY },
    l1: { x: cx - outerR * 0.62, y: rowY },
    l2: { x: cx - outerR * 0.42, y: rowY },
    l3: { x: cx - outerR * 0.24, y: rowY },
    center: { x: cx, y: rowY },
    r3: { x: cx + outerR * 0.24, y: rowY },
    r2: { x: cx + outerR * 0.42, y: rowY },
    r1: { x: cx + outerR * 0.62, y: rowY },
    farRight: { x: cx + outerR * 0.98, y: rowY },
  };

  const bottomNodes = {
    left: { x: cx - outerR * 0.23, y: cy + outerR * 0.57 },
    birth: { x: cx, y: cy + outerR * 0.61 },
    right: { x: cx + outerR * 0.23, y: cy + outerR * 0.57 },
  };

  const ageMarkers = [
    { age: 0, p: oct.left, dx: -28, dy: 5 },
    { age: 10, p: oct.topLeft, dx: -24, dy: -10 },
    { age: 20, p: oct.top, dx: -20, dy: -18 },
    { age: 30, p: oct.topRight, dx: 8, dy: -10 },
    { age: 40, p: oct.right, dx: 10, dy: 5 },
    { age: 50, p: oct.bottomRight, dx: 8, dy: 22 },
    { age: 60, p: oct.bottom, dx: -20, dy: 28 },
    { age: 70, p: oct.bottomLeft, dx: -40, dy: 22 },
  ];

  const edgePoints = [oct.left, oct.topLeft, oct.top, oct.topRight, oct.right, oct.bottomRight, oct.bottom, oct.bottomLeft];

  const intermediateAgeLabels: Array<{ label: number; point: Point }> = [];
  if (showAges && showIntermediateAges && !isMobile) {
    for (let segment = 0; segment < edgePoints.length; segment++) {
      const a = edgePoints[segment];
      const b = edgePoints[(segment + 1) % edgePoints.length];
      const segmentStartAge = segment * 10;

      for (let step = 1; step <= 9; step++) {
        const age = segmentStartAge + step;
        const base = interpolate(a, b, step / 10);
        const normalX = base.x - cx;
        const normalY = base.y - cy;
        const len = Math.max(1, Math.sqrt(normalX * normalX + normalY * normalY));
        const outsideOffset = 17 * sizeScale;

        intermediateAgeLabels.push({
          label: age,
          point: {
            x: base.x + (normalX / len) * outsideOffset,
            y: base.y + (normalY / len) * outsideOffset,
          },
        });
      }
    }
  }

  const mobileScale = isMobile ? 1.25 : 1;

  const node = (
    key: string,
    point: Point,
    value: number,
    diameter: number,
    fillColor: string,
    borderColor: string,
    textColor: string,
    delay: number,
    label?: string,
  ) => {
    const d = diameter * mobileScale;
    const r = d / 2;
    const font = Math.max(13, Math.round(d * 0.38));

    return (
      <motion.g
        key={key}
        initial={{ opacity: 0, scale: 0.42 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ delay, duration: 0.28 }}
      >
        <motion.circle
          cx={point.x}
          cy={point.y}
          r={r}
          fill={fillColor}
          stroke={borderColor}
          strokeOpacity={1}
          strokeWidth={2.5}
          style={{ filter: `drop-shadow(0 2px 6px rgba(0,0,0,0.2)) drop-shadow(0 0 10px ${borderColor})` }}
          whileHover={{ filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.3)) drop-shadow(0 0 16px ${borderColor})` }}
        />
        <text
          x={point.x}
          y={point.y + font * 0.15}
          textAnchor="middle"
          fill={textColor}
          style={{ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: font }}
        >
          {value}
        </text>
        {label && !isMobile ? (
          <text
            x={point.x}
            y={point.y + r + 15}
            textAnchor="middle"
            fill="var(--muted-foreground)"
            style={{ fontFamily: "Inter, sans-serif", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}
          >
            {label}
          </text>
        ) : null}
      </motion.g>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-section p-1.5 md:p-5">
        <div className="overflow-hidden rounded-xl border border-border bg-page p-1 md:p-3">
          <div className="flex justify-center">
            <svg ref={svgRef} viewBox={`0 0 ${vw} ${vh}`} className={`w-full ${size === "large" ? "md:max-w-[680px]" : size === "compact" ? "md:max-w-[420px]" : "md:max-w-[560px]"}`}>
              <rect x="0" y="0" width={vw} height={vh} fill="var(--background)" />

              <polygon
                points={octPoints}
                fill="none"
                stroke="rgba(124,58,237,0.55)"
                strokeOpacity={1}
                strokeWidth={2}
                strokeDasharray="6 7"
              />

              <polygon
                points={`${oct.top.x},${oct.top.y} ${oct.right.x},${oct.right.y} ${oct.bottom.x},${oct.bottom.y} ${oct.left.x},${oct.left.y}`}
                fill="none"
                stroke="rgba(124,58,237,0.5)"
                strokeOpacity={1}
                strokeWidth={2}
              />

              {[oct.top, oct.right, oct.bottom, oct.left].map((p, index) => (
                <line
                  key={`star-${index}`}
                  x1={cx}
                  y1={cy}
                  x2={p.x}
                  y2={p.y}
                  stroke="rgba(124,58,237,0.45)"
                  strokeOpacity={1}
                  strokeWidth={2.2}
                />
              ))}

              <line
                x1={oct.topLeft.x}
                y1={oct.topLeft.y}
                x2={oct.bottomRight.x}
                y2={oct.bottomRight.y}
                stroke="rgba(59,130,246,0.75)"
                strokeOpacity={1}
                strokeWidth={2.5}
                strokeDasharray="8 7"
              />
              <line
                x1={oct.topRight.x}
                y1={oct.topRight.y}
                x2={oct.bottomLeft.x}
                y2={oct.bottomLeft.y}
                stroke="rgba(236,72,153,0.75)"
                strokeOpacity={1}
                strokeWidth={2.5}
                strokeDasharray="8 7"
              />

              {!isMobile && (
                <>
                  <text
                    x={cx - outerR * 0.58}
                    y={cy - outerR * 0.05}
                    transform={`rotate(-42 ${cx - outerR * 0.58} ${cy - outerR * 0.05})`}
                    fill="#3b82f6"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: 11 }}
                  >
                    Male generation line
                  </text>
                  <text
                    x={cx + outerR * 0.3}
                    y={cy - outerR * 0.07}
                    transform={`rotate(42 ${cx + outerR * 0.3} ${cy - outerR * 0.07})`}
                    fill="#ec4899"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: 11 }}
                  >
                    Female generation line
                  </text>
                </>
              )}

              {showAges && !isMobile
                ? ageMarkers.map((entry) => (
                    <text
                      key={`age-${entry.age}`}
                      x={entry.p.x + entry.dx}
                      y={entry.p.y + entry.dy}
                      fill="#6b4fa0"
                      style={{ fontFamily: "Inter, sans-serif", fontSize: 11 }}
                    >
                      {entry.age} years
                    </text>
                  ))
                : null}

              {showAges && !isMobile
                ? intermediateAgeLabels.map((entry, index) => (
                    <text
                      key={`arc-${index}`}
                      x={entry.point.x}
                      y={entry.point.y}
                      fill="#6b4fa0"
                      style={{ fontFamily: "Inter, sans-serif", fontSize: 10 }}
                    >
                      {entry.label}
                    </text>
                  ))
                : null}

              {node("day", oct.top, result.A, 62, "#2d1060", "#7c3aed", "#ddd6fe", 0.15, "DAY")}
              {node("month", oct.right, result.B, 62, "#3d0a0a", "#dc2626", "#fca5a5", 0.18, "MONTH")}
              {node("year", oct.bottom, result.C, 62, "#3d0a0a", "#dc2626", "#fca5a5", 0.21, "YEAR")}
              {node("sum", oct.left, result.D, 62, "#2d1060", "#7c3aed", "#ddd6fe", 0.24, "SUM")}

              {node("diag-tl", diag.topLeft, result.E, 40, "#0f1a50", "#3b82f6", "#bfdbfe", 0.28)}
              {node("diag-tr", diag.topRight, result.F, 40, "#0f1a50", "#3b82f6", "#bfdbfe", 0.31)}
              {node("diag-bl", diag.bottomLeft, result.G, 40, "#0a2030", "#0e7490", "#67e8f9", 0.34)}
              {node("diag-br", diag.bottomRight, result.H, 40, "#0a2030", "#0e7490", "#67e8f9", 0.37)}

              {node("row-fl", row.farLeft, result.D, 58, "#2d1060", "#7c3aed", "#ddd6fe", 0.4)}
              {node("row-l1", row.l1, result.E, 44, "#0f1a50", "#3b82f6", "#bfdbfe", 0.43)}
              {node("row-l2", row.l2, result.soulComfort, 38, "#0a2030", "#0e7490", "#67e8f9", 0.46)}
              {node("row-l3", row.l3, result.parentsRelation, 34, "#0a2030", "#0e7490", "#67e8f9", 0.49)}
              {node("row-c", row.center, result.center, 70, "#2a1800", "#b45309", "#fde68a", 0.52)}
              {node("row-r3", row.r3, result.firstImpression, 34, "#0a2030", "#0e7490", "#67e8f9", 0.55)}
              {node("row-r2", row.r2, reduceToArcana(result.relationship + result.money), 34, "#2a1800", "#b45309", "#fde68a", 0.58)}
              {node("row-r1", row.r1, result.money, 38, "#2a1800", "#b45309", "#fde68a", 0.61)}
              {node("row-fr", row.farRight, result.B, 58, "#3d0a0a", "#dc2626", "#fca5a5", 0.64)}

              {node("btm-l", bottomNodes.left, reduceToArcana(result.G + result.center), 32, "#2a1800", "#b45309", "#fde68a", 0.67)}
              {node("btm-birth", bottomNodes.birth, reduceToArcana(result.day + result.month), 36, "#2a1800", "#b45309", "#fde68a", 0.7, "Birth")}
              {node("btm-r", bottomNodes.right, reduceToArcana(result.H + result.center), 32, "#2a1800", "#b45309", "#fde68a", 0.73)}

              {!isMobile && <text
                x={cx + outerR * 0.42}
                y={cy + 8}
                fill="#16a34a"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20 }}
              >
                $
              </text>}
              {!isMobile && <text
                x={cx + 5}
                y={cy + outerR * 0.34}
                fill="#dc2626"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20 }}
              >
                ♥
              </text>}
            </svg>
          </div>
        </div>
      </div>

      {showPurposeBar ? (
        <div className="rounded-full border border-border bg-section px-3 py-3">
          <div className="grid grid-cols-3 divide-x divide-border text-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">Sky Purpose</p>
              <p className="font-display text-xl text-[#06b6d4]">{result.skyPurpose}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">Life Purpose</p>
              <p className="font-display text-[28px] font-bold text-[#f59e0b]">{result.personalPurpose}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">Earth Purpose</p>
              <p className="font-display text-xl text-[#06b6d4]">{result.earthPurpose}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MatrixVisualization;
