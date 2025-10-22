"use client"

import { useState, useEffect } from "react"
import { FaCircle, FaSquare, FaDiamond } from "react-icons/fa6"
import { IoTriangle } from "react-icons/io5"
import { ImCheckmark2 } from "react-icons/im"
import Image from "next/image"
import { useSession } from "next-auth/react"

interface Option {
  id: string
  text: string
  correct: boolean
  color?: string
  icon?: string
}

interface Question {
  id: string
  type: string
  question: string
  options: Option[]
  imageUrl?: string 
  isNew?: boolean
}

interface QuizMainContentProps {
  questions: Question[]
  activeQuestionId: string | null
  thumbnailUrl: string
  onUpdateQuestionText: (questionId: string, text: string) => void
  onUpdateQuestionImage: (questionId: string, image: string) => void
  onUpdateThumbnailUrl: (url: string) => void
  onUpdateOptionText: (questionId: string, optionId: string, text: string) => void
  onToggleCorrectAnswer: (questionId: string, optionId: string) => void
  onDeleteQuestion: (id: string) => void
  onDuplicateQuestion: (question: Question) => void
  theme: string
}

const themeCardImages: Record<string, string> = {
  blue: "/background/10.png",
  pink: "/background/8.png",
  purple: "/background/3.png",
  green: "/background/5.png",
  gray: "/background/6.png",
}

const renderIcon = (icon?: string) => {
  switch (icon) {
    case "circle":
      return <FaCircle size={32} className="text-white mr-3 flex-shrink-0" />
    case "triangle":
      return <IoTriangle size={32} className="text-white mr-3 flex-shrink-0" />
    case "square":
      return <FaSquare size={32} className="text-white mr-3 flex-shrink-0" />
    case "diamond":
      return <FaDiamond size={32} className="text-white mr-3 flex-shrink-0" />
    default:
      return null
  }
}

export default function QuizMainContent({
  questions,
  activeQuestionId,
  thumbnailUrl,
  onUpdateQuestionText,
  onUpdateQuestionImage,
  onUpdateThumbnailUrl,
  onUpdateOptionText,
  onToggleCorrectAnswer,
  onDeleteQuestion,
  onDuplicateQuestion,
  theme,
}: QuizMainContentProps) {
  const { data: session } = useSession()
  const activeQuestion = questions?.find((q) => q.id === activeQuestionId)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const API = process.env.NEXT_PUBLIC_API_URL

  // ✅ Upload image using FormData (matching profile pattern exactly)
  const uploadImageToAPI = async (file: File): Promise<string> => {
    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image")
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB")
      }

      console.log(`📤 Uploading image: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`)

      // Create FormData and append file
      const formData = new FormData()
      formData.append("file", file)

      // Upload to API using FormData
      const response = await fetch(`${API}/medias/upload-single`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(session as any)?.apiAccessToken}`,
          // Don't set Content-Type - browser will set it automatically with boundary
        },
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = `Upload failed with status ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          const errorText = await response.text()
          if (errorText) errorMessage = errorText
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("✅ Upload response:", data)

      // Validate response has URI
      if (!data.uri) {
        throw new Error("Upload response missing URI")
      }

      console.log(`✅ Image uploaded successfully: ${data.uri}`)
      return data.uri
    } catch (error) {
      console.error("❌ Image upload error:", error)
      throw error instanceof Error ? error : new Error("Failed to upload image")
    }
  }

  const handleQuestionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !activeQuestion) return
    const file = e.target.files[0]

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB")
      return
    }

    try {
      setIsUploading(true)
      
      // Create local preview immediately for better UX
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)

      // Upload to get permanent URL
      const uploadedUrl = await uploadImageToAPI(file)
      
      // Update question with permanent URL
      onUpdateQuestionImage(activeQuestion.id, uploadedUrl)

      // Clear preview to show permanent image
      setPreviewImage(null)

      console.log("✅ Question image updated with URL:", uploadedUrl)
    } catch (error) {
      console.error("Failed to upload question image:", error)
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Clear preview on error
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
      setPreviewImage(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    if (!activeQuestion) return

    // Clean up preview URL if exists
    if (previewImage) {
      URL.revokeObjectURL(previewImage)
    }

    setPreviewImage(null)
    onUpdateQuestionImage(activeQuestion.id, "")
  }

  // Reset preview when question changes
  useEffect(() => {
    setPreviewImage(null)
  }, [activeQuestionId])

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB")
      return
    }

    try {
      setIsUploadingThumbnail(true)

      // Create local preview immediately for better UX
      const previewUrl = URL.createObjectURL(file)
      setThumbnailPreview(previewUrl)

      // Upload to get permanent URL
      const uploadedUrl = await uploadImageToAPI(file)

      // Update thumbnail
      onUpdateThumbnailUrl(uploadedUrl)

      console.log("✅ Thumbnail uploaded with URL:", uploadedUrl)
    } catch (error) {
      console.error("Failed to upload thumbnail:", error)
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Clear preview on error
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview)
      }
      setThumbnailPreview(null)
    } finally {
      setIsUploadingThumbnail(false)
    }
  }

  const handleRemoveThumbnail = () => {
    // Clean up preview URL if exists
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview)
    }

    setThumbnailPreview(null)
    onUpdateThumbnailUrl("")
  }

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview)
      }
    }
  }, [])

  return (
    <div className="w-full flex-1 flex items-center justify-center bg-gray-50 p-3 min-h-screen">
      <div
        className="w-full max-w-5xl rounded-2xl p-8 flex flex-col justify-center shadow-2xl bg-cover bg-center min-h-96"
        style={{ backgroundImage: `url(${themeCardImages[theme]})` }}
      >
        {!activeQuestion ? (
          <div className="flex flex-col items-center justify-center text-center text-white py-8">
            <h2 className="text-3xl font-bold mb-3">Quiz Thumbnail</h2>
            <p className="text-lg text-white/90 mb-8">
              Upload a cover image for your quiz
            </p>

            {/* Thumbnail Upload */}
            <div className="mb-8 flex flex-col items-center">
              {isUploadingThumbnail && (
                <div className="mb-4 p-3 bg-blue-50/80 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                    <p className="text-blue-700 text-sm font-medium">Uploading thumbnail...</p>
                  </div>
                </div>
              )}
              {thumbnailPreview || thumbnailUrl ? (
                <div className="relative w-full max-w-md rounded-2xl overflow-hidden group">
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white/40">
                    <Image
                      src={thumbnailPreview || thumbnailUrl || ""}
                      alt="Quiz Thumbnail"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    onClick={handleRemoveThumbnail}
                    disabled={isUploadingThumbnail}
                    className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full max-w-md">
                  <div className="border-4 border-dashed border-white/50 hover:border-white/80 rounded-2xl p-8 bg-white/10 hover:bg-white/20 transition-all flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-white mb-1">Add quiz thumbnail</p>
                      <p className="text-white/70 text-sm">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    disabled={isUploadingThumbnail}
                  />
                </label>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">No question selected</h3>
              <p className="text-white/90">
                Please select a question from the sidebar or add a new one.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Question Text Input */}
            <input
              type="text"
              value={activeQuestion.question}
              onChange={(e) => onUpdateQuestionText(activeQuestion.id, e.target.value)}
              placeholder="Enter your question..."
              className="w-full text-center text-2xl font-semibold p-4 mb-6 rounded-xl border-2 text-gray-900 bg-white border-yellow-400 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            {/* Image Upload + Preview */}
            <div className="mb-8 flex flex-col items-center">
              {isUploading && (
                <div className="mb-4 p-3 bg-blue-50/80 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                    <p className="text-blue-700 text-sm font-medium">Uploading image...</p>
                  </div>
                </div>
              )}
              {previewImage || activeQuestion.imageUrl ? (
                <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden group">
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white/40">
                    <Image
                      src={previewImage || activeQuestion.imageUrl || ""}
                      alt="Question"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                    className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full max-w-2xl">
                  <div className="border-4 border-dashed border-white/50 hover:border-white/80 rounded-2xl p-12 bg-white/10 hover:bg-white/20 transition-all flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold text-white mb-1">Add cover image</p>
                      <p className="text-white/70 text-sm">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQuestionImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {activeQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-5 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-102"
                  style={{ backgroundColor: option.color || "#3B82F6" }}
                >
                  <div className="flex items-center w-full gap-3">
                    {renderIcon(option.icon)}
                    <input
                      placeholder="Option"
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        onUpdateOptionText(activeQuestion.id, option.id, e.target.value)
                      }
                      className="bg-transparent w-full text-white text-lg font-semibold placeholder-white/70 border-none outline-none"
                    />
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center border-3 transition-all hover:scale-110 ${
                      option.correct ? "bg-green-500 border-green-600 shadow-lg" : "bg-white/30 border-white"
                    } cursor-pointer`}
                    onClick={() => onToggleCorrectAnswer(activeQuestion.id, option.id)}
                  >
                    {option.correct && <ImCheckmark2 className="text-white w-6 h-6" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => onDeleteQuestion(activeQuestion.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg text-lg transition-all hover:shadow-xl active:scale-95"
              >
                Delete
              </button>
              <button
                onClick={() => onDuplicateQuestion(activeQuestion)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg text-lg transition-all hover:shadow-xl active:scale-95"
              >
                Duplicate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}