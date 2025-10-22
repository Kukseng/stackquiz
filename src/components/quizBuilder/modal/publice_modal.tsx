"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useCreateQuizMutation, useUpdateQuizMutation } from "@/lib/api/quizApi";
import { useCreateQuestionMutation, useUpdateQuestionMutation } from "@/lib/api/questionApi";
import { useAddOptionsToQuestionMutation, useUpdateOptionMutation } from "@/lib/api/optionApi";
import Image from "next/image";

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
  imageUrl?: string;
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
    questionTimeLimit?: string;
  };
}

// Helper to convert numeric seconds to API string format
const convertSecondsToAPIFormat = (seconds: number): string => {
  const mapping: { [key: number]: string } = {
    5: "FIVE",
    6: "SIX",
    7: "SEVEN",
    8: "EIGHT",
    9: "NINE",
    10: "TEN",
    15: "FIFTEEN",
    20: "TWENTY",
    30: "THIRTY",
  };
  return mapping[seconds] || "FIVE";
};

// Helper to convert API string format to numeric seconds
const convertAPIFormatToSeconds = (apiFormat: string): number => {
  const mapping: { [key: string]: number } = {
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    FIFTEEN: 15,
    TWENTY: 20,
    THIRTY: 30,
  };
  return mapping[apiFormat] || 5;
};

export default function PublishModal({
  onClose,
  quizData,
  onPublishSuccess,
  quizId,
  defaultValues,
}: PublishModalProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthed = status === "authenticated" && !!(session as any)?.apiAccessToken;
  const isEditMode = !!quizId;

  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [addOptionsToQuestion] = useAddOptionsToQuestionMutation();
  const [updateOption] = useUpdateOptionMutation();

  const {
    data: categories,
    isLoading: loadingCategories,
    isError,
  } = useGetCategoriesQuery(undefined, {
    skip: !isAuthed,
  });

  const timeLimits = [
    { label: "5s", value: 5 },
    { label: "6s", value: 6 },
    { label: "7s", value: 7 },
    { label: "8s", value: 8 },
    { label: "9s", value: 9 },
    { label: "10s", value: 10 },
    { label: "15s", value: 15 },
    { label: "20s", value: 20 },
    { label: "30s", value: 30 },
  ];

  const [formData, setFormData] = useState({
    tag: defaultValues?.title || "",
    description: defaultValues?.description || "",
    category: defaultValues?.categoryIds?.[0] || "",
    difficulty: defaultValues?.difficulty || ("EASY" as "EASY" | "MEDIUM" | "HARD"),
    visibility: defaultValues?.visibility || ("PUBLIC" as "PUBLIC" | "PRIVATE" | "UNLISTED"),
    timeLimit: defaultValues?.questionTimeLimit 
      ? convertAPIFormatToSeconds(defaultValues.questionTimeLimit)
      : 5,
    coverImage: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValues?.thumbnailUrl || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  // Helper function to determine if question is new
  const isNewQuestion = (id: string | number): boolean => {
    if (typeof id === "number") return true;
    if (typeof id === "string") {
      return id.length < 20 || !id.includes("-");
    }
    return false;
  };

  // Helper function to determine if option is new
  const isNewOption = (id: string | number): boolean => {
    if (typeof id === "number") return true;
    if (typeof id === "string") {
      return id.length < 20 || !id.includes("-");
    }
    return false;
  };

  // ✅ FIXED: Convert File to base64 string (without data URL prefix)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const result = reader.result as string;
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64Data = result.split(',')[1];
          if (!base64Data) {
            reject(new Error("Failed to convert image to base64"));
            return;
          }
          resolve(base64Data);
        } catch (error) {
          reject(new Error("Error processing image data"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  // ✅ FIXED: Upload image with proper error handling
  const uploadImageToAPI = async (file: File): Promise<string> => {
    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB");
      }

      console.log(`📤 Uploading image: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

      // Convert file to base64
      const base64String = await fileToBase64(file);

      // Upload to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medias/upload-single`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(session as any)?.apiAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: base64String,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Upload failed with status ${response.status}`;
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
      console.log("✅ Upload response:", data);
      
      // Validate response has URI
      if (!data.uri) {
        throw new Error("Upload response missing URI");
      }

      console.log(`✅ Image uploaded successfully: ${data.uri}`);
      return data.uri;
    } catch (error) {
      console.error("❌ Image upload error:", error);
      throw error instanceof Error ? error : new Error("Failed to upload image");
    }
  };

  // ✅ FIXED: Convert blob URL to file and upload
  const uploadQuestionImage = async (imageUrl: string): Promise<string> => {
    try {
      // If it's already a URI from the API, return as is
      if (imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
        console.log("📌 Using existing image URL:", imageUrl);
        return imageUrl;
      }

      // If it's empty, return empty
      if (!imageUrl || imageUrl.trim() === "") {
        return "";
      }

      console.log("🔄 Converting blob URL to file and uploading:", imageUrl);

      // Fetch blob and convert to File
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch blob URL");
      }

      const blob = await response.blob();
      
      // Validate blob type
      if (!blob.type.startsWith("image/")) {
        throw new Error("Invalid image type");
      }

      // Create File object
      const file = new File([blob], `question-${Date.now()}.jpg`, { type: blob.type });

      // Upload using the main upload function
      return await uploadImageToAPI(file);
    } catch (error) {
      console.error("❌ Question image upload error:", error);
      throw error instanceof Error ? error : new Error("Failed to upload question image");
    }
  };

  const handleSubmit = async () => {
    setPublishError(null);
    setUploadProgress("");

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

    const emptyQuestions = quizData.filter((q) => !q.question.trim());
    if (emptyQuestions.length > 0) {
      setPublishError("All questions must have text");
      return;
    }

    const questionsWithoutCorrect = quizData.filter(
      (q) => !q.options.some((opt) => opt.correct)
    );
    if (questionsWithoutCorrect.length > 0) {
      setPublishError("Each question must have at least one correct answer");
      return;
    }

    setIsPublishing(true);

    try {
      let thumbnailUrl = defaultValues?.thumbnailUrl || "";

      // ✅ Upload cover image if new file selected
      if (formData.coverImage) {
        setUploadProgress("Uploading cover image...");
        console.log("📤 Uploading cover image...");
        try {
          thumbnailUrl = await uploadImageToAPI(formData.coverImage);
          console.log("✅ Cover image uploaded:", thumbnailUrl);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unknown error";
          console.error("❌ Cover image upload failed:", errorMsg);
          setPublishError(`Failed to upload cover image: ${errorMsg}`);
          setIsPublishing(false);
          setUploadProgress("");
          return;
        }
      }

      const questionTimeLimit = convertSecondsToAPIFormat(formData.timeLimit);

      if (isEditMode && quizId) {
        // UPDATE EXISTING QUIZ
        setUploadProgress("Updating quiz metadata...");
        console.log("🔄 Updating quiz metadata...");
        await updateQuiz({
          quizId,
          quiz: {
            title: formData.tag,
            description: formData.description,
            thumbnailUrl: thumbnailUrl || undefined,
            visibility: formData.visibility,
            status: "PUBLISHED",
            questionTimeLimit: questionTimeLimit as any,
            difficulty: formData.difficulty,
            category: formData.category,
          },
        }).unwrap();

        // Process all questions
        for (let i = 0; i < quizData.length; i++) {
          const q = quizData[i];
          setUploadProgress(`Processing question ${i + 1}/${quizData.length}...`);

          let questionType: "MCQ" | "TF" | "FILL_THE_BLANK" = "MCQ";
          const typeUpper = q.type.toUpperCase();
          if (typeUpper === "TF" || typeUpper === "TRUEFALSE") {
            questionType = "TF";
          } else if (typeUpper === "MCQ") {
            questionType = "MCQ";
          } else if (typeUpper === "FILL_THE_BLANK") {
            questionType = "FILL_THE_BLANK";
          }

          // ✅ Upload question image if exists
          let uploadedImageUrl = "";
          if (q.imageUrl) {
            setUploadProgress(`Uploading image for question ${i + 1}/${quizData.length}...`);
            console.log(`📤 Uploading image for question ${i + 1}...`);
            try {
              uploadedImageUrl = await uploadQuestionImage(q.imageUrl);
              console.log(`✅ Question ${i + 1} image uploaded:`, uploadedImageUrl);
            } catch (error) {
              console.warn(`⚠️ Failed to upload image for question ${i + 1}:`, error);
              // Continue without image rather than failing
              uploadedImageUrl = "";
            }
          }

          if (isNewQuestion(q.id)) {
            // CREATE NEW QUESTION
            console.log(`➕ Creating new question ${i + 1}/${quizData.length}`);

            const createdQuestion = await createQuestion({
              text: q.question,
              type: questionType,
              imageUrl: uploadedImageUrl || undefined,
              quizId: quizId,
            }).unwrap();

            if (q.options && q.options.length > 0) {
              console.log(`➕ Adding ${q.options.length} options to new question`);
              await addOptionsToQuestion({
                questionId: createdQuestion.id,
                data: q.options.map((opt) => ({
                  optionText: opt.text,
                  isCorrected: opt.correct,
                  questionId: createdQuestion.id,
                })),
              }).unwrap();
            }
          } else {
            // UPDATE EXISTING QUESTION
            console.log(`🔄 Updating existing question ${i + 1}/${quizData.length}`);

            await updateQuestion({
              id: String(q.id),
              data: {
                text: q.question,
                type: questionType,
                imageUrl: uploadedImageUrl || undefined,
              },
            }).unwrap();

            // Process options for existing question
            if (q.options && q.options.length > 0) {
              for (const opt of q.options) {
                if (isNewOption(opt.id)) {
                  // CREATE NEW OPTION
                  await addOptionsToQuestion({
                    questionId: String(q.id),
                    data: [
                      {
                        optionText: opt.text,
                        isCorrected: opt.correct,
                        questionId: String(q.id),
                      },
                    ],
                  }).unwrap();
                } else {
                  // UPDATE EXISTING OPTION
                  await updateOption({
                    optionId: String(opt.id),
                    data: {
                      optionText: opt.text,
                      isCorrected: opt.correct,
                    },
                  }).unwrap();
                }
              }
            }
          }
        }
        
        console.log("✅ Quiz updated successfully!");
        setUploadProgress("Quiz updated successfully!");

        if (onPublishSuccess) {
          onPublishSuccess();
        }

        setTimeout(() => {
          onClose();
          router.push(`/quizDetail/${quizId}`);
        }, 500);
      } else {
        // CREATE NEW QUIZ
        setUploadProgress("Creating new quiz...");
        console.log("➕ Creating new quiz...");
        const createdQuiz = await createQuiz({
          title: formData.tag,
          description: formData.description,
          thumbnailUrl: thumbnailUrl || undefined,
          visibility: formData.visibility,
          status: "PUBLISHED",
          questionTimeLimit: questionTimeLimit as any,
          difficulty: formData.difficulty,
          categoryIds: [formData.category],
        }).unwrap();

        console.log("✅ Quiz created, now adding questions...");

        for (let i = 0; i < quizData.length; i++) {
          const q = quizData[i];
          setUploadProgress(`Processing question ${i + 1}/${quizData.length}...`);

          let questionType: "MCQ" | "TF" | "FILL_THE_BLANK" = "MCQ";
          const typeUpper = q.type.toUpperCase();
          if (typeUpper === "TF" || typeUpper === "TRUEFALSE") {
            questionType = "TF";
          } else if (typeUpper === "MCQ") {
            questionType = "MCQ";
          } else if (typeUpper === "FILL_THE_BLANK") {
            questionType = "FILL_THE_BLANK";
          }

          // ✅ Upload question image if exists
          let uploadedImageUrl = "";
          if (q.imageUrl) {
            setUploadProgress(`Uploading image for question ${i + 1}/${quizData.length}...`);
            console.log(`📤 Uploading image for question ${i + 1}...`);
            try {
              uploadedImageUrl = await uploadQuestionImage(q.imageUrl);
              console.log(`✅ Question ${i + 1} image uploaded:`, uploadedImageUrl);
            } catch (error) {
              console.warn(`⚠️ Failed to upload image for question ${i + 1}:`, error);
              // Continue without image
              uploadedImageUrl = "";
            }
          }

          console.log(`➕ Creating question ${i + 1}/${quizData.length}`);

          const createdQuestion = await createQuestion({
            text: q.question,
            type: questionType,
            imageUrl: uploadedImageUrl || undefined,
            quizId: createdQuiz.id,
          }).unwrap();

          if (q.options && q.options.length > 0) {
            console.log(`➕ Adding ${q.options.length} options to question`);
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

        console.log("✅ Quiz published successfully!");
        setUploadProgress("Quiz published successfully!");

        if (onPublishSuccess) {
          onPublishSuccess();
        }

        setTimeout(() => {
          onClose();
          router.push("/dashboard");
        }, 500);
      }
    } catch (error: any) {
      console.error("❌ Error publishing/updating quiz:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        (error?.status
          ? `Error ${error.status}: Failed to ${isEditMode ? "update" : "publish"} quiz`
          : `Failed to ${isEditMode ? "update" : "publish"} quiz. Please try again.`);

      setPublishError(errorMessage);
      setUploadProgress("");
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

  const isLoading = isPublishing || isCreating || isUpdating || loadingCategories;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100/40 via-purple-100/30 to-blue-100/40 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl -z-10"></div>

      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-0 w-full max-w-6xl shadow-2xl max-h-[90vh] overflow-y-auto border border-white/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Section - Image Upload */}
          <div className="bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-blue-50/40 p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/40 flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-2">
                {isEditMode ? "Update Quiz" : "Adding the final touches"}
              </h3>
              <p className="text-gray-500 text-sm">
                {quizData.length} question{quizData.length !== 1 ? "s" : ""} ready to{" "}
                {isEditMode ? "update" : "publish"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Cover Image</label>
              {previewUrl ? (
                <div className="relative group">
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden border-2 border-gradient-to-r from-purple-200 to-blue-200 shadow-lg">
                    <Image
                      src={previewUrl}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={removeImage}
                    disabled={isLoading}
                    className="absolute top-3 right-3 bg-black text-red-500 rounded-full w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg disabled:opacity-30"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-2xl h-56 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-purple-400 bg-purple-100/50 scale-105"
                      : "border-purple-200 hover:border-purple-400 hover:bg-purple-50/30"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="p-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 mb-3 text-3xl">
                    ➕
                  </div>
                  <p className="text-gray-700 font-semibold text-center">Add cover image</p>
                  <p className="text-gray-400 text-xs mt-2">JPG, PNG up to 5MB</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Title</label>
              <input
                type="text"
                placeholder="Enter a title for your quiz"
                className="w-full px-5 py-3 bg-white/60 border-2 border-purple-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50 transition-all placeholder:text-gray-400"
                value={formData.tag}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tag: e.target.value }))
                }
                disabled={isLoading}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Description
              </label>
              <textarea
                placeholder="Describe your quiz..."
                className="w-full px-5 py-3 bg-white/60 border-2 border-purple-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none h-24 disabled:opacity-50 transition-all placeholder:text-gray-400"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Right Section - Form Fields */}
          <div className="p-8 md:p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <select
                  className="w-full px-5 py-3 bg-white/60 border-2 border-purple-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer disabled:opacity-50 transition-all"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                >
                  <option value="">Select a category</option>
                  {loadingCategories ? (
                    <option disabled>Loading categories...</option>
                  ) : isError ? (
                    <option disabled>Error loading categories</option>
                  ) : !categories || categories.length === 0 ? (
                    <option disabled>No categories available</option>
                  ) : (
                    categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Difficulty Level
                </label>
                <div className="flex gap-3">
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: level.toUpperCase() as
                            | "EASY"
                            | "MEDIUM"
                            | "HARD",
                        }))
                      }
                      disabled={isLoading}
                      className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 ${
                        formData.difficulty === level.toUpperCase()
                          ? "bg-blue-800 text-white shadow-lg scale-105"
                          : "bg-gray-100/60 text-gray-600 hover:bg-gray-200/60"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Time Limit per Question
                </label>
                <select
                  className="w-full px-5 py-3 bg-white/60 border-2 border-purple-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer disabled:opacity-50 transition-all"
                  value={formData.timeLimit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeLimit: Number(e.target.value),
                    }))
                  }
                  disabled={isLoading}
                >
                  {timeLimits.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Visibility
                </label>
                <div className="flex gap-3">
                  {[
                    {
                      value: "PUBLIC" as const,
                      icon: "🌍",
                      label: "Public",
                      desc: "Visible to everyone",
                    },
                    {
                      value: "PRIVATE" as const,
                      icon: "🔒",
                      label: "Private",
                      desc: "Visible only to you",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: option.value,
                        }))
                      }
                      disabled={isLoading}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all duration-300 disabled:opacity-50 ${
                        formData.visibility === option.value
                          ? "border-purple-400 bg-purple-50 shadow-md scale-105"
                          : "border-gray-200 hover:border-purple-200 bg-white/40"
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="font-semibold text-gray-800 text-sm">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Progress Indicator */}
              {uploadProgress && (
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                    <p className="text-blue-700 text-sm font-medium">{uploadProgress}</p>
                  </div>
                </div>
              )}

              {publishError && (
                <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm font-medium">{publishError}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-white/40">
              <button
                className="flex-1 py-3 bg-red-600 hover:bg-red-600/80 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 bg-yellow-500 text-blue-950 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 shadow-lg"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-950 border-t-transparent"></div>
                    {isEditMode ? "Updating..." : "Publishing..."}
                  </>
                ) : isEditMode ? (
                  "Update Quiz"
                ) : (
                  "Publish Quiz"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}