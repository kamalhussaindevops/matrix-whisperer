"use client";

import { ChakraRow } from "@/lib/matrixCalculations";
import { motion } from "framer-motion";

interface HealthChartProps {
  healthChart: ChakraRow[];
  title?: string;
  accentTitleColor?: string;
}

const chakraColors = ["#a78bfa", "#60a5fa", "#2dd4bf", "#4ade80", "#fbbf24", "#fb923c", "#f87171"];

const HealthChart = ({ healthChart, title = "Health chart", accentTitleColor = "#c4b5fd" }: HealthChartProps) => {
  const totals = {
    physics: healthChart.reduce((sum, row) => sum + row.physics, 0),
    energy: healthChart.reduce((sum, row) => sum + row.energy, 0),
    emotions: healthChart.reduce((sum, row) => sum + row.emotions, 0),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-display text-2xl" style={{ color: accentTitleColor }}>{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr>
              <th className="bg-section px-4 py-2 text-left text-xs uppercase tracking-[0.14em] text-text-muted">Name of chakra</th>
              <th className="bg-section px-4 py-2 text-center text-xs uppercase tracking-[0.14em] text-text-muted">Physics</th>
              <th className="bg-section px-4 py-2 text-center text-xs uppercase tracking-[0.14em] text-text-muted">Energy</th>
              <th className="bg-section px-4 py-2 text-center text-xs uppercase tracking-[0.14em] text-text-muted">Emotions</th>
            </tr>
          </thead>
          <tbody>
            {healthChart.map((row, index) => {
              const chakraColor = chakraColors[index % chakraColors.length];
              return (
                <tr key={`${row.name}-${index}`} className={`${index % 2 === 0 ? "bg-[#1e1242]" : "bg-card"}`}>
                  <td className="rounded-l-lg border border-border px-4 py-3">
                    <p className="font-medium" style={{ color: chakraColor }}>{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.sanskrit}</p>
                  </td>
                  <td className="border border-border px-4 py-3 text-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border text-base text-text-primary" style={{ borderColor: chakraColor, background: "var(--background)" }}>
                      {row.physics}
                    </span>
                  </td>
                  <td className="border border-border px-4 py-3 text-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border text-base text-text-primary" style={{ borderColor: chakraColor, background: "var(--background)" }}>
                      {row.energy}
                    </span>
                  </td>
                  <td className="rounded-r-lg border border-border px-4 py-3 text-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border text-base text-text-primary" style={{ borderColor: chakraColor, background: "var(--background)" }}>
                      {row.emotions}
                    </span>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-[#2d1060]">
              <td className="rounded-l-lg border border-border px-4 py-3 font-semibold text-[#f43f5e]">Result</td>
              <td className="border border-border px-4 py-3 text-center font-semibold text-[#f43f5e]">{totals.physics}</td>
              <td className="border border-border px-4 py-3 text-center font-semibold text-[#f43f5e]">{totals.energy}</td>
              <td className="rounded-r-lg border border-border px-4 py-3 text-center font-semibold text-[#f43f5e]">{totals.emotions}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default HealthChart;
