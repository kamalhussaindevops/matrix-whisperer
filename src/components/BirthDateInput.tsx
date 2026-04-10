"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import DateOfBirthSelector from "@/components/DateOfBirthSelector";

interface BirthDateInputProps {
  onGenerate: (date: Date, name?: string, gender?: "M" | "F") => void;
  isLoading?: boolean;
  showName?: boolean;
  showGender?: boolean;
  label?: string;
}

const BirthDateInput = ({
  onGenerate,
  isLoading,
  showName = true,
  showGender = true,
  label,
}: BirthDateInputProps) => {
  const [date, setDate] = useState<Date>();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"M" | "F">("F");

  const handleCalculate = () => {
    if (!date) return;
    onGenerate(date, name || undefined, gender);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      {showName && (
        <input
          type="text"
          placeholder={label || "Your name (optional)"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "14px 16px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            background: "#ffffff",
            color: "#1a1a2e",
            width: "100%",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; }}
        />
      )}

      <DateOfBirthSelector value={date} onChange={setDate} />

      {showGender && (
        <div>
          <div
            style={{
              display: "flex",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setGender("F")}
              style={{
                flex: 1,
                padding: "12px",
                fontSize: "0.9rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s",
                background: gender === "F" ? "#4f46e5" : "#ffffff",
                color: gender === "F" ? "#ffffff" : "#475569",
              }}
            >
              Female
            </button>
            <button
              type="button"
              onClick={() => setGender("M")}
              style={{
                flex: 1,
                padding: "12px",
                fontSize: "0.9rem",
                fontWeight: 600,
                border: "none",
                borderLeft: "1px solid #cbd5e1",
                cursor: "pointer",
                transition: "background-color 0.2s",
                background: gender === "M" ? "#4f46e5" : "#ffffff",
                color: gender === "M" ? "#ffffff" : "#475569",
              }}
            >
              Male
            </button>
          </div>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              textAlign: "center",
              marginTop: "6px",
            }}
          >
            Gender affects certain matrix positions
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleCalculate}
        disabled={!date || isLoading}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "14px 16px",
          width: "100%",
          background: !date || isLoading ? "#94a3b8" : "#4f46e5",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "1rem",
          border: "none",
          borderRadius: "12px",
          cursor: !date || isLoading ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          if (date && !isLoading) {
            (e.currentTarget as HTMLButtonElement).style.background = "#4338ca";
          }
        }}
        onMouseLeave={(e) => {
          if (date && !isLoading) {
            (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5";
          }
        }}
      >
        <Sparkles style={{ width: "1rem", height: "1rem" }} />
        {isLoading ? "Calculating…" : "Calculate My Matrix"}
      </button>
    </div>
  );
};

export default BirthDateInput;
