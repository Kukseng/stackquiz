// API service for StackQuiz integration
const API_BASE_URL = "https://stackquiz-api.stackquiz.me/api/v1"

// Development mode detection
const isDevelopment = process.env.NODE_ENV === "development" || typeof window !== "undefined"

export interface AnswerSubmission {
  participantId: string
  questionId: string
  optionId?: string
  answerText?: string
  timeTaken: number
  sessionId: string
}

export interface BulkAnswerSubmission {
  participantId: string
  sessionId: string
  answers: Array<{
    questionId: string
    optionId?: string
    answerText?: string
    timeTaken: number
  }>
}

export interface ParticipantAnswer {
  answerId: string
  participantId: string
  participantNickname: string
  questionId: string
  questionText: string
  optionId?: string
  optionText?: string
  answerText?: string
  isCorrect: boolean
  timeTaken: number
  pointsEarned: number
  answeredAt: string
  sessionId: string
}

class StackQuizAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      if (isDevelopment) {
        console.log("[v0] API request failed, using mock response for:", endpoint)
        return this.getMockResponse<T>(endpoint, options)
      }
      throw error
    }
  }

  private getMockResponse<T>(endpoint: string, options: RequestInit = {}): T {
    console.log("[v0] Mock API call:", endpoint, options.method || "GET")

    // Mock responses based on endpoint
    if (endpoint === "/answers/submit" && options.method === "POST") {
      return {} as T // Empty response for successful submission
    }

    if (endpoint === "/answers/submit/bulk" && options.method === "POST") {
      return {} as T // Empty response for successful bulk submission
    }

    if (endpoint.includes("/answers/participant/") && endpoint.includes("/question/")) {
      return {
        answerId: "mock-answer-1",
        participantId: "demo-participant",
        participantNickname: "Demo User",
        questionId: "q1",
        questionText: "What is the capital of France?",
        optionId: "opt3",
        optionText: "Paris",
        answerText: null,
        isCorrect: true,
        timeTaken: 15,
        pointsEarned: 100,
        answeredAt: new Date().toISOString(),
        sessionId: "demo-session",
      } as T
    }

    if (endpoint.includes("/answers/participant/")) {
      return [
        {
          answerId: "mock-answer-1",
          participantId: "demo-participant",
          participantNickname: "Demo User",
          questionId: "q1",
          questionText: "What is the capital of France?",
          optionId: "opt3",
          optionText: "Paris",
          answerText: null,
          isCorrect: true,
          timeTaken: 15,
          pointsEarned: 100,
          answeredAt: new Date().toISOString(),
          sessionId: "demo-session",
        },
      ] as T
    }

    if (endpoint.includes("/answers/") && options.method === "PUT") {
      return {} as T // Empty response for successful update
    }

    return {} as T
  }

  // Submit a single answer
  async submitAnswer(answer: AnswerSubmission): Promise<void> {
    console.log("[v0] Submitting answer:", answer)
    return this.request("/answers/submit", {
      method: "POST",
      body: JSON.stringify(answer),
    })
  }

  // Submit multiple answers at once
  async submitBulkAnswers(bulkAnswers: BulkAnswerSubmission): Promise<void> {
    console.log("[v0] Submitting bulk answers:", bulkAnswers)
    return this.request("/answers/submit/bulk", {
      method: "POST",
      body: JSON.stringify(bulkAnswers),
    })
  }

  // Get participant's answer for a specific question
  async getParticipantAnswer(participantId: string, questionId: string): Promise<ParticipantAnswer> {
    return this.request(`/answers/participant/${participantId}/question/${questionId}`)
  }

  // Get all answers for a participant
  async getParticipantAnswers(participantId: string): Promise<ParticipantAnswer[]> {
    return this.request(`/answers/participant/${participantId}`)
  }

  // Update an existing answer
  async updateAnswer(answerId: string, answer: Partial<AnswerSubmission>): Promise<void> {
    return this.request(`/answers/${answerId}`, {
      method: "PUT",
      body: JSON.stringify(answer),
    })
  }
}

export const stackQuizAPI = new StackQuizAPI()
