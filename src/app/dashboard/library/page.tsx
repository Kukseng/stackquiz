'use client'

import { useState, useEffect } from 'react'
import { Search, MoreHorizontal, Filter, Plus, Grid, List, ChevronDown, Heart, Edit, Trash2, Eye } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useFavorites } from '@/components/hooks/useFavorites'

interface Category {
  id: string
  name: string
}

interface Quiz {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
  status: 'DRAFT' | 'PUBLISHED'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  createdAt: string
  updatedAt: string
  playCount?: number
  isFavorite?: boolean
  categories?: Category[]
}

interface TabItem {
  id: 'recent' | 'draft' | 'favorites'
  label: string
  count?: number
}

const DataTable = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { favoriteIds, toggleFavorite, isLoading: favoritesLoading } = useFavorites()
  const [activeTab, setActiveTab] = useState<'recent' | 'draft' | 'favorites'>('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<{ id: string; title: string } | null>(null)

  const isAuthed = status === "authenticated" && !!(session as any)?.apiAccessToken

  // Fetch quizzes
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'loading') return

      if (!isAuthed) {
        setIsLoading(false)
        setError('Please sign in to view your quizzes')
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const token = (session as any)?.apiAccessToken
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stackquiz-api.stackquiz.me/api/v1'

        // Fetch quizzes
        let response = await fetch(`${apiUrl}/quizzes/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        })

        // Fallback endpoints for quizzes
        if (!response.ok) {
          response = await fetch(`${apiUrl}/quizzes?userId=me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            cache: 'no-store'
          })

          if (!response.ok) {
            response = await fetch(`${apiUrl}/users/me/quizzes`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              cache: 'no-store'
            })
          }
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch quizzes: ${response.status}`)
        }

        const data = await response.json()
        const quizzesArray = Array.isArray(data) ? data : (data.quizzes || data.data || [])

        const quizzesWithFavorites = quizzesArray.map((quiz: Quiz) => ({
          ...quiz,
          isFavorite: favoriteIds.has(quiz.id)
        }))

        setQuizzes(quizzesWithFavorites)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load quizzes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session, status, isAuthed, favoriteIds])

  // Auto-refresh quizzes when navigating back from quiz builder
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthed) {
        refetch()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuthed])

  const refetch = () => {
    const fetchData = async () => {
      if (!isAuthed) return

      try {
        setIsLoading(true)
        setError(null)

        const token = (session as any)?.apiAccessToken
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stackquiz-api.stackquiz.me/api/v1'

        const response = await fetch(`${apiUrl}/quizzes/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        })

        if (!response.ok) throw new Error(`Failed to fetch quizzes: ${response.status}`)

        const data = await response.json()
        const quizzesArray = Array.isArray(data) ? data : (data.quizzes || data.data || [])

        const quizzesWithFavorites = quizzesArray.map((quiz: Quiz) => ({
          ...quiz,
          isFavorite: favoriteIds.has(quiz.id)
        }))

        setQuizzes(quizzesWithFavorites)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load quizzes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }

  const getFilteredQuizzes = () => {
    let filtered = [...quizzes]

    switch (activeTab) {
      case 'recent':
        filtered = filtered
          .filter(q => q.status === 'PUBLISHED')
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case 'draft':
        filtered = filtered.filter(q => q.status === 'DRAFT')
        break
      case 'favorites':
        filtered = filtered.filter(q => favoriteIds.has(q.id))
        break
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(quiz => {
        return (
          quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quiz.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    return filtered
  }

  const filteredData = getFilteredQuizzes()

  const tabs: TabItem[] = [
    { id: 'recent', label: 'Recent', count: quizzes.filter(q => q.status === 'PUBLISHED').length },
    { id: 'draft', label: 'Draft', count: quizzes.filter(q => q.status === 'DRAFT').length },
    { id: 'favorites', label: 'Favorites', count: quizzes.filter(q => favoriteIds.has(q.id)).length }
  ]

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map(item => item.id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC': return '🌍'
      case 'PRIVATE': return '🔒'
      case 'UNLISTED': return '🙈'
      default: return '👁️'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    const months = Math.floor(days / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  }

  const handleEdit = (quizId: string) => {
    setOpenDropdownId(null)
    router.push(`/quizbuilder/${quizId}`)
  }
  
  const handleView = (quizId: string) => {
    setOpenDropdownId(null)
    router.push(`/quizDetail/${quizId}`)
  }

  const openDeleteModal = (quiz: Quiz) => {
    setQuizToDelete({ id: quiz.id, title: quiz.title })
    setDeleteModalOpen(true)
    setOpenDropdownId(null)
  }

  const handleDelete = async () => {
    if (!quizToDelete) return
    
    try {
      const token = (session as any)?.apiAccessToken
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stackquiz-api.stackquiz.me/api/v1'
      const response = await fetch(`${apiUrl}/quizzes/${quizToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        setQuizzes(prev => prev.filter(q => q.id !== quizToDelete.id))
        setDeleteModalOpen(false)
        setQuizToDelete(null)
      } else {
        alert('Failed to delete quiz')
      }
    } catch (err) {
      console.error('Error deleting quiz:', err)
      alert('Failed to delete quiz')
    }
  }

  const toggleDropdown = (quizId: string, event?: React.MouseEvent) => {
    if (openDropdownId === quizId) {
      setOpenDropdownId(null)
      return
    }

    if (event) {
      const buttonRect = event.currentTarget.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top
      const dropdownHeight = 280

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('top')
      } else {
        setDropdownPosition('bottom')
      }
    }

    setOpenDropdownId(quizId)
  }

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null)
    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdownId])

  const handleToggleFavorite = async (quizId: string, isFavorite: boolean) => {
    const success = await toggleFavorite(quizId, isFavorite)
    if (success) {
      setQuizzes(prev => prev.map(q =>
        q.id === quizId ? { ...q, isFavorite: !isFavorite } : q
      ))
    } else {
      alert('Failed to update favorite. Please try again.')
    }
  }

  if (status === 'loading' || isLoading || favoritesLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Quizzes</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={refetch}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            
            {!isAuthed && (
              <button
                onClick={() => router.push('/login')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Tabs */}
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
                  {tab.count !== undefined && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeTab === tab.id ? 'bg-blue-500 text-blue-100' : 'bg-gray-100 text-gray-600'
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
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
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
            {filteredData.map((quiz) => (
              <div key={quiz.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                {/* Card Header */}
                <div className="relative">
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    {quiz.thumbnailUrl ? (
                      <Image
                        src={quiz.thumbnailUrl}
                        alt={quiz.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📝</div>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(quiz.id)}
                      onChange={() => handleSelectItem(quiz.id)}
                      className="h-5 w-5 rounded-lg border-2 border-white bg-white/80 backdrop-blur-sm text-blue-600 focus:ring-blue-500 shadow-lg"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleDropdown(quiz.id, e)
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openDropdownId === quiz.id && (
                        <div className={`absolute right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in duration-200 ${
                          dropdownPosition === 'top' 
                            ? 'bottom-full mb-2 slide-in-from-bottom-2' 
                            : 'top-full mt-2 slide-in-from-top-2'
                        }`}>
                          <div className="px-3 py-2 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</p>
                          </div>
                          <div className="py-1">
                            <button
                              onClick={() => handleView(quiz.id)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                <Eye className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium">View Details</span>
                            </button>
                            <button
                              onClick={() => handleEdit(quiz.id)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                <Edit className="h-4 w-4 text-purple-600" />
                              </div>
                              <span className="font-medium">Edit Quiz</span>
                            </button>
                            <button
                              onClick={() => handleToggleFavorite(quiz.id, quiz.isFavorite || false)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
                                <Heart className={`h-4 w-4 ${quiz.isFavorite ? 'fill-pink-600 text-pink-600' : 'text-pink-600'}`} />
                              </div>
                              <span className="font-medium">{quiz.isFavorite ? 'Remove Favorite' : 'Add Favorite'}</span>
                            </button>
                          </div>
                          <div className="border-t border-gray-100 my-1"></div>
                          <div className="py-1">
                            <button
                              onClick={() => openDeleteModal(quiz)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </div>
                              <span className="font-semibold">Delete Quiz</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Draft badge on thumbnail */}
                  {quiz.status === 'DRAFT' && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white shadow-lg">
                        Draft
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {(quiz.playCount || 0).toLocaleString()} plays
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{getVisibilityIcon(quiz.visibility)} {quiz.visibility}</span>
                    <span className="text-gray-400">{formatTimeAgo(quiz.updatedAt)}</span>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Visibility</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Modified</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((quiz, index) => (
                  <tr key={quiz.id} className={`group hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(quiz.id)}
                        onChange={() => handleSelectItem(quiz.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          {quiz.thumbnailUrl ? (
                            <Image src={quiz.thumbnailUrl} alt={quiz.title} fill className="object-cover group-hover:scale-105 transition-transform duration-200" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">📝</div>
                          )}
                          {quiz.status === 'DRAFT' && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
                                DRAFT
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{quiz.title}</div>
                          <div className="text-sm text-gray-500">{(quiz.playCount || 0).toLocaleString()} plays</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <span>{getVisibilityIcon(quiz.visibility)}</span>
                        <span>{quiz.visibility}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{formatTimeAgo(quiz.updatedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleDropdown(quiz.id, e)
                          }}
                          className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        {openDropdownId === quiz.id && (
                          <div className={`absolute right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in duration-200 ${
                            dropdownPosition === 'top' 
                              ? 'bottom-full mb-2 slide-in-from-bottom-2' 
                              : 'top-full mt-2 slide-in-from-top-2'
                          }`}>
                            <div className="px-3 py-2 border-b border-gray-100">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</p>
                            </div>
                            <div className="py-1">
                              <button
                                onClick={() => handleView(quiz.id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                  <Eye className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="font-medium">View Details</span>
                              </button>
                              <button
                                onClick={() => handleEdit(quiz.id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                  <Edit className="h-4 w-4 text-purple-600" />
                                </div>
                                <span className="font-medium">Edit Quiz</span>
                              </button>
                              <button
                                onClick={() => handleToggleFavorite(quiz.id, quiz.isFavorite || false)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
                                  <Heart className={`h-4 w-4 ${quiz.isFavorite ? 'fill-pink-600 text-pink-600' : 'text-pink-600'}`} />
                                </div>
                                <span className="font-medium">{quiz.isFavorite ? 'Remove Favorite' : 'Add Favorite'}</span>
                              </button>
                            </div>
                            <div className="border-t border-gray-100 my-1"></div>
                            <div className="py-1">
                              <button
                                onClick={() => openDeleteModal(quiz)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </div>
                                <span className="font-semibold">Delete Quiz</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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
                <span className="ml-3 text-sm font-medium text-gray-700">Select all ({filteredData.length})</span>
              </label>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredData.map((quiz) => (
                <div key={quiz.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(quiz.id)}
                      onChange={() => handleSelectItem(quiz.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                    />

                    <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {quiz.thumbnailUrl ? (
                        <Image src={quiz.thumbnailUrl} alt={quiz.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">📝</div>
                      )}
                      {quiz.status === 'DRAFT' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500 text-white">
                            DRAFT
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">{quiz.title}</h3>
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleDropdown(quiz.id, e)
                            }}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1.5 rounded-lg transition-all duration-200"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                          {openDropdownId === quiz.id && (
                            <div className={`absolute right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in duration-200 ${
                              dropdownPosition === 'top' 
                                ? 'bottom-full mb-2 slide-in-from-bottom-2' 
                                : 'top-full mt-2 slide-in-from-top-2'
                            }`}>
                              <div className="px-3 py-2 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</p>
                              </div>
                              <div className="py-1">
                                <button
                                  onClick={() => handleView(quiz.id)}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                    <Eye className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <span className="font-medium">View Details</span>
                                </button>
                                <button
                                  onClick={() => handleEdit(quiz.id)}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors group"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                    <Edit className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <span className="font-medium">Edit Quiz</span>
                                </button>
                                <button
                                  onClick={() => handleToggleFavorite(quiz.id, quiz.isFavorite || false)}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition-colors group"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
                                    <Heart className={`h-4 w-4 ${quiz.isFavorite ? 'fill-pink-600 text-pink-600' : 'text-pink-600'}`} />
                                  </div>
                                  <span className="font-medium">{quiz.isFavorite ? 'Remove Favorite' : 'Add Favorite'}</span>
                                </button>
                              </div>
                              <div className="border-t border-gray-100 my-1"></div>
                              <div className="py-1">
                                <button
                                  onClick={() => openDeleteModal(quiz)}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </div>
                                  <span className="font-semibold">Delete Quiz</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mb-3">
                        {(quiz.playCount || 0).toLocaleString()} plays
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          {getVisibilityIcon(quiz.visibility)} {quiz.visibility}
                        </span>
                        <span className="text-xs text-gray-400">{formatTimeAgo(quiz.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {filteredData.length === 0 && !isLoading && (
        <div className="text-center py-16 px-6">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No quizzes found' : `No ${activeTab} quizzes yet`}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? "We couldn't find any quizzes matching your search. Try different keywords."
              : activeTab === 'draft'
              ? "Start creating a quiz and save it as draft to see it here."
              : activeTab === 'favorites'
              ? "Mark quizzes (including drafts) as favorites to see them here."
              : "Create your first quiz to get started!"}
          </p>
          <button 
            onClick={() => router.push('/quizbuilder')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Quiz
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Quiz</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{quizToDelete?.title}</span>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setQuizToDelete(null)
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable