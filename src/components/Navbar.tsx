"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  {
    label: "Calculators",
    path: "/calculator",
    children: [
      { label: "Personal Matrix", path: "/calculator" },
      { label: "Compatibility", path: "/compatibility" },
      { label: "Child Matrix", path: "/child-matrix" },
      { label: "Arcana Calculator", path: "/arcana-calculator" },
      { label: "Karmic Calculator", path: "/karmic-calculator" },
    ],
  },
  {
    label: "Learn",
    path: "/learn",
    children: [
      { label: "What is Destiny Matrix", path: "/learn/what-is-destiny-matrix" },
      { label: "Number Meanings", path: "/learn/number-meanings" },
      { label: "Complete Guide", path: "/learn/guide" },
    ],
  },
  { label: "Blog", path: "/blog" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const pathname = usePathname();
  const currentPath = pathname ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid #e2e8f0",
        padding: "16px 0",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <nav className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          style={{ color: "#4f46e5", fontSize: "1.5rem", fontWeight: 700 }}
          className="font-sans tracking-tight"
        >
          DestinyMatrix
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.path} className="relative">
              {item.children ? (
                <div
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.path)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.path}
                    className="flex items-center gap-1 rounded-sm px-4 py-2 text-base font-medium transition-colors"
                    style={{
                      color: currentPath.startsWith(item.path) ? "#4f46e5" : "#334155",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#4f46e5"; }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = currentPath.startsWith(item.path) ? "#4f46e5" : "#334155";
                    }}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Link>
                  {openDropdown === item.path && (
                    <div
                      className="absolute left-0 top-full pt-1"
                      style={{ zIndex: 200 }}
                    >
                      <div
                        className="w-56 p-1.5"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            className="block rounded px-3 py-2 text-sm transition-colors"
                            style={{ color: "#334155" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = "#4f46e5";
                              (e.currentTarget as HTMLAnchorElement).style.background = "#eef2ff";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = "#334155";
                              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className="block rounded-sm px-4 py-2 text-base font-medium transition-colors"
                  style={{ color: currentPath === item.path ? "#4f46e5" : "#334155" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#4f46e5"; }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = currentPath === item.path ? "#4f46e5" : "#334155";
                  }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* CTA — pill outline button, fills on hover */}
        <div className="hidden lg:block">
          <Link
            href="/calculator"
            className="btn-outline-pill inline-flex items-center px-5 py-2 text-sm font-medium"
            style={{
              borderRadius: "999px",
              border: "1px solid #4f46e5",
              background: "#ffffff",
              color: "#4f46e5",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#4f46e5";
              (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#ffffff";
              (e.currentTarget as HTMLAnchorElement).style.color = "#4f46e5";
            }}
          >
            Free Calculator
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded"
          style={{ color: "#334155" }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden overflow-hidden"
          style={{ borderTop: "1px solid #e2e8f0", background: "#ffffff" }}
        >
          <ul className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded px-4 py-3 text-sm font-medium"
                  style={{ color: currentPath === item.path ? "#4f46e5" : "#334155" }}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <Link
                          href={child.path}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded px-4 py-2 text-sm"
                          style={{ color: "#64748b" }}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="mt-2">
              <Link
                href="/calculator"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-4 py-3 text-sm font-medium"
                style={{
                  borderRadius: "999px",
                  border: "1px solid #4f46e5",
                  background: "#4f46e5",
                  color: "#ffffff",
                }}
              >
                Free Calculator
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
