// constants/config.ts

export const WEBSOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "https://stackquiz-api.stackquiz.me/ws",
  reconnectDelay: 3000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  maxReconnectAttempts: 5,
}

export const API_BASE_URL = "https://stackquiz-api.stackquiz.me/api/v1"

export const ANIMATION_DELAYS = {
  ANSWER_REVEAL: 1000,
  STATS_DISPLAY: 500,
  AUTO_CONTINUE: 2000,
  CELEBRATION_DURATION: 3000,
}

export const TIMER_CONFIG = {
  DEFAULT_LIMIT: 30,
  WARNING_THRESHOLD: 5,
  CRITICAL_THRESHOLD: 3,
}