// ============================================================================
// FILE: components/host-dashboard/hooks/useAuth.ts
// ============================================================================

import { useState, useEffect } from "react"
import { checkAuthToken } from "../utils/api"

export const useAuth = () => {
  const [authWarning, setAuthWarning] = useState(false)
  const [authError, setAuthError] = useState<string>("")

  useEffect(() => {
    const checkAuth = async () => {
      const hasToken = await checkAuthToken()
      if (!hasToken) {
        setAuthWarning(true)
      }
    }
    checkAuth()
  }, [])

  const validateAuth = async () => {
    const hasToken = await checkAuthToken()
    if (!hasToken) {
      setAuthError("Please login first to access the host dashboard")
      return false
    }
    setAuthError("")
    return true
  }

  return {
    authWarning,
    authError,
    setAuthError,
    validateAuth,
  }
}