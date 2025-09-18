import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const loadAuthFromStorage = (): AuthState => {
  if (typeof window === "undefined") {
    return {

      user: null,
      token: null,
      isAuthenticated: false,
    }
  }

  try {
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("auth_user")

    if (token && userData) {
      const user = JSON.parse(userData)
      return {
        user,
        token,
        isAuthenticated: true,
      }
    }
  } catch (error) {
    console.error(" Error loading auth from localStorage:", error)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
  }
}

const initialState: AuthState = loadAuthFromStorage()

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("auth_token", token)
          localStorage.setItem("auth_user", JSON.stringify(user))
          console.log(" Auth data saved to localStorage")
        } catch (error) {
          console.error(" Error saving auth to localStorage:", error)
        }
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("auth_token")
          localStorage.removeItem("auth_user")
          console.log("Auth data cleared from localStorage")
        } catch (error) {
          console.error(" Error clearing auth from localStorage:", error)
        }
      }
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
