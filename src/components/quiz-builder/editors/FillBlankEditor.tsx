

"use client";
import React, { useState } from "react";

export default function FillBlankEditor() {
  const [sentence, setSentence] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <div className="p-6 bg-white shadow-md rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">Fill in the Blank Editor</h2>

      <textarea
        placeholder="Enter sentence with blank (use ___ for blank)"
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        className="w-full p-2 border rounded h-24"
      />

      <input
        type="text"
        placeholder="Correct Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
