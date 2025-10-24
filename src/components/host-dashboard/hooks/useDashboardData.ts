// ============================================================================
// FILE: components/host-dashboard/hooks/useDashboardData.ts
// ============================================================================

import { useCallback } from "react"
import { getAuthHeaders, getApiBaseUrl } from "../utils/api"
import type { HostDashboardData } from "../types"

export const useDashboardData = (
  sessionCode: string,
  setHostDashboard: (data: HostDashboardData | null) => void,
  setAuthError: (error: string) => void,
  setSessionId: (id: string) => void,
) => {
  const fetchHostDashboard = useCallback(async () => {
    if (!sessionCode) return

    try {
      const headers = await getAuthHeaders()
      if (!headers.Authorization) {
        setAuthError("No authentication token found. Please login first.")
        return
      }

      const baseUrl = getApiBaseUrl()
      console.log("📊 Fetching host dashboard for session:", sessionCode)

      const response = await fetch(`${baseUrl}/v1/host/dashboard/${sessionCode}`, {
        headers,
      })

      if (response.ok) {
        const dashboardData = await response.json()
        console.log("📊 Host dashboard data:", dashboardData)
        setHostDashboard(dashboardData)

        if (dashboardData.sessionId) {
          setSessionId(dashboardData.sessionId)
        }
      } else if (response.status === 404) {
        console.error("❌ Session not found:", sessionCode)
        setAuthError(`Session ${sessionCode} not found`)
      } else {
        console.error("❌ Failed to fetch host dashboard:", response.statusText)
        const errorDetails = await response.text().catch(() => "No details available")
        setAuthError(`Failed to load dashboard: ${response.status} ${response.statusText} - ${errorDetails}`)
      }
    } catch (error) {
      console.error("❌ Failed to fetch host dashboard:", error)
      setAuthError(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [sessionCode, setHostDashboard, setAuthError, setSessionId])

  return { fetchHostDashboard }
}