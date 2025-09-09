"use client";

import { useState } from "react";

interface ThemeSidebarProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  onDurationChange?: (duration: number) => void; // optional callback
}

const durations = [5, 10, 20, 30, 40, 50];

const themes = [
  { id: "blue", label: "Blue Sky", image: "/background/10.png" },
  { id: "pink", label: "Pink Love", image: "/background/8.png" },
  { id: "purple", label: "Purple Night", image: "/background/3.png" },
  { id: "green", label: "Green Nature", image: "/background/5.png" },
  { id: "gray", label: "Neutral Gray", image: "/background/6.png" },
];

export function ThemeSidebar({
  selectedTheme,
  onThemeChange,
  onDurationChange,
}: ThemeSidebarProps) {
  const [selectedDuration, setSelectedDuration] = useState(durations[0]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSelectedDuration(value);
    onDurationChange?.(value);
  };

  return (
    <div className="w-64 h-screen overflow-y-auto p-4 border-l border-gray-200 bg-white">
      <h2 className="text-gray-700 font-bold mb-4">Themes</h2>

      <div className="space-y-3 mb-6">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`w-full text-left p-3 rounded-lg shadow-sm transition-all ${
              selectedTheme === theme.id
                ? "ring-2 ring-blue-500"
                : "hover:ring-1 hover:ring-gray-300"
            }`}
          >
            <div
              className="h-32 w-full rounded-md bg-cover bg-center"
              style={{ backgroundImage: `url(${theme.image})` }}
            ></div>
            <div className="mt-2 text-sm font-medium text-gray-600">
              {theme.label}
            </div>
          </button>
        ))}
      </div>

      {/* Duration Selector */}
      <div className="mt-auto">
        <label className="block text-gray-600 font-medium mb-2">
          Theme Duration
        </label>
        <select
          value={selectedDuration}
          onChange={handleDurationChange}
          className="w-full p-2 border rounded-md"
        >
          {durations.map((d) => (
            <option key={d} value={d}>
              {d} seconds
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
