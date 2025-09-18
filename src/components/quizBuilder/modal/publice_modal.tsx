"use client"
import { useState, useEffect } from "react"
import Image from "next/image"

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

// Updated Category interface to match API response
interface Category {
  id: string // Changed from number to string
  name: string
  description: string // Added description field from API
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
    coverImage: null as File | null,
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // 🔹 Fetch categories from API when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        setCategoryError(null)
        
        console.log("Fetching categories...")
        const res = await fetch("https://stackquiz-api.stackquiz.me/api/v1/categories", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`)
        }
        
        const data: Category[] = await res.json()
        console.log("Categories fetched:", data)
        
        // The API returns an array directly, not wrapped in a data property
        setCategories(data)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setCategoryError(err instanceof Error ? err.message : "Failed to load categories")
      } finally {
        setLoadingCategories(false)
      }
    }
    
    fetchCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB")
        return
      }
      
      setFormData(prev => ({ ...prev, coverImage: file }))
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Image size must be less than 5MB")
          return
        }
        setFormData(prev => ({ ...prev, coverImage: file }))
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        alert("Please drop a valid image file")
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setFormData(prev => ({ ...prev, coverImage: null }))
    setPreviewUrl(null)
  }

  const handleSubmit = () => {
    // Basic validation
    if (!formData.tag.trim()) {
      alert("Please enter a quiz tag")
      return
    }
    if (!formData.description.trim()) {
      alert("Please enter a quiz description")
      return
    }
    if (!formData.category) {
      alert("Please select a category")
      return
    }

    console.log("Publishing quiz:", { 
      formData, 
      questions: quizData,
      selectedCategory: categories.find(cat => cat.id === formData.category)
    })
    
    // Here you would typically make an API call to publish the quiz
    onClose()
  }

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Publish Quiz
            </h3>
            <p className="text-gray-500 text-sm mt-1">Add the final touches to your quiz</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cover Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Cover Image
          </label>
          {previewUrl ? (
            <div className="relative group">
              <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-gray-200">
                <Image
                  src={previewUrl}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-purple-400 bg-purple-50"
                  : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 mb-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Drop an image here</p>
              <p className="text-gray-400 text-sm">or click to browse</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG up to 5MB</p>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Tag */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="tag">
              Tag *
            </label>
            <input
              id="tag"
              type="text"
              placeholder="Enter a quiz tag"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={formData.tag}
              onChange={e => setFormData(prev => ({ ...prev, tag: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
              Description *
            </label>
            <textarea
              id="description"
              placeholder="Describe your quiz"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-20"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Category - FIXED */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="category">
              Category *
            </label>
            <select
              id="category"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Select a category</option>
              {loadingCategories ? (
                <option disabled>Loading categories...</option>
              ) : categoryError ? (
                <option disabled>Error loading categories</option>
              ) : categories.length === 0 ? (
                <option disabled>No categories available</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
            {categoryError && (
              <p className="text-red-500 text-sm mt-1">
                Failed to load categories. Please try again.
              </p>
            )}
            {!loadingCategories && !categoryError && (
              <p className="text-gray-500 text-sm mt-1">
                {categories.length} categories available
              </p>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Difficulty Level
            </label>
            <div className="flex space-x-3">
              {["Easy", "Medium", "Hard"].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                    formData.difficulty === level
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Visibility
            </label>
            <div className="flex space-x-3">
              {[
                { value: "Public", icon: "🌍", desc: "Everyone can see" },
                { value: "Private", icon: "🔒", desc: "Only you can see" },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, visibility: option.value }))}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    formData.visibility === option.value
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="font-medium text-gray-800">{option.value}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-8">
          <button
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            onClick={handleSubmit}
          >
            Publish Quiz
          </button>
        </div>
      </div>
    </div>
  )
}