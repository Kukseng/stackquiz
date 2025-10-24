// ============================================================================
// FILE: components/host-dashboard/hooks/useParticipantProgress.ts
// ============================================================================

import { useEffect, useCallback, useState } from "react"
import { getAuthHeaders, getApiBaseUrl } from "../utils/api"
import type { DetailedParticipantProgress } from "../types"

export const useParticipantProgress = (sessionCode: string, sessionStatus?: string) => {
  const [detailedProgress, setDetailedProgress] = useState<DetailedParticipantProgress[]>([])

  const fetchDetailedProgress = useCallback(async () => {
    if (!sessionCode) return

    try {
      const headers = await getAuthHeaders()
      if (!headers.Authorization) return

      const baseUrl = getApiBaseUrl()
      const response = await fetch(`${baseUrl}/v1/host/session/${sessionCode}/participant-progress`, { headers })

      if (response.ok) {
        const data = await response.json()
        setDetailedProgress(data)
        console.log("📊 Detailed progress updated:", data)
      } else {
        console.error("❌ Failed to fetch detailed progress:", response.statusText)
      }
    } catch (error) {
      console.error("❌ Failed to fetch detailed progress:", error)
    }
  }, [sessionCode])

  useEffect(() => {
    if (sessionStatus === "IN_PROGRESS" && sessionCode) {
      fetchDetailedProgress()
      const interval = setInterval(fetchDetailedProgress, 3000)
      return () => clearInterval(interval)
    }
  }, [sessionStatus, sessionCode, fetchDetailedProgress])

  return { detailedProgress, refreshProgress: fetchDetailedProgress }
}