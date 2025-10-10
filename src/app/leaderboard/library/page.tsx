"use client"
import { Library } from "@/components/library/library"
import { useGetMyQuizzesQuery } from "@/lib/api/quizApi"
import { useSession } from "next-auth/react"

export default function LeaderboardPage() {
  const { data: session, status } = useSession()
  const { data: myQuizzes, isLoading, error } = useGetMyQuizzesQuery(undefined, {
    skip: !session?.apiAccessToken
  })

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    )
  }

  // Show loading while fetching quizzes (only if user is authenticated)
  if (isLoading && session?.apiAccessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Loading your quizzes...</div>
      </div>
    )
  }

  // Show error details for debugging
  if (error) {
    console.error("Quiz fetch error:", error)
    
    // Still render the Library component even if fetching user quizzes fails
    // This allows users to see public quizzes
    return (
      <div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Note:</strong> Could not load your personal quizzes. 
          {status !== "authenticated" && " Please log in to see your quizzes."}
        </div>
        <Library myQuizzes={[]} />
      </div>
    )
  }

  // If not authenticated, still show the library (without personal quizzes)
  if (status !== "authenticated") {
    return <Library myQuizzes={[]} />
  }

  // Normal render with user's quizzes
  return (
    <div>
      <Library myQuizzes={myQuizzes || []} />
    </div>
  )
}