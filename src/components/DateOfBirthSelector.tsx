"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const years = Array.from({ length: 2025 - 1900 + 1 }, (_, index) => 2025 - index);

const selectStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "12px",
  fontSize: "1rem",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#1a1a2e",
  width: "100%",
  appearance: "auto" as "auto",
  cursor: "pointer",
  outline: "none",
};

interface DateOfBirthSelectorProps {
  label?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function DateOfBirthSelector({
  label = "Date of Birth",
  value,
  onChange,
}: DateOfBirthSelectorProps) {
  const [day, setDay] = useState<number | undefined>(value?.getDate());
  const [month, setMonth] = useState<number | undefined>(value?.getMonth());
  const [year, setYear] = useState<number | undefined>(value?.getFullYear());

  useEffect(() => {
    setDay(value?.getDate());
    setMonth(value?.getMonth());
    setYear(value?.getFullYear());
  }, [value]);

  const maxDays = useMemo(() => {
    const selectedMonth = month ?? 0;
    const selectedYear = year ?? 2000;
    return daysInMonth(selectedMonth, selectedYear);
  }, [month, year]);

  const emitDate = (nextDay?: number, nextMonth?: number, nextYear?: number) => {
    if (nextDay === undefined || nextMonth === undefined || nextYear === undefined) {
      onChange(undefined);
      return;
    }
    const clampedDay = Math.min(nextDay, daysInMonth(nextMonth, nextYear));
    const nextDate = new Date(nextYear, nextMonth, clampedDay);
    if (nextDate > new Date()) {
      onChange(undefined);
      return;
    }
    onChange(nextDate);
  };

  const handleDayChange = (raw: string) => {
    const nextDay = raw ? Number(raw) : undefined;
    setDay(nextDay);
    emitDate(nextDay, month, year);
  };

  const handleMonthChange = (raw: string) => {
    const nextMonth = raw ? Number(raw) : undefined;
    setMonth(nextMonth);
    if (day && nextMonth !== undefined && year) {
      const adjustedDay = Math.min(day, daysInMonth(nextMonth, year));
      if (adjustedDay !== day) setDay(adjustedDay);
      emitDate(adjustedDay, nextMonth, year);
      return;
    }
    emitDate(day, nextMonth, year);
  };

  const handleYearChange = (raw: string) => {
    const nextYear = raw ? Number(raw) : undefined;
    setYear(nextYear);
    if (day && month !== undefined && nextYear) {
      const adjustedDay = Math.min(day, daysInMonth(month, nextYear));
      if (adjustedDay !== day) setDay(adjustedDay);
      emitDate(adjustedDay, month, nextYear);
      return;
    }
    emitDate(day, month, nextYear);
  };

  return (
    <div>
      <p
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#334155",
          marginBottom: "10px",
        }}
      >
        {label}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1.2fr", gap: "8px" }}>
        {/* Day */}
        <select
          value={day ?? ""}
          onChange={(e) => handleDayChange(e.target.value)}
          style={selectStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; }}
        >
          <option value="">Day</option>
          {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Month */}
        <select
          value={month ?? ""}
          onChange={(e) => handleMonthChange(e.target.value)}
          style={selectStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; }}
        >
          <option value="">Month</option>
          {monthNames.map((name, idx) => (
            <option key={name} value={idx}>{name}</option>
          ))}
        </select>

        {/* Year */}
        <select
          value={year ?? ""}
          onChange={(e) => handleYearChange(e.target.value)}
          style={selectStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; }}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {value && (
        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "6px" }}>
          Selected: {format(value, "MMMM d, yyyy")}
        </p>
      )}
    </div>
  );
}
