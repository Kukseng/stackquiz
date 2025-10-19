"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Stage from "./Stage";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import ChallengeGrid from "../GridCardComponent";
import { getSession } from "next-auth/react";
import { ArrowLeft, ArrowRight,ClipboardList, Clock, AlertTriangle } from "lucide-react";

// Types
interface QuizData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  questions: string[];
  category?: string;
}

interface CreateSessionRequest {
  quizId: string;
  sessionName: string;
}

interface CreateSessionResponse {
  id: string;
  sessionName: string;
  sessionCode: string;
  status: string;
  currentQuestion: number;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
  quizTitle: string;
  totalQuestions: number;
  hostName: string;
  participantCount: number | null;
}

// Get auth headers
const getAuthHeaders = async () => {
  try {
    const session = await getSession();

    console.log(
      "🔍 Checking session...",
      session ? "Session found" : "No session"
    );

    if (!session) {
      throw new Error("No session found. Please login first.");
    }

    const token = (session as any)?.apiAccessToken;

    if (!token) {
      console.error("❌ No API access token in session");
      throw new Error("No authentication token found. Please login again.");
    }

    console.log("✅ Auth token found, length:", token.length);

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } catch (error) {
    console.error("❌ Error getting auth headers:", error);
    throw error;
  }
};

// Fetch quiz by ID from API
const fetchQuizById = async (id: string): Promise<QuizData | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes?active=true`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const quizzes: QuizData[] = await res.json();
    return quizzes.find((quiz) => quiz.id === id) || null;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

// Create quiz session
const createQuizSession = async (
  request: CreateSessionRequest
): Promise<CreateSessionResponse> => {
  try {
    const headers = await getAuthHeaders();
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://stackquiz-api.stackquiz.me/api/v1";

    console.log("📤 Creating quiz session...");
    console.log("   API URL:", `${apiUrl}/quiz-sessions`);
    console.log("   Request:", request);
    console.log("   Headers:", {
      ...headers,
      Authorization: headers.Authorization ? "***" : "missing",
    });

    const res = await fetch(`${apiUrl}/quiz-sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

    console.log("📥 Response status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Session creation failed:", errorText);

      let errorMessage = `Failed to create session (${res.status})`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        if (errorText.includes("User not found")) {
          errorMessage =
            "User not found. Your account may not be properly set up. Please contact support or try logging in again.";
        } else if (errorText) {
          errorMessage = errorText;
        }
      }

      throw new Error(errorMessage);
    }

    const data: CreateSessionResponse = await res.json();
    console.log("✅ Session created successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in createQuizSession:", error);
    throw error;
  }
};

export default function StartPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        const token = (session as any)?.apiAccessToken;
        setIsAuthenticated(!!token);
        console.log(
          "🔐 Auth check:",
          token ? "Authenticated" : "Not authenticated"
        );
      } catch (error) {
        console.error("❌ Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const loadQuizData = async () => {
      if (!quizId) {
        setError("No quiz ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchQuizById(quizId);

        if (!data) {
          setError("Quiz not found");
        } else {
          setQuizData(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
        console.error("Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [quizId]);

  const handleStartQuiz = async () => {
    if (!quizId) {
      alert("Quiz ID is missing");
      return;
    }

    if (!isAuthenticated) {
      alert("Please login first to create a quiz session");
      router.push("/login");
      return;
    }

    setIsCreatingSession(true);
    setError(null);

    try {
      const sessionName = `${
        quizData?.title || "Quiz"
      } - ${new Date().toLocaleString()}`;

      console.log("🚀 Starting quiz session creation...");

      const sessionData = await createQuizSession({
        quizId: quizId,
        sessionName: sessionName,
      });

      console.log(
        "🎉 Session created successfully! Navigating to host dashboard..."
      );

      router.push(`/host/${sessionData.sessionCode}`);
    } catch (err) {
      console.error("❌ Failed to create session:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create quiz session. Please try again.";
      setError(errorMessage);
      setIsCreatingSession(false);

      if (
        errorMessage.includes("User not found") ||
        errorMessage.includes("authentication") ||
        errorMessage.includes("token")
      ) {
        setTimeout(() => {
          if (
            confirm(
              "There seems to be an authentication issue. Would you like to login again?"
            )
          ) {
            router.push("/login");
          }
        }, 1000);
      }
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading || !authChecked) {
    return (
      <Stage>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-600 font-medium">
              {!authChecked
                ? "Checking authentication..."
                : "Loading quiz details..."}
            </p>
          </div>
        </div>
      </Stage>
    );
  }

  if (error && !quizData) {
    return (
      <Stage>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center max-w-md space-y-6">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {error || "Quiz Not Found"}
              </h1>
              <p className="text-slate-600">
                The quiz you&apos;re looking for doesn&apos;t exist or
                couldn&apos;t be loaded.
              </p>
            </div>
            <Button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Stage>
    );
  }

  if (!isAuthenticated) {
    return (
      <Stage>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center max-w-md space-y-6">
            <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Login Required
              </h1>
              <p className="text-slate-600">
                You need to be logged in to create and host a quiz session.
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm"
            >
              Login to Continue
            </Button>
          </div>
        </div>
      </Stage>
    );
  }

  const getDifficulty = (questionCount: number) => {
    if (questionCount <= 10)
      return { label: "Easy", color: "bg-emerald-500", icon: "○" };
    if (questionCount <= 20)
      return { label: "Medium", color: "bg-amber-500", icon: "◐" };
    return { label: "Hard", color: "bg-rose-500", icon: "●" };
  };

  const difficulty = getDifficulty(quizData?.questions?.length || 0);
  const estimatedTime = Math.ceil((quizData?.questions?.length || 0) * 1.5);

  return (
    <Stage>
      <div className="space-y-8 px-4 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto">
        <button
          onClick={handleGoBack}
          className="flex items-center btn-secondary btn-text rounded-xl text-lg gap-2 px-3 py-1 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back</span>
        </button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Image Card */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden rounded-xl shadow-xl group h-full min-h-[320px]">
              {quizData?.thumbnailUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={quizData.thumbnailUrl}
                    alt={quizData.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute rounded-xl"></div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]"></div>
                  <div className="text-white text-8xl font-bold opacity-30 relative z-10">
                    {quizData?.title?.charAt(0) || "Q"}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Info Card */}
          <div className="lg:col-span-3">
  <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl h-full flex flex-col">
    {/* Category Badge */}
    {quizData?.category && (
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-200 bg-white/10 px-3 py-1.5 rounded-full w-fit mb-4 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full"></span>
        {quizData.category}
      </div>
    )}

    {/* Title and Description */}
    <div className="flex-1 space-y-4">
      <h1 className="text-white font-bold text-3xl lg:text-4xl leading-tight">
        {quizData?.title}
      </h1>
      <p className="text-indigo-100 text-base leading-relaxed max-w-2xl">
        {quizData?.description}
      </p>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
          <ClipboardList className="w-5 h-5" />
          <span className="font-semibold">
            {quizData?.questions?.length || 0}
          </span>
          <span className="text-indigo-200">Questions</span>
        </div>

        <div
          className={`flex items-center gap-2 ${difficulty.color} text-white px-4 py-2 rounded-lg font-semibold shadow-lg`}
        >
          <span>{difficulty.icon}</span>
          {difficulty.label}
        </div>
      </div>
    </div>

    {/* Error Alert */}
    {error && quizData && (
      <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-200 font-semibold text-sm mb-1">
              Unable to Start Quiz
            </p>
            <p className="text-red-100 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )}

    {/* Action Section */}
    <div className="mt-6 pt-6 border-t border-white/20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-indigo-200 text-lg font-medium mb-1">
            Ready to begin?
          </p>
          <p className="text-white/90 text-md">
            Start your quiz session and invite participants
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleStartQuiz}
          disabled={isCreatingSession}
          className="flex items-center rounded-xl gap-2 btn-text btn-secondary transition group"
        >
          {isCreatingSession ? (
            <span>Creating Session...</span>
          ) : (
            <>
              <span className="text-lg">Start Quiz</span>
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </Button>
      </div>
    </div>
  </Card>
</div>
        </div>

        {/* Bottom Grid */}
        <div className="pt-4">
          <ChallengeGrid />
        </div>
      </div>
    </Stage>
  );
}
