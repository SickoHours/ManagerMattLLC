"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Spacer for floating nav */}
      <div className="h-24" />

      {/* Floating Navigation */}
      <header className={`nav-floating ${scrolled ? "scrolled" : ""}`}>
        <div className="px-3 py-2 md:px-4">
          <div className="flex items-center gap-2 md:gap-6">
            {/* Logo */}
            <Link
              href="/"
              className="px-3 py-1 text-sm md:text-base font-semibold text-white hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              Manager Matt
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <Link
              href="/estimate"
              className="ml-auto md:ml-4 bg-white text-black px-4 py-1.5 md:px-5 md:py-2 rounded-full text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Get Estimate
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-1 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-24 left-4 right-4 z-50 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl md:hidden">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-base text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-white/10">
              <Link
                href="/sign-in"
                className="block px-4 py-3 text-base text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
