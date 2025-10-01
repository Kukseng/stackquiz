"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserPlus, Menu, X, Star, Heart } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { language, toggleLanguage } = useLanguage();
  const t = language === "en" ? en : kh;
  const fontClass = language === "en" ? "en-font" : "kh-font";

  const { data: session } = useSession();

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

  // Generate cute avatar for kids
  const getAvatarUrl = () => {
    const nickname = session?.user?.name || session?.user?.email || "user";
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
      nickname
    )}`;
  };

  // Get first name or email prefix for display
  const getDisplayName = () => {
    const fullName = session?.user?.name;
    if (fullName) {
      return fullName.split(" ")[0]; // Get first name only
    }
    const email = session?.user?.email;
    if (email) {
      return email.split("@")[0]; // Get part before @
    }
    return "Player";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 font-bold w-full px-4 py-4 transition-colors duration-300  ${
        scrolled ? "bg-[#1355b4]/70 backdrop-blur-lg" : "bg-gray-screen-page"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-sq.png" width={45} height={45} alt="Logo" />
          <span className="hidden md:inline text-2xl font-extrabold">
            <span className="text-white">STACK</span>
            <span className="text-yellow">QUIZ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={`hidden md:flex items-center gap-8 ${fontClass}`}>
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
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions + Mobile Menu Button */}
        <div className={`flex items-center gap-4 ${fontClass}`}>
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
                <span>ខ្មែរ</span>
              </>
            )}
          </button>

          {/* Cute Profile / Signup */}
          {session ? (
            <Link href="/profile">
              <div className="relative group">
                {/* Desktop version - full cute profile */}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-2xl cursor-pointer hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  {/* Avatar with cute border */}
                  <div className="relative">
                    <Image
                      src={getAvatarUrl()}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full border-3 border-white shadow-md"
                    />
                    {/* Cute sparkle effect */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center animate-pulse">
                      <Star className="w-2.5 h-2.5 text-yellow-600 fill-current" />
                    </div>
                  </div>

                  {/* Name with cute styling */}
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm leading-tight">
                      Hi, {getDisplayName()}! 👋
                    </span>
                    <span className="text-white/80 text-xs font-medium">
                      Ready to play? 🎯
                    </span>
                  </div>

                  {/* Cute heart decoration */}
                  <Heart
                    className="w-4 h-4 text-white/70 fill-current animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>

                {/* Mobile version - compact cute profile */}
                <div className="flex sm:hidden items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full cursor-pointer hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                  <div className="relative">
                    <Image
                      src={getAvatarUrl()}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white shadow-md"
                    />
                    {/* Small sparkle for mobile */}
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-300 rounded-full flex items-center justify-center animate-pulse">
                      <Star className="w-2 h-2 text-yellow-600 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Floating cute elements on hover - desktop only */}
                <div className="hidden sm:block absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-1">
                    <span
                      className="text-lg animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    >
                      ⭐
                    </span>
                    <span
                      className="text-lg animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    >
                      🌟
                    </span>
                    <span
                      className="text-lg animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    >
                      ✨
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/signup">
              <button className="btn-secondary btn-text flex items-center gap-2 px-6 py-2 box-radius font-semibold">
                <UserPlus className="w-4 h-4" />{" "}
                {language === "en" ? (
                  <span>{t.navbar.signup}</span>
                ) : (
                  <span>{t.navbar.signup}</span>
                )}
              </button>
            </Link>
          )}

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
