

"use client";
import React, { useState } from "react";

export default function TrueFalseEditor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<boolean | null>(null);

  return (
    <div className="p-6 bg-white shadow-md rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">True/False Editor</h2>

      <input
        type="text"
        placeholder="Enter question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={answer === true}
            onChange={() => setAnswer(true)}
          />
          True
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={answer === false}
            onChange={() => setAnswer(false)}
          />
          False
        </label>
      </div>
    </div>
  );
}
