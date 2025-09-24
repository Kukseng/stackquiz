"use client"

import { useState } from "react"
import { useCreateQuizMutation, QuizRequest } from "@/lib/api/quizApi"

export default function CreateQuiz() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE" | "UNLISTED">("PUBLIC")
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY")
  const [categoryIds, setCategoryIds] = useState<string[]>([])

  const [createQuiz, { isLoading }] = useCreateQuizMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description) return alert("Title and description are required!")

    const payload: QuizRequest = {
      title,
      description,
      thumbnailUrl,
      visibility,
    }

    try {
      const result = await createQuiz(payload).unwrap()
      alert(`Quiz created successfully! ID: ${result.id}`)
      setTitle("")
      setDescription("")
      setThumbnailUrl("")
      setVisibility("PUBLIC")
      setDifficulty("EASY")
      setCategoryIds([])
    } catch (err) {
      console.error(err)
      alert("Failed to create quiz")
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 rounded"
        />
        <input
          type="text"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="Thumbnail URL"
          className="border p-2 rounded"
        />
        <input
          type="text"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as "PUBLIC" | "PRIVATE" | "UNLISTED")}
          placeholder="Visibility"
          className="border p-2 rounded"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")}
          aria-label="Select difficulty"
          className="border p-2 rounded"
        >
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <input
          type="text"
          value={categoryIds.join(",")}
          onChange={(e) => setCategoryIds(e.target.value.split(","))}
          placeholder="Category IDs (comma separated)"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isLoading ? "Creating..." : "Create Quiz"}
        </button>
      </form>
    </div>
  )
}
