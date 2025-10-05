"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Join Quiz Card */}
        <div className="xl:col-span-2 bg-gray-400 flex justify-center items-center rounded-2xl p-6 sm:p-8">
          <div className="w-full max-w-lg bg-white rounded-2xl flex items-center gap-3 p-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter a join code"
              className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 focus:outline-none text-base placeholder-gray-500"
            />
            <button
              onClick={() => console.log("Join Code:", joinCode)}
              className="bg-[#f97316] px-6 py-3 rounded-xl font-semibold text-white shadow hover:shadow-lg transition-all duration-200"
            >
              Join
            </button>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-purple-200 rounded-2xl p-6 flex items-center gap-2">
          <div>
            <h2 className="text-2xl font-bold">Hello</h2>
            <h3 className="text-lg font-semibold flex items-center gap-1">
              Evano <span>👋</span>
            </h3>
          </div>
          <Image
            src="/avatar2.svg"
            alt="Avatar"
            width={160}
            height={160}
            className="ml-auto"
          />
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* Search */}
        <div className="relative w-full md:w-1/2">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/3 px-4 py-3 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
      </div>

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