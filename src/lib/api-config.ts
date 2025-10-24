export const getWebSocketUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "https://stackquiz-api.stackquiz.me/ws"
    }
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    const wsUrl = apiUrl
      .replace(/\/api\/v1\/?$/, "")
      .replace(/\/api\/?$/, "")
      .replace(/\/v1\/?$/, "")
    return `${wsUrl}/ws`
  }
  return "https://stackquiz-api.stackquiz.me/ws"
}

export const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "https://stackquiz-api.stackquiz.me/api"
    }
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "https://stackquiz-api.stackquiz.me/api"
  return envUrl.replace(/\/v1\/?$/, "")
}

export const safeJsonParse = (jsonString: string, fallback: any = null) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("JSON parse error:", error)
    return fallback
  }
}
