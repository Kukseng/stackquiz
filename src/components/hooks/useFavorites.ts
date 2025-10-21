import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export function useFavorites() {
  const { data: session } = useSession()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  // Fetch favorites from backend on mount
  const fetchFavorites = useCallback(async () => {
    if (!(session as any)?.apiAccessToken) {
      setIsLoading(false)
      return
    }

    try {
      const token = (session as any).apiAccessToken
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
        
        const ids = new Set(
          favArray.map((fav: any) => 
            fav.quizId || fav.quiz_id || fav.id || (typeof fav === 'string' ? fav : null)
          ).filter(Boolean)
        )
        
        console.log('✅ Favorites loaded:', Array.from(ids))
        setFavoriteIds(ids)
      }
    } catch (error) {
      console.error('❌ Error fetching favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  // Toggle favorite status
  const toggleFavorite = useCallback(async (quizId: string, currentIsFavorite: boolean) => {
    const token = (session as any)?.apiAccessToken
    if (!token) return false

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stackquiz-api.stackquiz.me/api/v1'
      const method = currentIsFavorite ? 'DELETE' : 'POST'
      
      const response = await fetch(`${apiUrl}/quizzes/${quizId}/favorite`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Update local state
        setFavoriteIds(prev => {
          const newSet = new Set(prev)
          if (currentIsFavorite) {
            newSet.delete(quizId)
          } else {
            newSet.add(quizId)
          }
          return newSet
        })
        return true
      }
      return false
    } catch (error) {
      console.error('❌ Error toggling favorite:', error)
      return false
    }
  }, [session])

  const isFavorite = useCallback((quizId: string) => {
    return favoriteIds.has(quizId)
  }, [favoriteIds])

  return {
    favoriteIds,
    isLoading,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites
  }
}