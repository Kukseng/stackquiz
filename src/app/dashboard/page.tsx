'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import GridCardComponents from '@/components/GridCardComponent';

const DashboardPage = () => {
  const [joinCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Select category');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  // Example challenges data
  const challenges = [
    { id: 1, title: "Math Quiz", difficulty: "Easy" },
    { id: 2, title: "React Basics", difficulty: "Medium" },
    { id: 3, title: "Algorithms", difficulty: "Hard" },
    { id: 4, title: "History Facts", difficulty: "Easy" },
    { id: 5, title: "Computer Science", difficulty: "Medium" },
  ];

  // Filter by difficulty
  const filteredChallenges =
    selectedDifficulty === "All"
      ? challenges
      : challenges.filter((c) => c.difficulty === selectedDifficulty);

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
              className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 focus:outline-none text-base placeholder-gray-500"
              placeholder="Enter a join code"
            />
            <button className="bg-[#f97316] px-6 py-3 rounded-xl font-semibold text-white shadow hover:shadow-lg transition-all duration-200">
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-evenly mb-6">
        <div className="relative w-full md:w-1/2">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={16} className="text-white opacity-70" />
          </span>
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-white rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-auto text-gray-500 px-4 py-2 mt-4 md:mt-0 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Select category</option>
          <option>Math</option>
          <option>Computer</option>
          <option>Science</option>
          <option>History</option>
          <option>English</option>
          <option>Chemistry</option>
          <option>Education</option>
          <option>Other</option>
        </select>
      </div>

      {/* Difficulty Filter */}
      <div className="flex justify-center gap-4 mb-8">
        {["All", "Easy", "Medium", "Hard"].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedDifficulty(level)}
            className={`px-5 py-2 rounded-full font-semibold transition-colors ${
              selectedDifficulty === level
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          Templates
        </h2>
        <GridCardComponents />
        <GridCardComponents />
        <GridCardComponents />
      </div>


    </div>
  );
};

export default DashboardPage;
