"use client";

import React, { useState } from "react";
import { useCreateQuizMutation } from "@/lib/api/quizApi";
import { useCreateQuestionMutation } from "@/lib/api/questionApi";
import { useAddOptionsToQuestionMutation } from "@/lib/api/optionApi";

type QType = "MCQ" | "TF";

interface OptionForm {
  optionText: string;
  isCorrected: boolean; // <- align with API
}

interface QuestionForm {
  text: string;
  type: QType;          // <- only MCQ/TF supported by your API
  points: number;
  timeLimit: number;    // <- required by API
  options: OptionForm[]; // used for MCQ/TF
}

export default function CreateQuizForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");

  const [questions, setQuestions] = useState<QuestionForm[]>([]);

  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState<QType>("MCQ");
  const [newPoints, setNewPoints] = useState(1);
  const [newTimeLimit, setNewTimeLimit] = useState(30); // seconds (example)
  const [newOptions, setNewOptions] = useState<OptionForm[]>([]); // for MCQ/TF

  const [createQuiz] = useCreateQuizMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const [addOptionsToQuestion] = useAddOptionsToQuestionMutation();

  const addOption = () => {
    setNewOptions([...newOptions, { optionText: "", isCorrected: false }]);
  };

  const handleOptionChange = (index: number, field: keyof OptionForm, value: any) => {
    const updated = [...newOptions];
    updated[index][field] = value;
    setNewOptions(updated);
  };

  const addQuestion = () => {
    const question: QuestionForm = {
      text: newQuestionText.trim(),
      type: newQuestionType,
      points: newPoints,
      timeLimit: newTimeLimit,
      options: newQuestionType === "MCQ" || newQuestionType === "TF" ? newOptions : [],
    };
    setQuestions((prev) => [...prev, question]);

    // reset inputs
    setNewQuestionText("");
    setNewQuestionType("MCQ");
    setNewPoints(1);
    setNewTimeLimit(30);
    setNewOptions([]);
  };

  const handleSubmit = async () => {
    try {
      // 1) Create Quiz
      const quiz = await createQuiz({
        title,
        description,
        thumbnailUrl: "",
        visibility: "PUBLIC",
      }).unwrap();

      const quizId = (quiz as any).id as string;

      // 2) Create Questions
      for (const q of questions) {
        const createdQ = await createQuestion({
          quizId,
          text: q.text,
          type: q.type,            // "MCQ" | "TF"
          timeLimit: q.timeLimit,  // required
          points: q.points,
          imageUrl: "",
        }).unwrap();

        const questionId = (createdQ as any).id as string;

        // 3) Create Options (MCQ/TF)
        if (q.type === "MCQ" || q.type === "TF") {
          const optionsPayload = q.options.map((opt, idx) => ({
            optionText: opt.optionText,
            optionOrder: idx + 1,     // required by your API model
            isCorrected: opt.isCorrected,
            // questionId not needed in body since it's in the URL
          }));
          await addOptionsToQuestion({ questionId, data: optionsPayload }).unwrap();
        }
      }

      alert("Quiz created successfully!");
      setTitle("");
      setDescription("");
      setQuestions([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz!");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Create Quiz</h1>

      <div className="space-y-2">
        <label className="block font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
          className="border px-3 py-2 rounded"
        >
          <option value="EASY">EASY</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HARD">HARD</option>
        </select>
      </div>

      <hr />

      <h2 className="text-xl font-semibold">Add Question</h2>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Question text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <select
          value={newQuestionType}
          onChange={(e) => setNewQuestionType(e.target.value as QType)}
          className="border px-3 py-2 rounded"
        >
          <option value="MCQ">Multiple Choice</option>
          <option value="TF">True / False</option>
        </select>

        <div className="flex items-center gap-3">
          <input
            type="number"
            value={newPoints}
            onChange={(e) => setNewPoints(Number(e.target.value))}
            placeholder="Points"
            className="w-24 border px-3 py-2 rounded"
            min={1}
          />
          <input
            type="number"
            value={newTimeLimit}
            onChange={(e) => setNewTimeLimit(Number(e.target.value))}
            placeholder="Time limit (sec)"
            className="w-40 border px-3 py-2 rounded"
            min={5}
          />
        </div>
      </div>

      {(newQuestionType === "MCQ" || newQuestionType === "TF") && (
        <div className="space-y-2 mt-2">
          <h3 className="font-semibold">Options</h3>
          {newOptions.map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                value={opt.optionText}
                onChange={(e) => handleOptionChange(idx, "optionText", e.target.value)}
                placeholder={`Option #${idx + 1}`}
                className="border px-3 py-1 rounded flex-1"
              />
              <label className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={opt.isCorrected}
                  onChange={(e) => handleOptionChange(idx, "isCorrected", e.target.checked)}
                />
                <span>Correct</span>
              </label>
            </div>
          ))}
          <button type="button" onClick={addOption} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
            Add Option
          </button>
        </div>
      )}

      <button type="button" onClick={addQuestion} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
        Add Question
      </button>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Questions List</h2>
        {questions.map((q, idx) => (
          <div key={idx} className="border p-2 rounded mt-2">
            <p>
              <strong>{q.text}</strong> ({q.type}) — {q.points} pts — {q.timeLimit}s
            </p>
            {q.options.length > 0 && (
              <ul className="ml-4 list-disc">
                {q.options.map((o, i) => (
                  <li key={i}>
                    {o.optionText} {o.isCorrected && "(Correct)"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create Quiz
      </button>
    </div>
  );
}
