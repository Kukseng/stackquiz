"use client"

export function QuizHeader() {
  const handlePublish = (type: string) => {
    window.history.pushState({}, "", `/quiz-builder/publish?type=${type}`)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div></div>
      <div className="flex items-center space-x-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Button
        </button>

        <button
          onClick={() => handlePublish("public")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Public
        </button>

        <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Exit
        </button>

        <button
          onClick={() => handlePublish("save")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
}
