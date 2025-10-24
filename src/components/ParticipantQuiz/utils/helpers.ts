// utils/helpers.ts

export const safeJsonParse = (jsonString: string, fallback: any = null) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("JSON parse error:", error)
    return fallback
  }
}

export const getRankSuffix = (rank: number): string => {
  if (rank === 1) return "st"
  if (rank === 2) return "nd"
  if (rank === 3) return "rd"
  return "th"
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
}

export const calculateAccuracy = (correct: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export const getMedalEmoji = (rank: number): string => {
  if (rank === 1) return "🥇"
  if (rank === 2) return "🥈"
  if (rank === 3) return "🥉"
  return "🏅"
}