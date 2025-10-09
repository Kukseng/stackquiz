"use client"

import { useState } from "react"
import Image from "next/image"

interface ThemeSelectorProps {
  selectedTheme: string
  onThemeChange: (theme: string) => void
  onDurationChange?: (duration: number) => void
}

const durations = [5, 10, 15, 20, 25,  30,]

const themes = [
  { id: "blue", name: "Blue Sky", image: "/background/10.png" },
  { id: "pink", name: "Pink Love", image: "/background/8.png" },
  { id: "purple", name: "Purple Night", image: "/background/3.png" },
  { id: "green", name: "Green Forest", image: "/background/5.png" },
  { id: "gray", name: "Gray Stone", image: "/background/6.png" },
]

export default function ThemeSelector({ selectedTheme, onThemeChange, onDurationChange }: ThemeSelectorProps) {
  const [selectedDuration, setSelectedDuration] = useState(durations[0])

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value)
    setSelectedDuration(value)
    onDurationChange?.(value)
  }

  return (
    <div className="w-80 bg-white/80 backdrop-blur-md h-full p-6 border-l border-gray-200 flex flex-col">

             {/* Duration Selector (sticks at bottom) */}
      <div className="mt-4 ">
 
          <h3 className="text-xl font-bold text-gray-800 mb-4"> Time Duration</h3>
        <select
          value={selectedDuration}
          onChange={handleDurationChange}
          className="w-full p-2 border rounded-md mb-4"
        >
          {durations.map((d) => (
            <option key={d} value={d}>
              {d} seconds
            </option>
          ))}
        </select>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Themes</h3>
       
      {/* Scrollable vertical list */}
      <div className="space-y-4 overflow-y-auto flex-grow pr-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`w-full rounded-xl overflow-hidden transition-all ${
              selectedTheme === theme.id ? "ring-4 ring-blue-500 shadow-lg" : "hover:shadow-md"
            }`}
          >
            <div className="relative w-full h-40">
              <Image
                src={theme.image}
                alt={theme.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-3 bg-white">
              <p className="font-medium text-gray-800">{theme.name}</p>
            </div>
          </button>
        ))}
      </div>


    </div>
  )
}
