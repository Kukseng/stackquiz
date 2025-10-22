"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface Option {
  id: string;
  text: string;
  correct: boolean;
  color?: string;
  icon?: string;
}

interface Question {
  id: string;
  type: string;
  question: string;
  options: Option[];
  imageUrl?: string;
  timeLimit?: number;
}

interface QuizHeaderProps {
  questions: Question[];
  onPublish: () => void;
  quizId?: string;
}

export function QuizHeader({ questions, onPublish, quizId }: QuizHeaderProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const saveDraft = async () => {
    if (questions.length === 0) {
      return null;
    }

    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stackquiz-api.stackquiz.me/api/v1';

      // Transform questions to API format
      const apiQuestions = questions.map((q, index) => ({
        id: q.id,
        text: q.question,
        type: (q.type.toUpperCase() as "MCQ" | "TF"),
        questionOrder: index + 1,
        timeLimit: q.timeLimit || 20,
        points: 1,
        imageUrl: q.imageUrl || null,
        options: q.options.map((o, oIndex) => ({
          id: o.id,
          optionText: o.text,
          optionOrder: oIndex + 1,
          createdAt: null,
          isCorrected: o.correct,
        })),
      }));

      // Create draft quiz with questions
      const response = await fetch(`${apiUrl}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth
        },
        body: JSON.stringify({
          title: "Untitled Draft",
          description: "Draft quiz - Click edit to complete",
          thumbnailUrl: "",
          status: "DRAFT", // ✅ Fixed: Changed from "DRAFF" to "DRAFT"
          visibility: "PRIVATE",
          difficulty: "EASY",
          categoryIds: [],
          questionTimeLimit: "FIFTEEN",
          questions: apiQuestions,
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save draft: ${response.status}`);
      }

      const draftQuiz = await response.json();
      console.log("Draft quiz created successfully:", draftQuiz.id);
      return draftQuiz;
    } catch (error: any) {
      console.error("Failed to save draft:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleExit = async () => {
    // If editing existing quiz, just exit
    if (quizId) {
      router.push("/dashboard/library");
      return;
    }

    // If no questions, just exit
    if (questions.length === 0) {
      router.push("/dashboard/library");
      return;
    }

    // Auto-save as draft without asking
    try {
      setIsSaving(true);
      await saveDraft();
      router.push("/dashboard/library");
    } catch (error) {
      console.error("Failed to auto-save draft on exit:", error);
      // Show error but still allow exit
      const shouldExit = confirm("Failed to save draft. Exit without saving?");
      if (shouldExit) {
        router.push("/dashboard/library");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question before saving as draft");
      return;
    }

    try {
      await saveDraft();
      alert("Draft saved successfully!");
    } catch (error) {
      alert("Failed to save draft. Please try again.");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-90 flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Image src="/logo-sq.png" width={45} height={45} alt="Logo" />
        <span className="hidden md:inline text-2xl font-extrabold">
          <span className="text-blue-950">STACK</span>
          <span className="text-yellow-400">QUIZ</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleSaveDraft}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Draft"}
        </button>

        <button
          onClick={onPublish}
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Publish
        </button>

        <button
          onClick={handleExit}
          disabled={isSaving}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Exit"}
        </button>
      </div>
    </div>
  );
}
