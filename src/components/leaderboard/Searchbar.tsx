"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Searchbar() {
  const [focusedInput, setFocusedInput] = useState(false);
  const [activeButton, setActiveButton] = useState("Library"); // default active

  return (
    <div className="flex items-center justify-center gap-4 px-6 py-4">
      {/* Left Buttons */}
      <div className="flex items-center gap-2">
        <Link href="/leaderboard/library">
          <button
            onClick={() => setActiveButton("Library")}
            className={`px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              activeButton === "Library"
                ? "bg-white text-[#1c2a5e] shadow-lg scale-105"
                : "bg-white/80 text-[#1c2a5e]/80 hover:bg-white hover:text-[#1c2a5e]"
            }`}
          >
            Library
          </button>
        </Link>

        <Link href="/leaderboard/explore">
          <button
            onClick={() => setActiveButton("Explore")}
            className={`px-6 py-2.5 rounded-full font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              activeButton === "Explore"
                ? "bg-black text-white shadow-lg scale-105"
                : "bg-black/80 text-white/80 hover:bg-black hover:text-white"
            }`}
          >
            Explore
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div
        className={`relative flex items-center flex-1 max-w-md bg-transparent border rounded-full px-4 py-2 text-white transition-all duration-300 ${
          focusedInput
            ? "border-yellow-300 shadow-lg shadow-yellow-400/20 scale-105"
            : "border-yellow-400 hover:border-yellow-300 hover:shadow-md hover:shadow-yellow-400/10"
        }`}
      >
        <Search
          className={`w-5 h-5 mr-2 transition-all duration-300 ${
            focusedInput ? "text-yellow-300 scale-110" : "text-white/80"
          }`}
        />
        <input
          type="text"
          placeholder="Search library ..."
          onFocus={() => setFocusedInput(true)}
          onBlur={() => setFocusedInput(false)}
          className="bg-transparent outline-none flex-1 placeholder-white/80 text-white transition-all duration-200"
        />
        {focusedInput && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/10 to-yellow-300/10 animate-pulse pointer-events-none"></div>
        )}
      </div>

      {/* Right Button */}
      <Link href="/leaderboard/favorite">
        <button
          onClick={() => setActiveButton("Favorites")}
          className={`px-6 py-2.5 rounded-full font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
            activeButton === "Favorites"
              ? "bg-black text-white shadow-lg scale-105"
              : "bg-black/80 text-white/80 hover:bg-black hover:text-white"
          }`}
        >
          Favorites
        </button>
      </Link>
    </div>
  );
}
