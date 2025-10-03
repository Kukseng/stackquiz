"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useCreateQuizMutation, useUpdateQuizMutation } from "@/lib/api/quizApi";
import { useRouter } from "next/navigation";

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

interface Category {
  id: string;
  name: string;
  description: string;
}

interface DefaultValues {
  title: string;
  description: string;
  categoryIds: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  thumbnailUrl?: string;
}

interface PublishModalProps {
  onClose: () => void;
  quizData: Question[];
  quizId?: string;
  defaultValues?: DefaultValues;
}

export default function PublishModal({ 
  onClose, 
  quizData, 
  quizId,
  defaultValues 
}: PublishModalProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated" && !!(session as any)?.apiAccessToken;

  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();

  const {
    data: categories,
    isLoading: isLoadingCategories,
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
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const isEditMode = !!quizId;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, coverImage: file }));
      if (previewUrl && !defaultValues?.thumbnailUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Please drop a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, coverImage: file }));
      if (previewUrl && !defaultValues?.thumbnailUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
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

  const handleSubmit = async () => {
    setPublishError(null);

    if (!formData.tag.trim()) return alert("Please enter a quiz tag");
    if (!formData.description.trim()) return alert("Please enter a quiz description");
    if (!formData.category) return alert("Please select a category");
    if (quizData.length === 0) return alert("You must add at least one question before publishing.");

    // Transform questions to API format - keep spaces, don't replace with underscores
    const transformedQuestions = quizData.map((q) => ({
      text: q.question, // Keep original formatting with spaces
      type: q.type.toUpperCase() === "TRUEFALSE" ? "TF" : q.type.toUpperCase(),
      options: q.options.map((opt) => ({
        optionText: opt.text, // Keep original formatting with spaces
        isCorrected: opt.correct,
      })),
    }));

    const payload = {
      title: formData.tag,
      description: formData.description,
      thumbnailUrl: previewUrl || "",
      visibility: formData.visibility,
      difficulty: formData.difficulty,
      categoryIds: [formData.category],
      questions: transformedQuestions,
    };

    console.log("Publishing payload:", payload);

    try {
      let result;
      if (isEditMode) {
        result = await updateQuiz({ quizId, data: payload }).unwrap();
        console.log("Quiz updated successfully:", result);
      } else {
        result = await createQuiz(payload).unwrap();
        console.log("Quiz created successfully:", result);
      }
      
      onClose();
      
      // Navigate to quiz detail page
      const targetQuizId = isEditMode ? quizId : result?.id;
      if (targetQuizId) {
        // Force a hard navigation to refresh the page
        window.location.href = `/quiz/${targetQuizId}`;
      }
    } catch (error: any) {
      console.error("Failed to publish quiz - Full error:", error);
      
      const errorMessage = 
        error?.data?.message || 
        error?.message || 
        (error?.status ? `Error ${error.status}: Failed to publish quiz` : "Failed to publish quiz. Please try again.");
      
      setPublishError(errorMessage);
    }
  };

  const handleRetryCategories = async () => {
    setLoadingCategories(true);
    setCategoryError(null);
    try {
      await refetch();
    } catch (err) {
      setCategoryError("Failed to reload categories.");
    } finally {
      setLoadingCategories(false);
    }
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-2xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {isEditMode ? "Update Quiz" : "Publish Quiz"}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {isEditMode ? "Update your quiz details" : "Add the final touches to your quiz"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {publishError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {publishError}
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
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
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
                isDragging ? "border-purple-400 bg-purple-50" : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
              }`}
            >
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 mb-3">➕</div>
              <p className="text-gray-600 font-medium">Drop an image here</p>
              <p className="text-gray-400 text-sm">or click to browse</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG up to 5MB</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tag *</label>
            <input
              type="text"
              placeholder="Enter a quiz tag"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
              value={formData.tag}
              onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              placeholder="Describe your quiz"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none h-20"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <select
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Select a category</option>
              {isLoadingCategories ? (
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
            {categoryError && (
              <div className="text-red-500 text-sm mt-1 flex items-center justify-between">
                <span>{categoryError}</span>
                <button
                  type="button"
                  onClick={handleRetryCategories}
                  disabled={loadingCategories}
                  className="ml-2 px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md disabled:opacity-50"
                >
                  {loadingCategories ? "Retrying..." : "Retry"}
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Difficulty Level</label>
            <div className="flex space-x-3">
              {["EASY", "MEDIUM", "HARD"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, difficulty: level as any }))}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
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
                { value: "PUBLIC", icon: "🌍", desc: "Everyone can see" },
                { value: "PRIVATE", icon: "🔒", desc: "Only you can see" },
                { value: "UNLISTED", icon: "🙈", desc: "Accessible via link" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, visibility: option.value as any }))}
                  className={`flex-1 p-4 rounded-xl border-2 transition ${
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
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
            onClick={onClose}
            disabled={isCreating || isUpdating}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? "Publishing..." : isEditMode ? "Update Quiz" : "Publish Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}