
// ============================================
// THEME SELECTOR COMPONENT
// ============================================
"use client"

import { useState } from "react"
import Image from "next/image"

interface ThemeSelectorProps {
  selectedTheme: string
  onThemeChange: (theme: string) => void
  onDurationChange?: (duration: number) => void
}

const timeLimits = [
  { label: "5s", value: 5 },
  { label: "6s", value: 6 },
  { label: "7s", value: 7 },
  { label: "8s", value: 8 },
  { label: "9s", value: 9 },
  { label: "10s", value: 10 },
  { label: "15s", value: 15 },
  { label: "20s", value: 20 },
  { label: "30s", value: 30 },
]

const themes = [
  { id: "blue", name: "Blue Sky", image: "/background/10.png" },
  { id: "pink", name: "Pink Love", image: "/background/8.png" },
  { id: "purple", name: "Purple Night", image: "/background/3.png" },
  { id: "green", name: "Green Forest", image: "/background/5.png" },
  { id: "gray", name: "Gray Stone", image: "/background/6.png" },
]

export default function ThemeSelector({
  selectedTheme,
  onThemeChange,
  onDurationChange,
}: ThemeSelectorProps) {
  const [selectedDuration, setSelectedDuration] = useState(20)

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value)
    setSelectedDuration(value)
    onDurationChange?.(value)
  }

  return (
    <div className="w-80 h-screen bg-white/90 backdrop-blur-sm border-l border-gray-200 flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Themes</h3>

      {/* Scrollable Themes */}
      <div className="space-y-4 overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 mb-6">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`w-full rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
              selectedTheme === theme.id
                ? "ring-4 ring-blue-500 shadow-2xl scale-105"
                : "hover:shadow-lg hover:ring-2 hover:ring-gray-300"
            }`}
          >
            <div className="relative w-full h-44">
              <Image
                src={theme.image}
                alt={theme.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4 bg-white">
              <p className="font-bold text-gray-800 text-lg text-center">{theme.name}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 pt-6 mb-6"></div>

      {/* Duration Selector */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Time Duration</h3>
        <select
          value={selectedDuration}
          onChange={handleDurationChange}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-semibold"
        >
          {timeLimits.map((limit) => (
            <option key={limit.value} value={limit.value}>
              {limit.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}