"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ThemeSelectorProps {
  selectedTheme: string
  onThemeChange: (theme: string) => void
  onDurationChange?: (duration: number) => void
}

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


  useEffect(() => {
    if (!selectedTheme || selectedTheme === "") {
      onThemeChange("gray")
    }
  }, [])

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value)
    setSelectedDuration(value)
    onDurationChange?.(value)
  }

  return (
    <div className="w-60 h-screen bg-white/90 backdrop-blur-sm border-l border-gray-200 flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <h3 className="text-1xl font-bold text-gray-800 mb-6">Themes</h3>

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
            <div className="relative w-full h-24">
              <Image
                src={theme.image}
                alt={theme.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4 bg-white">
              <p className="font-bold text-gray-800 text-[12px] text-center">
                {theme.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}