"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchbarProps {
  onSearch?: (value: string) => void;
  onDifficultyChange?: (difficulty: string) => void;
  onCategoryChange?: (category: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({
  onSearch,
  onDifficultyChange,
  onCategoryChange,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <div className="w-full bg-gradient-to-r from-indigo-800 via-purple-800 to-blue-900 py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4 rounded-t-lg shadow-lg">
      {/* Search Input */}
      <div className="relative w-full md:w-1/2">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
        />
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Search quizzes..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>

      {/* Difficulty Dropdown */}
      <select
        onChange={(e) => onDifficultyChange?.(e.target.value)}
        className="w-full md:w-auto px-3 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="All">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      {/* Category Dropdown */}
      <select
        onChange={(e) => onCategoryChange?.(e.target.value)}
        className="w-full md:w-auto px-3 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="All">All Categories</option>
        <option value="Science">Science</option>
        <option value="Technology">Technology</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Programming">Programming</option>
        <option value="General Knowledge">General Knowledge</option>
      </select>
    </div>
  );
};

export default Searchbar;
