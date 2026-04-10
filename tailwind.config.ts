import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans:    ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // ─── shadcn/ui tokens (must stay as CSS vars) ───
        border:     "var(--border)",
        input:      "var(--input)",
        ring:       "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT:    "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT:    "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT:    "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT:    "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT:    "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT:    "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT:              "var(--sidebar-background)",
          foreground:           "var(--sidebar-foreground)",
          primary:              "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent:               "var(--sidebar-accent)",
          "accent-foreground":  "var(--sidebar-accent-foreground)",
          border:               "var(--sidebar-border)",
          ring:                 "var(--sidebar-ring)",
        },
        // ─── Design token aliases ───
        "brand-primary":   "var(--brand-primary)",
        "brand-hover":     "var(--brand-hover)",
        "brand-deep":      "var(--brand-deep)",
        "brand-tint":      "var(--brand-tint)",
        "brand-wash":      "var(--brand-wash)",
        "page-bg":         "var(--color-page-bg)",
        "card-bg":         "var(--color-card-bg)",
        "testimonial-bg":  "var(--color-testimonial-bg)",
        "footer-bg":       "var(--color-footer-bg)",
        "text-heading":    "var(--color-text-heading)",
        "section-title":   "var(--color-text-section-title)",
        "text-nav":        "var(--color-text-nav)",
        "text-muted":      "var(--color-text-muted)",
        "text-subtle":     "var(--color-text-subtle)",
        "footer-body":     "var(--color-text-footer-body)",
        "footer-link":     "var(--color-text-footer-link)",
        "footer-head":     "var(--color-text-footer-head)",
        "card-border":     "var(--color-border-card)",
        "faq-border":      "var(--color-border-faq)",
        "footer-divider":  "var(--color-footer-divider)",
        "star":            "var(--color-star)",
        // legacy aliases (used in non-home views, keep for compat)
        "text-primary":   "var(--primary)",
        "text-secondary": "var(--secondary-foreground)",
        "text-body":      "var(--foreground)",
        page:             "var(--color-page-bg)",
        section:          "var(--muted)",
        elevated:         "var(--accent)",
        "purple-hover":   "var(--brand-hover)",
        "purple-dark":    "var(--brand-deep)",
        gold:             "#b45309",
        "gold-light":     "#f59e0b",
        teal:             "#0e7490",
        "teal-light":     "#06b6d4",
        "red-dark":       "#7f1d1d",
        green:            "#059669",
        "green-dark":     "#14532d",
      },
      borderRadius: {
        // Spec-exact radius tokens (new — used via inline styles in components)
        pill: "var(--radius-pill)",   // 999px — badges, outline buttons
        "2xl": "var(--radius-xl)",    // 32px  — hero, testimonial wrapper
        // shadcn-compatible values (kept for existing component library)
        lg:   "var(--radius)",        // 12px  — shadcn default (cards, dialogs)
        md:   "calc(var(--radius) - 2px)", // ~10px — shadcn md
        sm:   "calc(var(--radius) - 4px)", // ~8px  — shadcn sm
        DEFAULT: "var(--radius)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in-up":     "fade-in-up 0.4s ease-out forwards",
        "pulse-glow":     "pulse-glow 3s ease-in-out infinite",
        float:            "float 4s ease-in-out infinite",
        "spin-slow":      "spin-slow 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
