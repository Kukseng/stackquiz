"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useCreateQuizMutation, useUpdateQuizMutation } from "@/lib/api/quizApi";
import { useCreateQuestionMutation } from "@/lib/api/questionApi";
import { useAddOptionsToQuestionMutation } from "@/lib/api/optionApi";

interface Option {
  id: string | number;
  text: string;
  correct: boolean;
  color: string;
}

interface Question {
  id: string | number;
  type: string;
  question: string;
  options: Option[];
}

interface CategoryResponse {
  id: string;
  name: string;
}

interface PublishModalProps {
  onClose: () => void;
  quizData: Question[];
  onPublishSuccess?: () => void;
  quizId?: string;
  defaultValues?: {
    title?: string;
    description?: string;
    categoryIds?: string[];
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    visibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
    thumbnailUrl?: string;
  };
}

interface ApiOption {
  optionText: string;
  isCorrected: boolean;
}

interface ApiQuestion {
  text: string;
  type: "MCQ" | "TF" | "FILL_THE_BLANK";
  imageUrl?: string;
  options: ApiOption[];
}

export default function PublishModal({ 
  onClose, 
  quizData, 
  onPublishSuccess,
  quizId,
  defaultValues 
}: PublishModalProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthed = status === "authenticated" && !!(session as any)?.apiAccessToken;
  const isEditMode = !!quizId;

  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const [addOptionsToQuestion] = useAddOptionsToQuestionMutation();

  const {
    data: categories,
    isLoading: loadingCategories,
    isError,
    refetch,
  } = useGetCategoriesQuery(undefined, {
    skip: !isAuthed,
  });

  const [formData, setFormData] = useState({
    tag: defaultValues?.title || "",
    description: defaultValues?.description || "",
    category: defaultValues?.categoryIds?.[0] || "",
    difficulty: defaultValues?.difficulty || ("EASY" as "EASY" | "MEDIUM" | "HARD"),
    visibility: defaultValues?.visibility || ("PUBLIC" as "PUBLIC" | "PRIVATE" | "UNLISTED"),
    coverImage: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValues?.thumbnailUrl || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const uploadCoverImage = async (file: File): Promise<string> => {
    try {
      const imageFormData = new FormData();
      imageFormData.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(session as any)?.apiAccessToken}`,
        },
        body: imageFormData,
      });

      if (!response.ok) {
        console.warn("Image upload failed, continuing without image");
        return "";
      }

      const data = await response.json();
      return data.imageUrl || data.url || data.thumbnailUrl || "";
    } catch (error) {
      console.warn("Image upload error:", error);
      return "";
    }
  };

  const handleSubmit = async () => {
    setPublishError(null);

    // Validation
    if (!formData.tag.trim()) {
      setPublishError("Please enter a quiz title");
      return;
    }
    if (!formData.description.trim()) {
      setPublishError("Please enter a quiz description");
      return;
    }
    if (!formData.category) {
      setPublishError("Please select a category");
      return;
    }
    if (quizData.length === 0) {
      setPublishError("You must add at least one question before publishing");
      return;
    }

    const emptyQuestions = quizData.filter(q => !q.question.trim());
    if (emptyQuestions.length > 0) {
      setPublishError("All questions must have text");
      return;
    }

    const questionsWithoutCorrect = quizData.filter(
      q => !q.options.some(opt => opt.correct)
    );
    if (questionsWithoutCorrect.length > 0) {
      setPublishError("Each question must have at least one correct answer");
      return;
    }

    setIsPublishing(true);

    try {
      let thumbnailUrl = defaultValues?.thumbnailUrl || "";
      
      // Upload cover image if a new one was selected
      if (formData.coverImage) {
        console.log("Uploading cover image...");
        const uploadedUrl = await uploadCoverImage(formData.coverImage);
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl;
        }
        console.log("Cover image uploaded:", thumbnailUrl);
      }

      if (isEditMode && quizId) {
        // UPDATE existing quiz
        console.log("Updating quiz...");
        await updateQuiz({
          quizId,
          data: {
            title: formData.tag,
            description: formData.description,
            thumbnailUrl: thumbnailUrl,
            visibility: formData.visibility,
            status: "PUBLISHED",
            questionTimeLimit: "FIVE",
            difficulty: formData.difficulty,
            categoryIds: [formData.category],
          },
        }).unwrap();

        console.log("Quiz updated successfully!");
        
        if (onPublishSuccess) {
          onPublishSuccess();
        }
        
        onClose();
        
        // Force refresh to show updated data
        window.location.href = `/quizDetail/${quizId}`;
      } else {
        // CREATE new quiz
        console.log("Creating quiz...");
        const createdQuiz = await createQuiz({
          title: formData.tag,
          description: formData.description,
          thumbnailUrl: thumbnailUrl,
          visibility: formData.visibility,
          status: "PUBLISHED",
          questionTimeLimit: "FIVE",
          difficulty: formData.difficulty,
          categoryIds: [formData.category],
        }).unwrap();

        console.log("Quiz created, now adding questions...");

        // Create questions and options
        for (let i = 0; i < quizData.length; i++) {
          const q = quizData[i];
          
          // Normalize question type
          let questionType: "MCQ" | "TF" | "FILL_THE_BLANK" = "MCQ";
          const typeUpper = q.type.toUpperCase();
          if (typeUpper === "TF" || typeUpper === "TRUEFALSE") {
            questionType = "TF";
          } else if (typeUpper === "MCQ") {
            questionType = "MCQ";
          } else if (typeUpper === "FILL_THE_BLANK") {
            questionType = "FILL_THE_BLANK";
          }

          console.log(`Creating question ${i + 1} / ${quizData.length}`);

          const createdQuestion = await createQuestion({
            text: q.question,
            type: questionType,
            imageUrl: undefined,
            quizId: createdQuiz.id,
          }).unwrap();

          if (q.options && q.options.length > 0) {
            console.log(`Adding ${q.options.length} options to question ${createdQuestion.id}`);
            await addOptionsToQuestion({
              questionId: createdQuestion.id,
              data: q.options.map((opt) => ({
                optionText: opt.text,
                isCorrected: opt.correct,
                questionId: createdQuestion.id,
              })),
            }).unwrap();
          }
        }

        console.log("Quiz published successfully!");
        
        if (onPublishSuccess) {
          onPublishSuccess();
        }

        onClose();
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error publishing/updating quiz:", error);
      
      const errorMessage = 
        error?.data?.message || 
        error?.message || 
        (error?.status ? `Error ${error.status}: Failed to ${isEditMode ? 'update' : 'publish'} quiz` : `Failed to ${isEditMode ? 'update' : 'publish'} quiz. Please try again.`);
      
      setPublishError(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setPublishError("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPublishError("Image size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, coverImage: file }));
      if (previewUrl && !defaultValues?.thumbnailUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
      setPublishError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) {
        setPublishError("Please drop a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPublishError("Image size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, coverImage: file }));
      if (previewUrl && !defaultValues?.thumbnailUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
      setPublishError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    if (previewUrl && !defaultValues?.thumbnailUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFormData((prev) => ({ ...prev, coverImage: null }));
    setPreviewUrl(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl && !defaultValues?.thumbnailUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, defaultValues?.thumbnailUrl]);

  if (!isAuthed) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Authenticating...</p>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = isPublishing || isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-2xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {isEditMode ? "Update Quiz" : "Publish Quiz"}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {quizData.length} question{quizData.length !== 1 ? 's' : ''} ready to {isEditMode ? 'update' : 'publish'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {publishError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm font-medium">{publishError}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Cover Image</label>
          {previewUrl ? (
            <div className="relative group">
              <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-gray-200">
                <Image src={previewUrl} alt="Cover Preview" fill className="object-cover" />
              </div>
              <button
                onClick={removeImage}
                disabled={isLoading}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging
                  ? "border-purple-400 bg-purple-50"
                  : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 mb-3">
                ➕
              </div>
              <p className="text-gray-600 font-medium">Drop an image here</p>
              <p className="text-gray-400 text-sm">or click to browse</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG up to 5MB</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              placeholder="Enter a quiz title"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              value={formData.tag}
              onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              placeholder="Describe your quiz"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none h-20 disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <select
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              disabled={isLoading || loadingCategories}
            >
              <option value="">Select a category</option>
              {loadingCategories ? (
                <option disabled>Loading categories...</option>
              ) : isError ? (
                <option disabled>Error loading categories</option>
              ) : !categories || categories.length === 0 ? (
                <option disabled>No categories available</option>
              ) : (
                categories.map((cat: CategoryResponse) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Difficulty Level</label>
            <div className="flex space-x-3">
              {(["EASY", "MEDIUM", "HARD"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, difficulty: level }))}
                  disabled={isLoading}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition disabled:opacity-50 ${
                    formData.difficulty === level
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Visibility</label>
            <div className="flex space-x-3">
              {[
                { value: "PUBLIC" as const, icon: "🌍", desc: "Everyone can see" },
                { value: "PRIVATE" as const, icon: "🔒", desc: "Only you can see" },
                { value: "UNLISTED" as const, icon: "🙈", desc: "Accessible via link" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, visibility: option.value }))}
                  disabled={isLoading}
                  className={`flex-1 p-4 rounded-xl border-2 transition disabled:opacity-50 ${
                    formData.visibility === option.value
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="font-medium text-gray-800">{option.value}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isEditMode ? "Updating..." : "Publishing..."}
              </>
            ) : (
              isEditMode ? "Update Quiz" : "Publish Quiz"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}