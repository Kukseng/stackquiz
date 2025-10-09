"use client"
import { Library } from "@/components/library/library"
import { useGetMyQuizzesQuery } from "@/lib/api/quizApi"
import { useSession } from "next-auth/react"

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const { data: myQuizzes, isLoading, error } = useGetMyQuizzesQuery(undefined, {
    skip: !session?.apiAccessToken
  })

  if (isLoading) return <div>Loading your quizzes...</div>
  if (error) return <div>Error loading quizzes</div>

  return (
    <div>
      <Library myQuizzes={myQuizzes} />
    </div>
  )
}