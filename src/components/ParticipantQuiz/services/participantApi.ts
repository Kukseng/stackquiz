// services/participantApi.ts
import axios from "axios"
import { API_BASE_URL } from "@/components/ParticipantQuiz/constants/config"

export const participantApi = {
  /**
   * Join a quiz session
   */
  async join(quizCode: string, nickname: string, avatarId: string) {
    const response = await axios.post(`${API_BASE_URL}/participants/join`, {
      quizCode,
      nickname,
      avatarId,
    })
    return response.data
  },

  /**
   * Fetch question analytics for current question
   */
  async fetchQuestionAnalytics(sessionCode: string) {
    const response = await axios.get(
      `${API_BASE_URL}/participants/session/${sessionCode}/question-analytics`
    )
    return response.data
  },

  /**
   * Get participant details
   */
  async getParticipant(participantId: string) {
    const response = await axios.get(`${API_BASE_URL}/participants/${participantId}`)
    return response.data
  },

  /**
   * Get session leaderboard
   */
  async getLeaderboard(sessionCode: string) {
    const response = await axios.get(`${API_BASE_URL}/sessions/${sessionCode}/leaderboard`)
    return response.data
  },
}