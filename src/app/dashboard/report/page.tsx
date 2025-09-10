"use client";
import React from "react";
import {
  Search,
  Trash2,
  MoreVertical,
  Calendar,
  Users,
  Filter,
} from "lucide-react";
import Image from "next/image";

const ReportsDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
              All Reports
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Manage and analyze your assessment reports
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm sm:text-base">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm text-sm sm:text-base">
              <Trash2 className="w-4 h-4" />
              Trash
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                Sort by:
              </span>
              <select className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base">
                <option>Name (A-Z)</option>
                <option>Name (Z-A)</option>
                <option>Date (Newest)</option>
                <option>Date (Oldest)</option>
                <option>Accuracy (High)</option>
                <option>Accuracy (Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table / Card List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Table Header (hidden on mobile) */}
          <div className="hidden md:block bg-slate-50 border-b border-slate-200 px-6 py-4">
            <div className="grid grid-cols-12 items-center gap-4 text-sm font-semibold text-slate-700">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="col-span-4">Activity Name</div>
              <div className="col-span-2">Date Hosted</div>
              <div className="col-span-2">Participants</div>
              <div className="col-span-2">Accuracy</div>
              <div className="col-span-1">Action</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((id) => (
              <div
                key={id}
                className="px-4 sm:px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                  {/* Checkbox */}
                  <div className="md:col-span-1">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Activity Name */}
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg overflow-hidden">
                        <Image
                          src="https://i.ytimg.com/vi/5iTOphGnCtg/hq720.jpg"
                          alt="Icon"
                          width={80}
                          height={60}
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                          Web design
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                          Assessment
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Date Hosted */}
                  <div className="md:col-span-2 flex items-center gap-2 text-slate-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>15 Aug</span>
                  </div>

                  {/* Participants */}
                  <div className="md:col-span-2 flex items-center gap-2 text-slate-600 text-sm">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">21</span>
                  </div>

                  {/* Accuracy */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 text-amber-600 bg-amber-50 border-amber-200">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] sm:text-xs font-bold">
                            75%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="md:col-span-1">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Mobile Labels */}
                <div className="mt-3 md:hidden space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Date Hosted:</span>
                    <span>15 Aug</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span>21</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span>75%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
