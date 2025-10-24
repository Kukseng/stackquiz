"use client"

import { useState } from "react"
import axios from "axios"
import NicknameEntry from "./nickname-entry"
import AvatarCarousel from "./avatar-carousel"

interface Avatar {
  id: number
  avatarNo: number
  name: string
  modelUrl: string
}

interface JoinFlowProps {
  sessionCode: string
  onJoinSuccess: (participantData: {
    id: string
    nickname: string
    avatarId: string
    totalScore: number
  }) => void
}

export default function JoinFlow({ sessionCode, onJoinSuccess }: JoinFlowProps) {
  const [step, setStep] = useState<"nickname" | "avatar">("nickname")
  const [nickname, setNickname] = useState("")
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false)
  const [error, setError] = useState("")

  // Handle nickname submission
  const handleNicknameSubmit = async (submittedNickname: string) => {
    setNickname(submittedNickname)
    setIsLoadingAvatars(true)
    setError("")

    try {
      // Fetch available avatars
      const response = await axios.get("https://stackquiz-api.stackquiz.me/api/v1/avatars")
      setAvatars(response.data || [])
      setStep("avatar")
    } catch (err: any) {
      console.error("Failed to fetch avatars:", err)
      setError("Failed to load avatars. Please try again.")
      // Fallback to default avatars if API fails
      setAvatars([
        {
          id: 2,
          avatarNo: 1,
          name: "Default",
          modelUrl: "/models/spider-dance.glb",
        },
        {
          id: 3,
          avatarNo: 2,
          name: "Fox",
          modelUrl: "/models/boxing-girl.glb",
        },
      ])
      setStep("avatar")
    } finally {
      setIsLoadingAvatars(false)
    }
  }

  // Handle avatar selection and join
  const handleAvatarSelect = async (avatarId: number) => {
    setError("")

    try {
      const response = await axios.post("https://stackquiz-api.stackquiz.me/api/v1/participants/join", {
        quizCode: sessionCode,
        nickname: nickname,
        avatarId: String(avatarId),
      })

      console.log("✅ Successfully joined:", response.data)
      onJoinSuccess({
        id: response.data.id,
        nickname: nickname,
        avatarId: String(avatarId),
        totalScore: response.data.totalScore || 0,
      })
    } catch (err: any) {
      console.error("❌ Join failed:", err)
      setError(err.response?.data?.message || "Failed to join session. Please try again.")
      // Go back to nickname step on error
      setStep("nickname")
    }
  }

  // Handle back navigation
  const handleBack = () => {
    setStep("nickname")
  }

  if (isLoadingAvatars) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <p className="text-white text-xl font-semibold">Loading avatars...</p>
        </div>
      </div>
    )
  }

  if (step === "nickname") {
    return <NicknameEntry sessionCode={sessionCode} onSubmit={handleNicknameSubmit} />
  }

  if (step === "avatar") {
    return <AvatarCarousel avatars={avatars} onSelect={handleAvatarSelect} onBack={handleBack} />
  }

  return null
}
