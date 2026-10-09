"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArohaLogo } from "./aroha-logo";

interface NavbarProps {
  userRole?: string | null;
}

export function Navbar({ userRole }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "About", href: "/#about" },
    { label: "Events", href: "/events" },
    { label: "Schedule", href: "/schedule" },
    { label: "Results", href: "/results" },
    { label: "Coordinators", href: "/#coordinates" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 ${
          isScrolled
            ? "py-4 px-6 md:px-14 bg-[#111111]/95 backdrop-blur-md border-b border-[#D4A72C]/30 shadow-2xl"
            : "py-6 px-6 md:px-14 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ArohaLogo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold tracking-[0.14em] uppercase text-[#FFF9EF]/80 hover:text-[#E5BE45] transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E5BE45] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Action Button & Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {userRole ? (
              <Link
                href={
                  userRole === "ADMIN"
                    ? "/admin"
                    : userRole === "EVENT_MANAGER"
                    ? "/manager"
                    : "/dashboard"
                }
                className="inline-flex items-center gap-2 bg-[#1A1512] text-[#E5BE45] border border-[#D4A72C]/40 px-5 py-2.5 rounded text-xs font-bold tracking-[0.12em] uppercase hover:bg-[#E5BE45] hover:text-[#111111] transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs font-semibold tracking-[0.12em] uppercase text-[#FFF9EF]/80 hover:text-[#E5BE45] px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-[#9E1B23] text-[#FFF9EF] px-5 py-2.5 rounded text-xs font-bold tracking-[0.12em] uppercase border border-[#E5BE45]/40 shadow-lg shadow-[#9E1B23]/30 hover:bg-[#C62828] hover:-translate-y-0.5 transition-all"
            >
              Explore Events
              <span>→</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-2xl text-[#FFF9EF] hover:text-[#E5BE45] p-2"
            aria-label="Open navigation menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-400 ${
          mobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute top-0 right-0 w-full max-w-xs h-full bg-[#1A1512] border-l border-[#D4A72C]/30 p-8 flex flex-col justify-between transition-transform duration-400 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#D4A72C]/20 mb-6">
              <ArohaLogo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl text-[#E5BE45] hover:opacity-80"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-xl text-[#FFF9EF] hover:text-[#E5BE45] transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            {userRole ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-[#1E1815] text-[#E5BE45] border border-[#D4A72C]/30 py-3 rounded text-xs font-bold uppercase tracking-wider"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-[#FFF9EF] border border-white/20 py-2.5 rounded text-xs font-bold uppercase tracking-wider"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center bg-[#9E1B23] text-white py-3 rounded text-xs font-bold uppercase tracking-wider border border-[#E5BE45]/30"
            >
              Explore Events →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
