'use client'

import { useState } from 'react'
import { Search, MoreHorizontal, Filter, Plus, Grid, List, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface DataItem {
  id: string
  title: string
  plays: number
  category: string
  level: string
  visibility: string
  lastModified: string
  thumbnail: string
}

interface TabItem {
  id: string
  label: string
  count?: number
}

const DataTable = () => {
  const [activeTab, setActiveTab] = useState('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const data: DataItem[] = [
    {
      id: '1',
      title: 'Web Design Fundamentals',
      plays: 1247,
      category: 'Design',
      level: 'Medium',
      visibility: 'Public',
      lastModified: '2 hours ago',
      thumbnail: 'https://conmigomedia.com/wp-content/uploads/2024/09/How-to-Become-a-Web-Designer.png'
    },
    {
      id: '2',
      title: 'Java Programming Mastery',
      plays: 892,
      category: 'Programming',
      level: 'Hard',
      visibility: 'Private',
      lastModified: '1 day ago',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdCl4zZrcB7kwwZWw7pPXlT2QoFj43IzPcXA&s'
    },
    {
      id: '3',
      title: 'Next.js for Beginners',
      plays: 2156,
      category: 'Web Development',
      level: 'Easy',
      visibility: 'Public',
      lastModified: '3 days ago',
      thumbnail: 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230202143636/NEXT-js-tutorial-1.png'
    }
  ]

  const tabs: TabItem[] = [
    { id: 'recent', label: 'Recent', count: 12 },
    { id: 'draft', label: 'Draft', count: 3 },
    { id: 'favorites', label: 'Favorites', count: 8 }
  ]

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map(item => item.id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border border-amber-200'
      case 'advanced':
        return 'bg-red-50 text-red-700 border border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getVisibilityBadge = (visibility: string) => {
    return visibility === 'Public' 
      ? 'bg-blue-50 text-blue-700 border border-blue-200'
      : 'bg-gray-50 text-gray-700 border border-gray-200'
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Section - Tabs */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeTab === tab.id 
                        ? 'bg-blue-500 text-blue-100' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <div className="flex bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>

            
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div key={item.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                {/* Card Header */}
                <div className="relative">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="h-5 w-5 rounded-lg border-2 border-white bg-white/80 backdrop-blur-sm text-blue-600 focus:ring-blue-500 shadow-lg"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white transition-colors shadow-lg">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {item.plays.toLocaleString()} plays
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(item.level)}`}>
                      {item.level}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVisibilityBadge(item.visibility)}`}>
                      {item.visibility}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{item.category}</span>
                    <span>{item.lastModified}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Visibility
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className={`group hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.plays.toLocaleString()} plays
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {item.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(item.level)}`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getVisibilityBadge(item.visibility)}`}>
                        {item.visibility}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {item.lastModified}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Select all ({filteredData.length})
                </span>
              </label>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredData.map((item) => (
                <div key={item.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                    />

                    <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">
                          {item.title}
                        </h3>
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 mb-3">
                        {item.plays.toLocaleString()} plays • {item.category}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(item.level)}`}>
                          {item.level}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getVisibilityBadge(item.visibility)}`}>
                          {item.visibility}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500">
                        Modified {item.lastModified}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Enhanced Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-16 px-6">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
  We couldn&apos;t find any courses matching your search criteria. Try adjusting your filters or search terms.
</p>

          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Create New Course
          </button>
        </div>
      )}
    </div>
  )
}

export default DataTable