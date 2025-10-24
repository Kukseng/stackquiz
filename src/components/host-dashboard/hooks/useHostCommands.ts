// ============================================================================
// FILE: components/host-dashboard/hooks/useHostCommands.ts
// ============================================================================

import { useCallback } from "react"
import { getAuthHeaders, getApiBaseUrl } from "../utils/api"

interface UseHostCommandsProps {
  sessionCode: string
  onRefresh: () => void
  setAuthError: (error: string) => void
}

export const useHostCommands = ({ sessionCode, onRefresh, setAuthError }: UseHostCommandsProps) => {
  const sendCommand = useCallback(
    async (command: string, data?: any) => {
      if (!sessionCode) {
        console.error("❌ Cannot send command: No session code")
        return
      }

      const headers = await getAuthHeaders()
      if (!headers.Authorization) {
        setAuthError("No authentication token found. Please login first.")
        return
      }

      const baseUrl = getApiBaseUrl()

      try {
        let endpoint = ""
        let method = "POST"
        let body = null

        switch (command) {
          case "START_SESSION":
            if (data) {
              const timingEndpoint = `/v1/host/session/${sessionCode}/timing`
              const timingResponse = await fetch(`${baseUrl}${timingEndpoint}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(data),
              })
              if (!timingResponse.ok) {
                console.error("❌ Failed to update session timing:", timingResponse.statusText)
                return
              }
              console.log("✅ Session timing updated successfully")
            }
            endpoint = `/v1/quiz-sessions/${sessionCode}/start`
            method = "PUT"
            body = JSON.stringify(data)
            break

          case "PAUSE_SESSION":
            endpoint = `/v1/host/session/${sessionCode}/timer/pause`
            break

          case "RESUME_SESSION":
            endpoint = `/v1/host/session/${sessionCode}/timer/resume`
            break

          case "END_SESSION":
            endpoint = `/v1/quiz-sessions/${sessionCode}/end`
            method = "PUT"
            break

          case "NEXT_QUESTION":
            endpoint = `/v1/host/session/${sessionCode}/force-advance`
            break

          case "SET_QUESTION_TIME_LIMIT":
            endpoint = `/v1/host/session/${sessionCode}/question-time-limit?timeLimit=${data}`
            break

          default:
            console.warn("Unknown command:", command)
            return
        }

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method,
          headers,
          body,
        })

        if (response.ok) {
          console.log(`✅ Command ${command} executed successfully`)
          onRefresh()
        } else if (response.status === 401) {
          setAuthError("Authentication failed. Please login again.")
          console.error(`❌ Command ${command} failed: Authentication error`)
        } else {
          const errorText = await response.text().catch(() => response.statusText)
          console.error(`❌ Command ${command} failed:`, errorText)
          setAuthError(`Failed to execute command ${command}: ${response.status} ${response.statusText} - ${errorText}`)
        }
      } catch (error) {
        console.error(`❌ Error executing command ${command}:`, error)
        setAuthError(
          `An error occurred while executing ${command}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    },
    [sessionCode, onRefresh, setAuthError],
  )

  return {
    startSession: useCallback((settings: any) => sendCommand("START_SESSION", settings), [sendCommand]),
    pauseSession: useCallback(() => sendCommand("PAUSE_SESSION"), [sendCommand]),
    resumeSession: useCallback(() => sendCommand("RESUME_SESSION"), [sendCommand]),
    endSession: useCallback(() => sendCommand("END_SESSION"), [sendCommand]),
    nextQuestion: useCallback(() => sendCommand("NEXT_QUESTION"), [sendCommand]),
    setQuestionTimeLimit: useCallback((timeLimit: number) => sendCommand("SET_QUESTION_TIME_LIMIT", timeLimit), [sendCommand]),
  }
}