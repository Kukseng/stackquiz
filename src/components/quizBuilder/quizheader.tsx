"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuizStore } from "./hooks/useQuizStore";
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
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const { thumbnailUrl } = useQuizStore();
  const API = process.env.NEXT_PUBLIC_API_URL;

  // ✅ Upload image using FormData (matching profile pattern)
  const uploadImageToAPI = async (file: File): Promise<string> => {
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB");
      }

      console.log(`📤 Uploading: ${file.name}`);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API}/medias/upload-single`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(session as any)?.apiAccessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.uri) {
        throw new Error("No URI in response");
      }

      console.log("✅ Upload success:", data.uri);
      return data.uri;
    } catch (error) {
      console.error("❌ Upload error:", error);
      throw error instanceof Error ? error : new Error("Upload failed");
    }
  };

  const uploadQuestionImage = async (imageUrl: string): Promise<string> => {
    try {
      // If already a valid URL, return as is
      if (imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
        console.log("📌 Using existing URL");
        return imageUrl;
      }

      // If empty, return empty
      if (!imageUrl || imageUrl.trim() === "") {
        return "";
      }

      console.log("🔄 Converting blob to file...");

      // Fetch blob and convert to File
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch blob");
      }

      const blob = await response.blob();
      
      if (!blob.type.startsWith("image/")) {
        throw new Error("Invalid image type");
      }

      const file = new File([blob], `question-${Date.now()}.jpg`, { type: blob.type });

      // Upload using the main function
      return await uploadImageToAPI(file);
    } catch (error) {
      console.error("❌ Question image upload error:", error);
      throw error instanceof Error ? error : new Error("Failed to upload question image");
    }
  };

  const saveDraft = async () => {
    if (questions.length === 0) {
      return null;
    }

    setIsSaving(true);
    try {
      console.log("💾 Saving draft with", questions.length, "questions...");

      // Process questions and upload images
      const processedQuestions = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        let uploadedImageUrl = "";

        // Upload question image if exists
        if (q.imageUrl) {
          try {
            uploadedImageUrl = await uploadQuestionImage(q.imageUrl);
            console.log(`✅ Image uploaded for Q${i + 1}`);
          } catch (error) {
            console.warn(`⚠️ Image upload failed for Q${i + 1}:`, error);
            // Continue without image rather than failing
            uploadedImageUrl = "";
          }
        }

        // Transform question to API format
        const apiQuestion = {
          text: q.question || "Untitled Question",
          type: (q.type.toUpperCase() === "TF" || q.type.toUpperCase() === "TRUEFALSE") 
            ? "TF" 
            : q.type.toUpperCase() === "FILL_THE_BLANK"
            ? "FILL_THE_BLANK"
            : "MCQ",
          imageUrl: uploadedImageUrl || undefined,
        };

        processedQuestions.push(apiQuestion);
      }

      // Create draft quiz
      const response = await fetch(`${API}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any)?.apiAccessToken}`,
        },
        body: JSON.stringify({
          title: `Draft of ${new Date().toLocaleDateString()}`,
          description: "Draft quiz - Click edit to complete",
          thumbnailUrl: thumbnailUrl || null,
          status: "DRAFT",
          visibility: "PRIVATE",
          difficulty: "EASY",
          categoryIds: [],
          questionTimeLimit: "FIFTEEN",
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Draft creation failed:", response.status, errorText);
        throw new Error(`Failed to save draft: ${response.status} - ${errorText}`);
      }

      const draftQuiz = await response.json();
      console.log("✅ Draft quiz created:", draftQuiz.id);

      // Thumbnail is already included in the initial creation, no need to update

      // Now add questions to the draft quiz
      for (let i = 0; i < processedQuestions.length; i++) {
        const apiQuestion = processedQuestions[i];
        const originalQuestion = questions[i];

        console.log(`➕ Adding question ${i + 1}/${processedQuestions.length}...`);

        const questionResponse = await fetch(`${API}/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(session as any)?.apiAccessToken}`,
          },
          body: JSON.stringify({
            ...apiQuestion,
            quizId: draftQuiz.id,
          })
        });

        if (!questionResponse.ok) {
          console.warn(`⚠️ Failed to add question ${i + 1}`);
          continue;
        }

        const createdQuestion = await questionResponse.json();

        // Add options if they exist
        if (originalQuestion.options && originalQuestion.options.length > 0) {
          const optionsResponse = await fetch(`${API}/options/${createdQuestion.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(session as any)?.apiAccessToken}`,
            },
            body: JSON.stringify(
              originalQuestion.options.map((opt) => ({
                optionText: opt.text,
                isCorrected: opt.correct,
                questionId: createdQuestion.id,
              }))
            )
          });

          if (!optionsResponse.ok) {
            console.warn(`⚠️ Failed to add options for question ${i + 1}`);
          }
        }
      }

      console.log("✅ Draft saved successfully!");
      return draftQuiz;
    } catch (error: any) {
      console.error("❌ Failed to save draft:", error);
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

    // Ask user if they want to save
    const shouldSave = confirm("Save this quiz as draft before exiting?");
    
    if (shouldSave) {
      try {
        setIsSaving(true);
        await saveDraft();
        alert("✅ Draft saved successfully!");
        router.push("/dashboard/library");
      } catch (error) {
        console.error("Failed to save draft:", error);
        const forceExit = confirm("Failed to save draft. Exit without saving?");
        if (forceExit) {
          router.push("/dashboard/library");
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      router.push("/dashboard/library");
    }
  };

  const handleSaveDraft = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question before saving");
      return;
    }

    try {
      await saveDraft();
      alert("✅ Draft saved successfully!");
      router.push("/dashboard/library");
    } catch (error) {
      alert("❌ Failed to save draft. Please try again.");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-90 flex justify-between items-center p-2 sm:p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-8xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/logo-sq.png" width={35} height={35} alt="Logo" className="sm:w-[45px] sm:h-[45px]" />
          <span className="hidden lg:inline text-xl sm:text-2xl font-extrabold">
            <span className="text-blue-950">STACK</span>
            <span className="text-yellow-400">QUIZ</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">

        <button
          onClick={onPublish}
          disabled={isSaving || questions.length === 0}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          Publish
        </button>

        <button
          onClick={handleExit}
          disabled={isSaving}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isSaving ? "Saving..." : "Exit"}
        </button>
        </div>
      </div>
    </div>
  );
}