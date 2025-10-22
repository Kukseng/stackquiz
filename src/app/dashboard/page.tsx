"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import ChallengeGrid from "@/components/GridCardComponent";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";

interface Category {
  id: string;
  name: string;
}

const DashboardPage = () => {
  const [joinCode, setJoinCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const { data: session } = useSession();

  const displayName = session?.user?.name
    ? session.user.name.split(" ")[0]
    : session?.user?.email
    ? session.user.email.split("@")[0]
    : "Player";

  const avatarUrl = session?.user?.name
    ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
        session.user.name
      )}`
    : "/avatar2.svg";

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
  };

  // Check if any filters are active
  const hasActiveFilters = 
    searchTerm !== "" || 
    selectedCategory !== "All" || 
    selectedDifficulty !== "All";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Join Quiz Card */}
        <div className="xl:col-span-2 bg-slate-200 flex justify-center items-center rounded-2xl p-6 sm:p-8">
  <div className="w-full max-w-lg bg-white rounded-2xl flex items-center gap-3 p-2 border-2 border-yellow-300 shadow-xs">
    <input
      type="text"
      value={joinCode}
      onChange={(e) => setJoinCode(e.target.value)}
      placeholder="Enter a join code"
      className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 focus:outline-none text-base placeholder-gray-500 border-none"
    />
    <button
      onClick={() => console.log('Join Code:', joinCode)}
      className="btn-secondary btn-text px-6 py-3 rounded-2xl font-semibold text-white shadow hover:shadow-lg transition-all duration-200"
    >
      Join
    </button>
  </div>
</div>

        {/* Welcome Card */}
        <div className="bg-[#E5D2F9] rounded-2xl p-6 flex items-center gap-2">
          <div>
            <h2 className="text-2xl font-bold">Hello</h2>
            <h3 className="text-lg font-semibold flex items-center gap-1">
              {displayName} <span>👋</span>
            </h3>
          </div>
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={160}
            height={160}
            className="ml-auto rounded-full"
          />
        </div>
      </div>

      {/* Search + Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search quizzes by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 md:w-48 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="All">All Categories</option>
            {isLoading && <option disabled>Loading...</option>}
            {isError && <option disabled>Error loading categories</option>}
            {categories?.map((cat: Category) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="flex-1 md:w-40 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="All">All Levels</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-3 rounded-2xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm("")}
                className="hover:text-blue-900 font-semibold"
                aria-label="Clear search"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory !== "All" && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Category: {categories?.find((c: Category) => c.id === selectedCategory)?.name || selectedCategory}
              <button
                onClick={() => setSelectedCategory("All")}
                className="hover:text-purple-900 font-semibold"
                aria-label="Clear category filter"
              >
                ×
              </button>
            </span>
          )}
          {selectedDifficulty !== "All" && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Difficulty: {selectedDifficulty}
              <button
                onClick={() => setSelectedDifficulty("All")}
                className="hover:text-green-900 font-semibold"
                aria-label="Clear difficulty filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Templates Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          Templates
        </h2>
        
        <ChallengeGrid
          selectedDifficulty={selectedDifficulty}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
};

export default DashboardPage;