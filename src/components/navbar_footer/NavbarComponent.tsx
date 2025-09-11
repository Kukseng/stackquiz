"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserPlus, Menu, X } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useLanguage } from "@/context/LanguageContext";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { language, toggleLanguage } = useLanguage();
  const t = language === "en" ? en : kh;

  const navLinks = [
    { name: t.navbar.home, href: "/" },
    { name: t.navbar.explore, href: "/explore" },
    { name: t.navbar.live, href: "/join-room" },
    { name: t.navbar.about, href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 font-bold w-full px-4 py-4 transition-colors duration-300 ${
        scrolled ? "bg-[#1355b4]/70 backdrop-blur-lg" : "bg-gray-screen-page"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-sq.png" width={45} height={45} alt="Logo" />
          <span className="hidden md:inline text-2xl font-bold">
            <span className="text-white">STACK</span>
            <span className="text-yellow">QUIZ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive
                    ? "text-[#FFCC00]"
                    : "text-white hover:text-[#FFCC00] hover:underline"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg"
          >
            {language === "en" ? (
              <>
                <ReactCountryFlag
                  countryCode="US"
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />{" "}
                EN
              </>
            ) : (
              <>
                <ReactCountryFlag
                  countryCode="KH"
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />{" "}
                ខ្មែរ
              </>
            )}
          </button>

          {/* Signup */}
          <Link href="/signup">
            <button className="btn-secondary btn-text flex items-center gap-2 px-6 py-2 box-radius  font-semibold">
              <UserPlus className="w-4 h-4" /> {t.navbar.signup}
            </button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-gray-screen-page backdrop-blur-lg rounded-sm my-1 px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-lg transition-colors ${
                  isActive
                    ? "text-[#FFCC00]"
                    : "text-white hover:text-[#FFCC00] hover:underline"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
