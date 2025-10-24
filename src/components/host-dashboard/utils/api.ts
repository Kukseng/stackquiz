// ============================================================================
// FILE: components/host-dashboard/utils/api.ts
// ============================================================================

import { getSession } from "next-auth/react"

export const getAuthHeaders = async () => {
  try {
    const session = await getSession()
    const token = (session as any)?.apiAccessToken

    if (!token) {
      console.warn("⚠️ No authentication token found in session. Please login first.")
      return {}
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  } catch (error) {
    console.error("❌ Error getting session:", error)
    return {}
  }
}

export const checkAuthToken = async () => {
  try {
    const session = await getSession()
    const token = (session as any)?.apiAccessToken
    return !!token
  } catch (error) {
    console.error("❌ Error checking auth token:", error)
    return false
  }
}

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