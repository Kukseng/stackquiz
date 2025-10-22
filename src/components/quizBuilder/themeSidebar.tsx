"use client";

import { useState } from "react";
import Image from "next/image";

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  onDurationChange?: (duration: number) => void;
}

// 👇 Match backend enum TimeLimitRangeInSecond
const timeLimits = [
  { label: "FIVE", value: 5 },
  { label: "SIX", value: 6 },
  { label: "SEVEN", value: 7 },
  { label: "EIGHT", value: 8 },
  { label: "NINE", value: 9 },
  { label: "TEN", value: 10 },
  { label: "FIFTEEN", value: 15 },
  { label: "TWENTY", value: 20 },
  { label: "THIRTY", value: 30 },
];

const themes = [
  { id: "blue", name: "Blue Sky", image: "/background/10.png" },
  { id: "pink", name: "Pink Love", image: "/background/8.png" },
  { id: "purple", name: "Purple Night", image: "/background/3.png" },
  { id: "green", name: "Green Forest", image: "/background/5.png" },
  { id: "gray", name: "Gray Stone", image: "/background/6.png" },
];

export default function ThemeSelector({
  selectedTheme,
  onThemeChange,
  onDurationChange,
}: ThemeSelectorProps) {
  const [selectedDuration, setSelectedDuration] = useState(timeLimits[0].value);

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSelectedDuration(value);
    onDurationChange?.(value);
  };

  return (
    <div className="w-80 h-screen bg-white/80 backdrop-blur-md p-6 border-l border-gray-200 flex flex-col">
      {/* Header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Themes</h3>

      {/* Scrollable Themes */}
      <div className="space-y-4 overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`w-full rounded-xl overflow-hidden transition-all duration-200 ${
              selectedTheme === theme.id
                ? "ring-4 ring-blue-500 shadow-lg scale-[1.02]"
                : "hover:shadow-md hover:scale-[1.01]"
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

      {/* Duration Selector (sticky bottom) */}
      <div className="pt-4 border-t border-gray-200 sticky bottom-0 bg-white/90 backdrop-blur-md mt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Time Duration</h3>
        <select
          value={selectedDuration}
          onChange={handleDurationChange}
          className="w-full p-2 border rounded-md"
        >
          {timeLimits.map((limit) => (
            <option key={limit.value} value={limit.value}>
              {limit.label} ({limit.value}s)
            </option>
          ))}
          console.log(${selectedDuration}s selected);
        </select>
      </div>
    </div>
  );
}
