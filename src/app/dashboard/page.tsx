'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import GridCardComponents from '@/components/GridCardComponent';

const DashboardPage = () => {
  const [joinCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Select category');

  // const recentActivities = [
  //   { title: 'Web Design', date: '09.04', progress: 100 },
  //   { title: 'Web Design', date: '10.04', progress: 100 },
  //   { title: 'Web Design', date: '26.04', progress: 100 },
  //   { title: 'Web Design', date: '29.04', progress: 100 },
  // ];

  

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


      {/* Mobile Search */}
      <div className="md:hidden mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="hidden md:flex gap-4 mb-6 sm:mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <select
          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-48"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>Select category</option>
          <option>Mathematics</option>
          <option>Science</option>
          <option>Programming</option>
          <option>English</option>
        </select>
      </div>

      {/* Mobile Category Filter */}
      <div className="md:hidden mb-6">
        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>Select category</option>
          <option>Mathematics</option>
          <option>Science</option>
          <option>Programming</option>
          <option>English</option>
        </select>
      </div>

  
      {/* Sections */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Templates</h2>
        <GridCardComponents />
        <GridCardComponents />
        <GridCardComponents />
      </div>

    </div>
  );
};

export default DashboardPage;
