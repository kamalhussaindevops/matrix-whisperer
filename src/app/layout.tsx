import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/index.css";
import Providers from "./providers";
import PageLoader from "@/components/PageLoader";
import { buildMetadata } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4f46e5",
};

export const metadata: Metadata = buildMetadata({
  title: "Destiny Matrix Calculator — Free Life Purpose & Numerology | DestinyMatrix",
  description:
    "Free destiny matrix numerology calculator for life purpose, compatibility, child matrix insights, and year forecast with detailed 22-archetype interpretations.",
  keywords: [
    "destiny matrix",
    "matrix of destiny calculator",
    "free numerology calculator",
    "love line numerology",
    "money line destiny matrix",
    "karmic tail numerology",
    "compatibility destiny matrix",
    "22 archetypes numerology",
  ],
  path: "/",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Netlify Identity — required for Decap CMS admin login redirect */}
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js" async />
      </head>
      <body className={inter.className}>
        <Providers>
          <PageLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
