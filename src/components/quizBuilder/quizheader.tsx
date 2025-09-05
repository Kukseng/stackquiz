"use client"

interface QuizHeaderProps {
  questions: unknown[]
  onPublish: () => void
  onSave: () => void
  onExit: () => void
}

export function QuizHeader({ onPublish, onSave, onExit }: QuizHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div></div>
      <div className="flex items-center space-x-3">

        {/* Publish */}
        <button
          onClick={onPublish}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Publish
        </button>

        {/* Exit */}
        <button
          onClick={onExit}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Exit
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
}
