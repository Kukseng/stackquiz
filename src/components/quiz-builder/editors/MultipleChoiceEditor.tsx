

"use client";
import React, { useState } from "react";

interface Option {
  id: number;
  text: string;
}

export default function MultipleChoiceEditor() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);
  const [correctOption, setCorrectOption] = useState<number | null>(null);

  const handleOptionChange = (id: number, value: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, text: value } : opt))
    );
  };

  const addOption = () => {
    setOptions([...options, { id: Date.now(), text: "" }]);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">Multiple Choice Editor</h2>

      <input
        type="text"
        placeholder="Enter question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <div className="space-y-2">
        {options.map((option, idx) => (
          <div key={option.id} className="flex items-center gap-2">
            <input
              type="radio"
              name="correct"
              checked={correctOption === option.id}
              onChange={() => setCorrectOption(option.id)}
            />
            <input
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={option.text}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="flex-1 p-2 border rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={addOption}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Add Option
      </button>
    </div>
  );
}
