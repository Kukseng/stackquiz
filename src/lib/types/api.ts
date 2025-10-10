export interface Question {
  id: string
  text: string
  timeLimit: number
  points: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  thumbnailUrl?: string
  questions: Question[]
}

// Existing exports and type definitions

export interface GameResults {
  score: number
  totalQuestions: number
  timeSpent: number
  answers: Array<{
    questionId: string | number
    userAnswer: string | number
    correct: boolean
    timeSpent: number
  }>
}