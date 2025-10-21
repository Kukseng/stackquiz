"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateQuizMutation } from "@/lib/api/quizApi";
import { useSession } from "next-auth/react";

interface QuizHeaderProps {
  questions: any[];
  onPublish: () => void;
  quizId?: string;
}

export function QuizHeader({ questions, onPublish, quizId }: QuizHeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [createQuiz] = useCreateQuizMutation();
  const [isSaving, setIsSaving] = useState(false);

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

    // Ask user if they want to save as draft
    const shouldSave = window.confirm(
      "Do you want to save this quiz as a draft before exiting?"
    );

    if (shouldSave) {
      setIsSaving(true);
      try {
        await createQuiz({
          title: "Untitled Draft",
          description: "Draft quiz - Click edit to complete",
          thumbnailUrl: "",
          status: "DRAFT",
          visibility: "PRIVATE",
          difficulty: "EASY",
          categoryIds: [],
        }).unwrap();

        router.push("/dashboard/library");
      } catch (error) {
        console.error("Failed to save draft:", error);
        const exitAnyway = window.confirm(
          "Failed to save draft. Do you want to exit anyway?"
        );
        if (exitAnyway) {
          router.push("/dashboard/library");
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      router.push("/dashboard/library");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-90 flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Image src="/logo-sq.png" width={45} height={45} alt="Logo" />
        <span className="hidden md:inline text-2xl font-extrabold">
          <span className="text-blue-950">STACK</span>
          <span className="text-yellow">QUIZ</span>
        </span>
      </Link>

      <div className="flex items-center space-x-4">
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