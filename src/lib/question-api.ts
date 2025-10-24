import type { Question } from "@/types/quiz"
import { getApiBaseUrl } from "./api-config"

export async function fetchSessionQuestions(sessionCode: string): Promise<Question[]> {
  try {
    const baseUrl = getApiBaseUrl()
    const response = await fetch(`${baseUrl}/v1/quiz-sessions/${sessionCode}/questions`)

    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.statusText}`)
    }

    const data = await response.json()
    return data.questions || data || []
  } catch (error) {
    console.error("❌ Error fetching questions:", error)
    return []
  }
}

export async function fetchCurrentQuestion(sessionCode: string): Promise<Question | null> {
  try {
    const baseUrl = getApiBaseUrl()
    const response = await fetch(`${baseUrl}/v1/quiz-sessions/${sessionCode}/current-question`)

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("❌ Error fetching current question:", error)
    return null
  }
}
