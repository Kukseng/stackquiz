"use client"
import { useState } from "react"

interface Option {
  id: number
  text: string
  correct: boolean
  color: string
}

interface Question {
  id: number
  type: string
  question: string
  options: Option[]
}

interface PublishModalProps {
  onClose: () => void
  quizData: Question[]
}

export default function PublishModal({ onClose, quizData }: PublishModalProps) {
  const [formData, setFormData] = useState({
    tag: "",
    description: "",
    category: "",
    level: "Beginner",
    difficulty: "Easy",
    visibility: "Public",
  })

  const handleSubmit = () => {
    console.log("Publishing quiz:", { formData, questions: quizData })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-medium mb-4">Adding the final touches</h3>

        {/* Tag */}
        <input
          type="text"
          placeholder="Tag"
          className="w-full p-3 border rounded-lg mb-3"
          value={formData.tag}
          onChange={e => setFormData(prev => ({ ...prev, tag: e.target.value }))}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          className="w-full p-3 border rounded-lg mb-3 h-20"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />

        {/* Category */}
        <select
          className="w-full p-3 border rounded-lg mb-3"
          value={formData.category}
          onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">Select category</option>
          <option value="education">Education</option>
          <option value="entertainment">Entertainment</option>
          <option value="science">Science</option>
          <option value="technology">Technology</option>
          <option value="history">History</option>
          <option value="sports">Sports</option>
          <option value="music">Music</option>
        </select>

        {/* Difficulty */}
        <select
          className="w-full p-3 border rounded-lg mb-3"
          value={formData.difficulty}
          onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Visibility */}
        <select
          className="w-full p-3 border rounded-lg mb-3"
          value={formData.visibility}
          onChange={e => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
        >
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={handleSubmit}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
