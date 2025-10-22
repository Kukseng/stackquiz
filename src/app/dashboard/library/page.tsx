'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MoreHorizontal, Filter, Plus, Grid, List, ChevronDown, Heart, Edit, Trash2, Eye, X } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
  const [activeTab, setActiveTab] = useState<'recent' | 'draft' | 'favorites'>('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<{ id: string; title: string } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isAuthed = status === "authenticated" && !!(session as any)?.apiAccessToken

  // Fetch user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthed) return

      try {
        const token = (session as any)?.apiAccessToken
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stackquiz-api.stackquiz.me/api/v1'
        
        const response = await fetch(`${apiUrl}/quizzes/favorites`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        })

        if (response.ok) {
          const data = await response.json()
          const favArray = Array.isArray(data) ? data : (data.favorites || data.data || [])
          const favoriteQuizIds = new Set(favArray.map((fav: any) => fav.quizId))
          setFavoriteIds(favoriteQuizIds)
        }
      } catch (err) {
        console.error('Error fetching favorites:', err)
      }
    }

    fetchFavorites()
  }, [session, status, isAuthed])

  // Fetch quizzes from API
  useEffect(() => {
    const fetchQuizzes = async () => {
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
        
        let response = await fetch(`${apiUrl}/quizzes/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        })

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
        console.error('Error fetching quizzes:', err)
        setError(err instanceof Error ? err.message : 'Failed to load quizzes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizzes()
  }, [session, status, isAuthed, favoriteIds])

  const getCategoryNames = (categories?: Category[]): string => {
    if (!categories || categories.length === 0) return 'Uncategorized'
    return categories.map(c => c.name).join(', ')
  }

  const refetch = () => {
    const fetchQuizzes = async () => {
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
        console.error('Error fetching quizzes:', err)
        setError(err instanceof Error ? err.message : 'Failed to load quizzes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizzes()
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
        const categoryNames = getCategoryNames(quiz.categories).toLowerCase()
        return (
          quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          categoryNames.includes(searchQuery.toLowerCase())
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

  const getLevelBadgeColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'EASY':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border border-amber-200'
      case 'HARD':
        return 'bg-rose-50 text-rose-700 border border-rose-200'
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200'
    }
  }

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'PRIVATE':
        return 'bg-slate-50 text-slate-700 border border-slate-200'
      case 'UNLISTED':
        return 'bg-violet-50 text-violet-700 border border-violet-200'
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200'
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC': return '🌍'
      case 'PRIVATE': return '🔒'
      case 'UNLISTED': return '🔗'
      default: return '👁️'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks}w ago`
    const months = Math.floor(days / 30)
    return `${months}mo ago`
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
    event?.stopPropagation()
    if (openDropdownId === quizId) {
      setOpenDropdownId(null)
    } else {
      setOpenDropdownId(quizId)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null)
      }
    }
    
    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdownId])

  const handleToggleFavorite = async (quizId: string, isFavorite: boolean) => {
    try {
      const token = (session as any)?.apiAccessToken
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stackquiz-api.stackquiz.me/api/v1'
      const method = isFavorite ? 'DELETE' : 'POST'
      
      const response = await fetch(`${apiUrl}/quizzes/${quizId}/favorite`, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const newFavorites = new Set(favoriteIds)
        if (isFavorite) {
          newFavorites.delete(quizId)
        } else {
          newFavorites.add(quizId)
        }
        setFavoriteIds(newFavorites)
        
        setQuizzes(prev => prev.map(q => 
          q.id === quizId ? { ...q, isFavorite: !isFavorite } : q
        ))
      } else {
        alert('Failed to update favorite')
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
      alert('Failed to update favorite')
    }
  }

  // Action Dropdown Component
  const ActionDropdown = ({ quiz, isMobile = false }: { quiz: Quiz; isMobile?: boolean }) => (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={(e) => toggleDropdown(quiz.id, e)}
        className={`${
          isMobile 
            ? 'p-2 hover:bg-slate-100 rounded-lg transition-colors' 
            : 'p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200'
        } text-slate-400 hover:text-slate-700`}
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      
      {openDropdownId === quiz.id && (
        <div className={`
          absolute ${isMobile ? 'right-0' : 'right-0'} mt-2 w-64 
          bg-white rounded-2xl shadow-2xl border border-slate-200/80 
          py-2 z-50 backdrop-blur-xl
          animate-in fade-in slide-in-from-top-2 duration-200
        `}>
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</p>
          </div>
          
          <div className="py-2 px-2">
            <button
              onClick={() => handleView(quiz.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50/80 rounded-xl transition-all duration-150 group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Eye className="h-4.5 w-4.5 text-blue-600" />
              </div>
              <span className="font-medium">View Details</span>
            </button>
            
            <button
              onClick={() => handleEdit(quiz.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-violet-50/80 rounded-xl transition-all duration-150 group"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-50 group-hover:bg-violet-100 flex items-center justify-center transition-colors">
                <Edit className="h-4.5 w-4.5 text-violet-600" />
              </div>
              <span className="font-medium">Edit Quiz</span>
            </button>
            
            <button
              onClick={() => handleToggleFavorite(quiz.id, quiz.isFavorite || false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-pink-50/80 rounded-xl transition-all duration-150 group"
            >
              <div className="w-9 h-9 rounded-lg bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
                <Heart className={`h-4.5 w-4.5 ${quiz.isFavorite ? 'fill-pink-600 text-pink-600' : 'text-pink-600'}`} />
              </div>
              <span className="font-medium">{quiz.isFavorite ? 'Unfavorite' : 'Add to Favorites'}</span>
            </button>
          </div>
          
          <div className="border-t border-slate-100 my-2"></div>
          
          <div className="py-1 px-2">
            <button
              onClick={() => openDeleteModal(quiz)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50/80 rounded-xl transition-all duration-150 group"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center transition-colors">
                <Trash2 className="h-4.5 w-4.5 text-rose-600" />
              </div>
              <span className="font-semibold">Delete Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )

  if (status === 'loading' || isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-3 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-12">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto h-20 w-20 bg-rose-100 rounded-2xl flex items-center justify-center mb-5">
            <svg className="h-10 w-10 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Failed to Load Quizzes</h3>
          <p className="text-slate-600 mb-8">{error}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={refetch}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-600/30"
            >
              Try Again
            </button>
            
            {!isAuthed && (
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
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
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Modern Header */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50/50 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-5">
          {/* Top Row - Tabs and Search */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            {/* Tabs */}
            <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200/80 w-full lg:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 lg:flex-none ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
                  {tab.count !== undefined && (
                    <span className={`ml-2 px-2 py-0.5 rounded-lg text-xs font-bold ${
                      activeTab === tab.id ? 'bg-blue-500 text-blue-50' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 lg:max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row - Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <div className="flex bg-white border border-slate-200/80 rounded-xl p-1.5 shadow-sm">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'table' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <List className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Grid className="h-4.5 w-4.5" />
              </button>
            </div>

            <button 
              onClick={() => router.push('/quizbuilder')}
              className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
            >
              <Plus className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">New Quiz</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            {filteredData.map((quiz) => (
              <div key={quiz.id} className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
                {/* Card Header */}
                <div className="relative">
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                    {quiz.thumbnailUrl ? (
                      <Image
                        src={quiz.thumbnailUrl}
                        alt={quiz.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-5xl">📝</div>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(quiz.id)}
                      onChange={() => handleSelectItem(quiz.id)}
                      className="h-5 w-5 rounded-xl border-2 border-white bg-white/90 backdrop-blur-sm text-blue-600 focus:ring-blue-500 shadow-lg cursor-pointer"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl p-0.5 shadow-lg">
                      <ActionDropdown quiz={quiz} />
                    </div>
                  </div>
                  {quiz.isFavorite && (
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/95 backdrop-blur-md rounded-full p-2 shadow-lg">
                        <Heart className="h-4 w-4 fill-pink-600 text-pink-600" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 font-medium">
                    {(quiz.playCount || 0).toLocaleString()} plays
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-5">
                    {quiz.status === 'DRAFT' && (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200/80">
                        DRAFT
                      </span>
                    )}
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${getLevelBadgeColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${getVisibilityBadge(quiz.visibility)}`}>
                      {getVisibilityIcon(quiz.visibility)} {quiz.visibility}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                    <span className="font-medium truncate pr-2">{getCategoryNames(quiz.categories)}</span>
                    <span className="font-semibold whitespace-nowrap">{formatTimeAgo(quiz.updatedAt)}</span>
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
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="w-12 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                      className="h-4.5 w-4.5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Visibility</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Modified</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredData.map((quiz, index) => (
                  <tr key={quiz.id} className={`group hover:bg-slate-50/80 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="px-6 py-5">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(quiz.id)}
                        onChange={() => handleSelectItem(quiz.id)}
                        className="h-4.5 w-4.5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm">
                          {quiz.thumbnailUrl ? (
                            <Image src={quiz.thumbnailUrl} alt={quiz.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl">📝</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 truncate">{quiz.title}</div>
                          <div className="text-sm text-slate-500 font-semibold flex items-center gap-2">
                            <span>{(quiz.playCount || 0).toLocaleString()} plays</span>
                            {quiz.isFavorite && (
                              <Heart className="h-3.5 w-3.5 fill-pink-600 text-pink-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-700 max-w-xs truncate">{getCategoryNames(quiz.categories)}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold ${getLevelBadgeColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {quiz.status === 'DRAFT' ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200/80">
                          DRAFT
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          PUBLISHED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold ${getVisibilityBadge(quiz.visibility)}`}>
                        {getVisibilityIcon(quiz.visibility)} {quiz.visibility}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 font-bold whitespace-nowrap">{formatTimeAgo(quiz.updatedAt)}</td>
                    <td className="px-6 py-5 text-right">
                      <ActionDropdown quiz={quiz} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="p-5 border-b border-slate-200/80 bg-slate-50/80">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAll}
                  className="h-4.5 w-4.5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-bold text-slate-700">Select all ({filteredData.length})</span>
              </label>
            </div>

            <div className="divide-y divide-slate-200/80">
              {filteredData.map((quiz) => (
                <div key={quiz.id} className="p-5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(quiz.id)}
                      onChange={() => handleSelectItem(quiz.id)}
                      className="h-4.5 w-4.5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer"
                    />

                    <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm">
                      {quiz.thumbnailUrl ? (
                        <Image src={quiz.thumbnailUrl} alt={quiz.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-3xl">📝</div>
                      )}
                      {quiz.isFavorite && (
                        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-md">
                          <Heart className="h-3 w-3 fill-pink-600 text-pink-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 flex-1">{quiz.title}</h3>
                        <ActionDropdown quiz={quiz} isMobile={true} />
                      </div>

                      <p className="text-xs text-slate-500 mb-3 font-semibold">
                        {(quiz.playCount || 0).toLocaleString()} plays • {getCategoryNames(quiz.categories)}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {quiz.status === 'DRAFT' && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200/80">
                            DRAFT
                          </span>
                        )}
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getLevelBadgeColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getVisibilityBadge(quiz.visibility)}`}>
                          {getVisibilityIcon(quiz.visibility)} {quiz.visibility}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-bold">Modified {formatTimeAgo(quiz.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Enhanced Empty State */}
      {filteredData.length === 0 && !isLoading && (
        <div className="text-center py-20 px-6">
          <div className="mx-auto h-28 w-28 bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
            <Search className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            {searchQuery ? 'No quizzes found' : `No ${activeTab} quizzes yet`}
          </h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium leading-relaxed">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
          >
            <Plus className="h-5 w-5" />
            Create New Quiz
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 mb-5 shadow-sm">
              <Trash2 className="h-8 w-8 text-rose-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Delete Quiz?</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-900">"{quizToDelete?.title}"</span>? This action is permanent and cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setQuizToDelete(null)
                }}
                className="flex-1 px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all duration-200 shadow-sm hover:shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl font-bold hover:from-rose-700 hover:to-rose-800 transition-all duration-200 shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/40"
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