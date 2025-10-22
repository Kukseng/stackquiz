import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface FavoriteQuiz {
  id: string
  quizId: string
  username: string
  createdAt: string
}

export function useFavorites() {
  const { data: session, status } = useSession()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  const isAuthed = status === "authenticated" && !!(session as any)?.apiAccessToken

  useEffect(() => {
    const fetchFavorites = async () => {
      if (status === 'loading') return
      
      if (!isAuthed) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const token = (session as any)?.apiAccessToken
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stackquiz-api.stackquiz.me/api/v1'

        const response = await fetch(`${apiUrl}/quizzes/favorite/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        })

        if (response.ok) {
          const favorites: FavoriteQuiz[] = await response.json()
          const ids = new Set(favorites.map(fav => fav.quizId))
          setFavoriteIds(ids)
        } else {
          console.error('Failed to fetch favorites:', response.status)
          setFavoriteIds(new Set())
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
        setFavoriteIds(new Set())
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [session, status, isAuthed])

  const toggleFavorite = async (quizId: string, isFavorite: boolean): Promise<boolean> => {
    if (!isAuthed) {
      console.error('User not authenticated')
      return false
    }

    try {
      const token = (session as any)?.apiAccessToken
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stackquiz-api.stackquiz.me/api/v1'

      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`${apiUrl}/quizzes/${quizId}/favorite`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          setFavoriteIds(prev => {
            const newSet = new Set(prev)
            newSet.delete(quizId)
            return newSet
          })
          return true
        } else {
          console.error('Failed to remove favorite:', response.status)
          return false
        }
      } else {
        // Add to favorites
        const response = await fetch(`${apiUrl}/quizzes/${quizId}/favorite`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          setFavoriteIds(prev => {
            const newSet = new Set(prev)
            newSet.add(quizId)
            return newSet
          })
          return true
        } else {
          console.error('Failed to add favorite:', response.status)
          return false
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      return false
    }
  }

  return {
    favoriteIds,
    toggleFavorite,
    isLoading
  }
}