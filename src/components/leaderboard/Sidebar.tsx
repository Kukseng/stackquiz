"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, RotateCcw, Trophy, BarChart3, MessageSquare, Menu } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          title="Open sidebar menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full   p-6 transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700/50">
          <Link
            href="/leaderboard/library"
            className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105 mb-4"
          >
            <Search className="w-6 h-6" />
            Find a new Quiz
          </Link>

          <Link
            href="/leaderboard/playagain"
            className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105"
          >
            <RotateCcw className="w-6 h-6" />
            Play again
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <Link
            href="/leaderboard/poduim"
            className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105 mb-4"
          >
            <Trophy className="w-6 h-6" />
            Podium
          </Link>

          <Link
            href="/leaderboard/summary"
            className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105 mb-4"
          >
            <BarChart3 className="w-6 h-6" />
            Session summary
          </Link>

          <Link
            href="/leaderboard/feedback"
            className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105"
          >
            <MessageSquare className="w-6 h-6" />
            Get Feedback
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
