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
