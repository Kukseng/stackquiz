"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Stage from "./Stage";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import ChallengeGrid from "../GridCardComponent";
import { getSession } from "next-auth/react";

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
    
    console.log("🔍 Checking session...", session ? "Session found" : "No session");
    
    if (!session) {
      throw new Error('No session found. Please login first.');
    }

    const token = (session as any)?.apiAccessToken;
    
    if (!token) {
      console.error('❌ No API access token in session');
      throw new Error('No authentication token found. Please login again.');
    }

    console.log('✅ Auth token found, length:', token.length);
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('❌ Error getting auth headers:', error);
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
          'Content-Type': 'application/json',
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
const createQuizSession = async (request: CreateSessionRequest): Promise<CreateSessionResponse> => {
  try {
    const headers = await getAuthHeaders();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999/api/v1';
    
    console.log("📤 Creating quiz session...");
    console.log("   API URL:", `${apiUrl}/quiz-sessions`);
    console.log("   Request:", request);
    console.log("   Headers:", { ...headers, Authorization: headers.Authorization ? '***' : 'missing' });
    
    const res = await fetch(`${apiUrl}/quiz-sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });
    
    console.log("📥 Response status:", res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Session creation failed:", errorText);
      
      // Parse error message
      let errorMessage = `Failed to create session (${res.status})`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        // If not JSON, use text
        if (errorText.includes('User not found')) {
          errorMessage = 'User not found. Your account may not be properly set up. Please contact support or try logging in again.';
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

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        const token = (session as any)?.apiAccessToken;
        setIsAuthenticated(!!token);
        console.log("🔐 Auth check:", token ? "Authenticated" : "Not authenticated");
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

    // Check authentication
    if (!isAuthenticated) {
      alert("Please login first to create a quiz session");
      router.push('/login');
      return;
    }

    setIsCreatingSession(true);
    setError(null);

    try {
      // Generate session name
      const sessionName = `${quizData?.title || 'Quiz'} - ${new Date().toLocaleString()}`;
      
      console.log("🚀 Starting quiz session creation...");
      
      // Create quiz session
      const sessionData = await createQuizSession({
        quizId: quizId,
        sessionName: sessionName,
      });

      console.log("🎉 Session created successfully! Navigating to host dashboard...");

      // Navigate to host dashboard with session code
      router.push(`/host/${sessionData.sessionCode}`);
      
    } catch (err) {
      console.error("❌ Failed to create session:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create quiz session. Please try again.";
      setError(errorMessage);
      setIsCreatingSession(false);
      
      // If it's an auth error, suggest re-login
      if (errorMessage.includes('User not found') || errorMessage.includes('authentication') || errorMessage.includes('token')) {
        setTimeout(() => {
          if (confirm('There seems to be an authentication issue. Would you like to login again?')) {
            router.push('/login');
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">{!authChecked ? "Checking authentication..." : "Loading quiz..."}</p>
          </div>
        </div>
      </Stage>
    );
  }

  if (error && !quizData) {
    return (
      <Stage>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {error || "Quiz Not Found"}
            </h1>
            <p className="text-slate-600 mb-4">
              The quiz you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
            </p>
            <Button 
              onClick={handleGoBack}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go Back
            </Button>
          </div>
        </div>
      </Stage>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Stage>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Login Required
            </h1>
            <p className="text-slate-600 mb-6">
              You need to be logged in to create a quiz session.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => router.push('/login')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </Button>
              <Button 
                onClick={handleGoBack}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </Stage>
    );
  }

  // Determine difficulty based on number of questions
  const getDifficulty = (questionCount: number) => {
    if (questionCount <= 10) return { label: "Easy", color: "bg-green-500" };
    if (questionCount <= 20) return { label: "Medium", color: "bg-yellow-500" };
    return { label: "Hard", color: "bg-red-500" };
  };

  const difficulty = getDifficulty(quizData?.questions?.length || 0);

  return (
    <Stage>
      <div className="grid gap-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <Card className="relative overflow-hidden rounded-xl group">
            {/* Dynamic thumbnail from API */}
            {quizData?.thumbnailUrl ? (
              <Image
                src={quizData.thumbnailUrl}
                alt={quizData.title}
                width={600}
                height={400}
                className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-xl transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                <div className="text-white text-6xl font-bold opacity-20">
                  {quizData?.title?.charAt(0) || 'Q'}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 md:p-8 flex flex-col justify-center bg-[#5a6fb6]/40 rounded-xl">
            <h2 className="text-white font-extrabold text-2xl md:text-3xl">
              {quizData?.title}
            </h2>
            <p className="mt-2 text-white/80 text-sm leading-relaxed">
              {quizData?.description}
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">
                {quizData?.questions?.length || 0} questions
              </span>
              <span className={`${difficulty.color} text-white text-xs px-3 py-1 rounded-full`}>
                {difficulty.label}
              </span>
            </div>

            {/* Error Message */}
            {error && quizData && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm font-medium mb-1">⚠️ Error</p>
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            {/* Start Button */}
            <div className="mt-7">
              <div className="text-sm text-white/85 mb-2">Ready to start?</div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-amber-300 bg-black/30 px-7 py-2 text-white/85">
                  {quizData?.title || "General"}
                </div>
                <Button 
                  size="sm" 
                  className="h-10 rounded-full px-6 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleStartQuiz}
                  disabled={isCreatingSession}
                >
                  {isCreatingSession ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Start Quiz"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Grid */}
        <ChallengeGrid/>
      </div>
    </Stage>
  );
}
