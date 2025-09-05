
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function PublishModal() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    tag: "",
    description: "",
    category: "",
    level: "Beginner",
    difficulty: "Easy",
    visibility: "Public",
  })

  const handleSubmit = () => {
    console.log("Publishing quiz with:", formData)
    router.back()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-medium mb-4">Adding the final touches</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tag</label>
            <input
              type="text"
              placeholder="Tag name will add here"
              className="w-full p-3 border rounded-lg"
              value={formData.tag}
              onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              placeholder="Description"
              className="w-full p-3 border rounded-lg h-24 resize-none"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select category</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>
            <div className="flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-400 rounded mx-auto mb-1"></div>
                <span className="text-xs text-gray-600">Add Cover Image</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Level</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.level}
                onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.difficulty}
                onChange={(e) => setFormData((prev) => ({ ...prev, difficulty: e.target.value }))}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Visibility</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.visibility}
                onChange={(e) => setFormData((prev) => ({ ...prev, visibility: e.target.value }))}
              >
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={() => router.back()} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
