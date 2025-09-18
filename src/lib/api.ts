// // API service for StackQuiz integration
// const API_BASE_URL = "https://stackquiz-api.stackquiz.me/api/v1"

// // Development mode detection
// const isDevelopment = process.env.NODE_ENV === "development" || typeof window !== "undefined"

// export interface AnswerSubmission {
//   participantId: string
//   questionId: string
//   optionId?: string
//   answerText?: string
//   timeTaken: number
//   sessionId: string
// }

// export interface BulkAnswerSubmission {
//   participantId: string
//   sessionId: string
//   answers: Array<{
//     questionId: string
//     optionId?: string
//     answerText?: string
//     timeTaken: number
//   }>
// }

// export interface ParticipantAnswer {
//   answerId: string
//   participantId: string
//   participantNickname: string
//   questionId: string
//   questionText: string
//   optionId?: string
//   optionText?: string
//   answerText?: string
//   isCorrect: boolean
//   timeTaken: number
//   pointsEarned: number
//   answeredAt: string
//   sessionId: string
// }

// class StackQuizAPI {
//   private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
//     const url = `${API_BASE_URL}${endpoint}`

//     try {
//       const response = await fetch(url, {
//         headers: {
//           "Content-Type": "application/json",
//           ...options.headers,
//         },
//         ...options,
//       })

//       if (!response.ok) {
//         throw new Error(`API request failed: ${response.status} ${response.statusText}`)
//       }

//       return response.json()
//     } catch (error) {
//       if (isDevelopment) {
//         console.log("[v0] API request failed, using mock response for:", endpoint)
//         return this.getMockResponse<T>(endpoint, options)
//       }
//       throw error
//     }
//   }

//   private getMockResponse<T>(endpoint: string, options: RequestInit = {}): T {
//     console.log("[v0] Mock API call:", endpoint, options.method || "GET")

//     // Mock responses based on endpoint
//     if (endpoint === "/answers/submit" && options.method === "POST") {
//       return {} as T // Empty response for successful submission
//     }

//     if (endpoint === "/answers/submit/bulk" && options.method === "POST") {
//       return {} as T // Empty response for successful bulk submission
//     }

//     if (endpoint.includes("/answers/participant/") && endpoint.includes("/question/")) {
//       return {
//         answerId: "mock-answer-1",
//         participantId: "demo-participant",
//         participantNickname: "Demo User",
//         questionId: "q1",
//         questionText: "What is the capital of France?",
//         optionId: "opt3",
//         optionText: "Paris",
//         answerText: null,
//         isCorrect: true,
//         timeTaken: 15,
//         pointsEarned: 100,
//         answeredAt: new Date().toISOString(),
//         sessionId: "demo-session",
//       } as T
//     }

//     if (endpoint.includes("/answers/participant/")) {
//       return [
//         {
//           answerId: "mock-answer-1",
//           participantId: "demo-participant",
//           participantNickname: "Demo User",
//           questionId: "q1",
//           questionText: "What is the capital of France?",
//           optionId: "opt3",
//           optionText: "Paris",
//           answerText: null,
//           isCorrect: true,
//           timeTaken: 15,
//           pointsEarned: 100,
//           answeredAt: new Date().toISOString(),
//           sessionId: "demo-session",
//         },
//       ] as T
//     }

//     if (endpoint.includes("/answers/") && options.method === "PUT") {
//       return {} as T // Empty response for successful update
//     }

//     return {} as T
//   }

//   // Submit a single answer
//   async submitAnswer(answer: AnswerSubmission): Promise<void> {
//     console.log("[v0] Submitting answer:", answer)
//     return this.request("/answers/submit", {
//       method: "POST",
//       body: JSON.stringify(answer),
//     })
//   }

//   // Submit multiple answers at once
//   async submitBulkAnswers(bulkAnswers: BulkAnswerSubmission): Promise<void> {
//     console.log("[v0] Submitting bulk answers:", bulkAnswers)
//     return this.request("/answers/submit/bulk", {
//       method: "POST",
//       body: JSON.stringify(bulkAnswers),
//     })
//   }

//   // Get participant's answer for a specific question
//   async getParticipantAnswer(participantId: string, questionId: string): Promise<ParticipantAnswer> {
//     return this.request(`/answers/participant/${participantId}/question/${questionId}`)
//   }

//   // Get all answers for a participant
//   async getParticipantAnswers(participantId: string): Promise<ParticipantAnswer[]> {
//     return this.request(`/answers/participant/${participantId}`)
//   }

//   // Update an existing answer
//   async updateAnswer(answerId: string, answer: Partial<AnswerSubmission>): Promise<void> {
//     return this.request(`/answers/${answerId}`, {
//       method: "PUT",
//       body: JSON.stringify(answer),
//     })
//   }
// }

// export const stackQuizAPI = new StackQuizAPI()


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

export class ApiClient {
  private baseUrl: string
  private token?: string

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string) {
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // User endpoints
  async getCurrentUser() {
    return this.request("/users/me")
  }

  async updateUser(userData: any) {
    return this.request("/users/me", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  // Quiz Session endpoints
  async createSession(quizId: string, sessionName: string) {
    return this.request("/sessions", {
      method: "POST",
      body: JSON.stringify({ quizId, sessionName }),
    })
  }

  async getSession(sessionCode: string) {
    return this.request(`/sessions/${sessionCode}`)
  }

  async startSession(sessionId: string) {
    return this.request(`/sessions/${sessionId}/start`, {
      method: "PUT",
    })
  }

  async nextQuestion(sessionId: string) {
    return this.request(`/sessions/${sessionId}/next-question`, {
      method: "PUT",
    })
  }

  async endSession(sessionId: string) {
    return this.request(`/sessions/${sessionId}/end`, {
      method: "PUT",
    })
  }

  async joinSession(sessionCode: string) {
    return this.request(`/sessions/${sessionCode}/join`)
  }

  async getMySessions() {
    return this.request("/sessions/me")
  }

  // Quiz endpoints
  async getQuiz(quizId: string) {
    return this.request(`/quizzes/${quizId}`)
  }

  async getAllQuizzes() {
    return this.request("/quizzes")
  }

  async createQuiz(quizData: any) {
    return this.request("/quizzes", {
      method: "POST",
      body: JSON.stringify(quizData),
    })
  }

  async updateQuiz(quizId: string, quizData: any) {
    return this.request(`/quizzes/${quizId}`, {
      method: "PUT",
      body: JSON.stringify(quizData),
    })
  }

  async deleteQuiz(quizId: string) {
    return this.request(`/quizzes/${quizId}`, {
      method: "DELETE",
    })
  }

  async getMyQuizzes() {
    return this.request("/quizzes/users/me")
  }

  // Participant endpoints
  async joinAsParticipant(quizCode: string, nickname: string, avatarId?: number) {
    return this.request("/participants/join", {
      method: "POST",
      body: JSON.stringify({ quizCode, nickname, avatarId }),
    })
  }

  async joinAsAuthenticatedUser(quizCode: string, nickname: string, avatarId?: number) {
    return this.request("/participants/join/auth-user", {
      method: "POST",
      body: JSON.stringify({ quizCode, nickname, avatarId }),
    })
  }

  async getSessionParticipants(quizCode: string) {
    return this.request(`/participants/session/${quizCode}`)
  }

  async checkNicknameAvailability(quizCode: string, nickname: string) {
    return this.request(`/participants/session/${quizCode}/nickname-available?nickname=${encodeURIComponent(nickname)}`)
  }

  async canJoinSession(quizCode: string) {
    return this.request(`/participants/session/${quizCode}/can-join`)
  }

  async removeParticipant(participantId: string) {
    return this.request(`/participants/${participantId}`, {
      method: "DELETE",
    })
  }

  // Answer endpoints
  async submitAnswer(answerData: any) {
    return this.request("/answers/submit", {
      method: "POST",
      body: JSON.stringify(answerData),
    })
  }

  async submitBulkAnswers(bulkAnswerData: any) {
    return this.request("/answers/submit/bulk", {
      method: "POST",
      body: JSON.stringify(bulkAnswerData),
    })
  }

  async getParticipantAnswers(participantId: string) {
    return this.request(`/answers/participant/${participantId}`)
  }

  async getParticipantQuestionAnswer(participantId: string, questionId: string) {
    return this.request(`/answers/participant/${participantId}/question/${questionId}`)
  }

  // Leaderboard endpoints
  async getLiveLeaderboard(
    sessionId: string,
    limit = 10,
    offset = 0,
    includeInactive = false,
    currentParticipantId?: string,
  ) {
    return this.request("/leaderboard/live", {
      method: "POST",
      body: JSON.stringify({
        sessionId,
        limit,
        offset,
        includeInactive,
        currentParticipantId,
      }),
    })
  }

  async getTopLeaderboard(sessionId: string, limit: number, participantId?: string) {
    const params = participantId ? `?participantId=${participantId}` : ""
    return this.request(`/leaderboard/session/${sessionId}/top/${limit}${params}`)
  }

  async getLeaderboardBySessionCode(sessionCode: string) {
    return this.request(`/leaderboard/session/${sessionCode}`)
  }

  async getPodiumLeaderboard(sessionCode: string) {
    return this.request(`/leaderboard/session/${sessionCode}/podium`)
  }

  async getParticipantRank(sessionCode: string, participantId: string) {
    return this.request(`/leaderboard/session/${sessionCode}/participant/${participantId}/rank`)
  }

  async getLeaderboardStats(sessionId: string) {
    return this.request(`/leaderboard/session/${sessionId}/stats`)
  }

  async initializeLeaderboard(sessionCode: string) {
    return this.request(`/leaderboard/session/${sessionCode}/initialize`, {
      method: "POST",
    })
  }

  async finalizeLeaderboard(sessionId: string) {
    return this.request(`/leaderboard/session/${sessionId}/finalize`, {
      method: "POST",
    })
  }

  // Question endpoints
  async getAllQuestions() {
    return this.request("/questions")
  }

  async getQuestion(questionId: string) {
    return this.request(`/questions/${questionId}`)
  }

  async createQuestion(questionData: any) {
    return this.request("/questions", {
      method: "POST",
      body: JSON.stringify(questionData),
    })
  }

  async updateQuestion(questionId: string, questionData: any) {
    return this.request(`/questions/${questionId}`, {
      method: "PATCH",
      body: JSON.stringify(questionData),
    })
  }

  async deleteQuestion(questionId: string) {
    return this.request(`/questions/${questionId}`, {
      method: "DELETE",
    })
  }

  async deleteQuestions(questionIds: string[]) {
    return this.request("/questions", {
      method: "DELETE",
      body: JSON.stringify(questionIds),
    })
  }

  async getMyQuestions() {
    return this.request("/questions/me")
  }

  // Options endpoints
  async getAllOptions() {
    return this.request("/options")
  }

  async addOptionsToQuestion(questionId: string, options: any[]) {
    return this.request(`/options/questions/${questionId}`, {
      method: "POST",
      body: JSON.stringify(options),
    })
  }

  async updateOption(optionId: string, optionData: any) {
    return this.request(`/options/${optionId}`, {
      method: "PUT",
      body: JSON.stringify(optionData),
    })
  }

  async deleteOption(optionId: string) {
    return this.request(`/options/${optionId}`, {
      method: "DELETE",
    })
  }

  async getQuestionOptions(questionId: string) {
    return this.request(`/options/questions/${questionId}/public`)
  }

  // Session Report endpoints
  async generateSessionReport(sessionId: string) {
    return this.request(`/sessions/${sessionId}/generate-report`, {
      method: "POST",
    })
  }

  async getSessionReport(sessionId: string) {
    return this.request(`/sessions/${sessionId}/report`)
  }

  async getHostReports(hostId: string) {
    return this.request(`/sessions/reports/${hostId}`)
  }

  // Category endpoints
  async getAllCategories() {
    return this.request("/categories")
  }

  async createCategory(categoryData: any) {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    })
  }

  async createCategories(categoriesData: any[]) {
    return this.request("/categories/batch", {
      method: "POST",
      body: JSON.stringify(categoriesData),
    })
  }
}

export const apiClient = new ApiClient()
