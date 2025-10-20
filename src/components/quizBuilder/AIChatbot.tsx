"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface GeneratedQuestion {
  questionText: string;
  questionType: string;
  difficulty: string;
  points: number;
  timeLimit: number;
  options: Array<{
    optionText: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
  explanation?: string;
}

interface AIChatbotProps {
  onQuestionsGenerated?: (questions: GeneratedQuestion[]) => void;
}

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  try {
    // Import getSession dynamically to avoid SSR issues
    const { getSession } = await import("next-auth/react");
    const session = await getSession();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Check for API access token
    if (session) {
      const token =
        (session as any)?.apiAccessToken || (session as any)?.accessToken;

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("✅ Auth token added to headers");
      } else {
        console.warn("⚠️ No token found in session:", Object.keys(session));
      }
    } else {
      console.warn("⚠️ No active session found");
    }

    return headers;
  } catch (error) {
    console.error("❌ Error getting session:", error);
    return { "Content-Type": "application/json" };
  }
};

export function AIChatbot({ onQuestionsGenerated }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        '👋 Hi! I\'m your AI quiz assistant. I can help you generate questions for your quiz. Just tell me what you need!\n\n💡 **Quick examples:**\n• "Generate 5 easy questions about JavaScript"\n• "Create 3 hard questions on World War 2"\n• "Make 10 medium Python questions"',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const lowerInput = input.toLowerCase();

      // Check if user wants to generate questions
      if (
        lowerInput.includes("generate") ||
        lowerInput.includes("create") ||
        lowerInput.includes("make") ||
        /\d+\s*(question|quiz)/i.test(lowerInput)
      ) {
        await handleGenerateQuestions(input);
      } else {
        // Conversational response
        const response = await getConversationalResponse(input);
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "❌ Sorry, I encountered an error. Please try again or rephrase your request.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getConversationalResponse = async (
    userInput: string
  ): Promise<string> => {
    const lowerInput = userInput.toLowerCase();

    if (
      lowerInput.includes("hello") ||
      lowerInput.includes("hi") ||
      lowerInput.includes("hey")
    ) {
      return "👋 Hello! I'm ready to help you create quiz questions. What topic interests you today?";
    }

    if (lowerInput.includes("help") || lowerInput === "?") {
      return `🎯 **Here's what I can do:**

**Generate Questions:**
• "Generate 5 questions about JavaScript"
• "Create 3 hard questions on Python"
• "Make 10 easy history questions"

**Difficulty Levels:**
• Easy - Simple, foundational concepts
• Medium - Moderate complexity
• Hard - Advanced topics

**Just tell me:**
1️⃣ How many questions (1-20)
2️⃣ What topic
3️⃣ Difficulty level (optional)

Try it now! 🚀`;
    }

    if (
      lowerInput.includes("topic") ||
      lowerInput.includes("subject") ||
      lowerInput.includes("about what")
    ) {
      return `📚 I can create questions about almost any topic!

**Popular topics:**
• Programming (JavaScript, Python, Java, etc.)
• Mathematics & Science
• History & Geography
• Business & Economics
• General Knowledge

What subject would you like to focus on?`;
    }

    if (lowerInput.includes("difficulty") || lowerInput.includes("how hard")) {
      return `📊 **Difficulty Levels:**

🟢 **EASY** - Basic concepts, simple recall
🟡 **MEDIUM** - Moderate complexity, some analysis
🔴 **HARD** - Advanced topics, deep understanding

Just mention "easy", "medium", or "hard" in your request!`;
    }

    if (lowerInput.includes("how many")) {
      return 'You can generate anywhere from **1 to 20 questions** at a time. Just tell me the number you\'d like!\n\nExample: "Generate 7 questions about React"';
    }

    // Default response with suggestion
    return `I'd be happy to help! To generate quiz questions, try something like:

"Generate **5 medium questions** about **${userInput}**"

Or just tell me more about what you need! 😊`;
  };

  const handleGenerateQuestions = async (userInput: string) => {
    const params = extractGenerationParams(userInput);

    // Validate parameters
    if (!params.topic || params.topic.length < 2) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          '🤔 I couldn\'t identify a clear topic. Please try again with something like:\n\n"Generate 5 questions about [your topic]"',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    if (params.numberOfQuestions < 1 || params.numberOfQuestions > 20) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "⚠️ Please request between 1 and 20 questions at a time.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `🎯 Generating **${
        params.numberOfQuestions
      }** ${params.difficulty.toLowerCase()} difficulty questions about **"${
        params.topic
      }"**...\n\n⏳ This may take a few moments...`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const headers = await getAuthHeaders();
      console.log("🔐 Request headers:", {
        ...headers,
        Authorization: headers.Authorization ? "Bearer ***" : "none",
      });

      const response = await fetch(
        "https://stackquiz-api.stackquiz.me/api/v1/ai/quiz/chatbot/generate",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            topic: params.topic,
            numberOfQuestions: params.numberOfQuestions,
            difficulty: params.difficulty,
            questionType: "MULTIPLE_CHOICE",
            numberOfOptions: 4,
            timeLimit: 30,
            points: 100,
            language: "English",
            includeExplanations: true,
          }),
        }
      );

      const responseText = await response.text();
      console.log("API Response Status:", response.status);
      console.log("API Response Body:", responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          // Handle 401 specifically
          if (response.status === 401) {
            throw new Error(
              "🔒 Authentication failed. Please log in again to use the AI assistant."
            );
          }
          throw new Error(
            `API Error: ${response.status} - ${responseText.substring(0, 200)}`
          );
        }

        // Handle specific error messages from backend
        const errorMsg =
          errorData.message || errorData.error || "Unknown error occurred";
        const suggestion = errorData.suggestion || "";

        // Add auth-specific message for 401
        if (response.status === 401) {
          throw new Error(
            "🔒 Authentication required. Please log in to use the AI quiz generator."
          );
        }

        throw new Error(`${errorMsg}\n${suggestion}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error(
          "Failed to parse response from server. The AI may have returned invalid data."
        );
      }

      if (data.success && data.data?.questions) {
        const questions = data.data.questions;

        if (questions.length === 0) {
          throw new Error(
            "No questions were generated. Please try a different topic or reduce the number of questions."
          );
        }

        // Validate question structure
        const validQuestions = questions.filter(
          (q: any) =>
            q.questionText &&
            q.options &&
            Array.isArray(q.options) &&
            q.options.length >= 2
        );

        if (validQuestions.length === 0) {
          throw new Error(
            "Generated questions are invalid. Please try again with a simpler topic."
          );
        }

        if (onQuestionsGenerated) {
          onQuestionsGenerated(validQuestions);
        }

        const successMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `✅ **Success!** Generated ${
            validQuestions.length
          } question${validQuestions.length > 1 ? "s" : ""}!

📝 **Preview of first question:**

**Q: ${validQuestions[0].questionText}**

${validQuestions[0].options
  .map(
    (opt: any, i: number) =>
      `${String.fromCharCode(65 + i)}. ${opt.optionText} ${
        opt.isCorrect ? "✅" : ""
      }`
  )
  .join("\n")}

${
  validQuestions[0].explanation ? `\n💡 *${validQuestions[0].explanation}*` : ""
}

---

The questions have been added to your quiz! Would you like to generate more?`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      } else {
        throw new Error(
          data.message ||
            "Failed to generate questions - invalid response format"
        );
      }
    } catch (error) {
      console.error("Generation error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const isServerError =
        errorMessage.includes("500") || errorMessage.includes("parse");

      let troubleshootingMsg = "";
      if (isServerError) {
        troubleshootingMsg = `\n\n🔧 **Troubleshooting:**\n• The AI service may be overloaded\n• Try a simpler topic\n• Reduce the number of questions\n• Wait a moment and try again`;
      }

      const retryMsg =
        retryCount < 2
          ? `\n\n🔄 You can try again with a different request.`
          : "";

      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `❌ **Generation Failed**\n\n${errorMessage}${troubleshootingMsg}${retryMsg}`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
      setRetryCount((prev) => prev + 1);
    }
  };

  const extractGenerationParams = (input: string) => {
    const lowerInput = input.toLowerCase();

    // Extract number of questions
    const numberMatch = lowerInput.match(/(\d+)\s*(?:question|quiz|q\b)/i);
    let numberOfQuestions = numberMatch ? parseInt(numberMatch[1]) : 5;
    numberOfQuestions = Math.max(1, Math.min(20, numberOfQuestions)); // Clamp between 1-20

    // Extract difficulty
    let difficulty = "MEDIUM";
    if (
      lowerInput.includes("easy") ||
      lowerInput.includes("beginner") ||
      lowerInput.includes("simple")
    ) {
      difficulty = "EASY";
    } else if (
      lowerInput.includes("hard") ||
      lowerInput.includes("difficult") ||
      lowerInput.includes("advanced")
    ) {
      difficulty = "HARD";
    } else if (
      lowerInput.includes("medium") ||
      lowerInput.includes("intermediate")
    ) {
      difficulty = "MEDIUM";
    }

    // Extract topic (more sophisticated extraction)
    let topic = input;

    // Remove common command words
    const patterns = [
      /(?:generate|create|make|give me|i want|can you)\s+/gi,
      /\d+\s*(?:question|quiz|q\b)s?\s+/gi,
      /(?:about|on|regarding|concerning)\s+/gi,
      /(?:easy|medium|hard|difficult|simple|beginner|advanced|intermediate)\s*/gi,
    ];

    patterns.forEach((pattern) => {
      topic = topic.replace(pattern, " ");
    });

    // Clean up the topic
    topic = topic
      .trim()
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .replace(/^[^\w]+|[^\w]+$/g, ""); // Remove leading/trailing non-word chars

    // If topic is still too generic or empty, try to extract from original input
    if (!topic || topic.length < 2) {
      const aboutMatch = input.match(/(?:about|on)\s+([^.!?]+)/i);
      if (aboutMatch) {
        topic = aboutMatch[1].trim();
      }
    }

    console.log("Extracted params:", { topic, numberOfQuestions, difficulty });

    return { topic, numberOfQuestions, difficulty };
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 group hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              AI Quiz Assistant ✨
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Quiz Assistant</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-xs text-white/90">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                        : message.isError
                        ? "bg-red-50 text-red-900 border border-red-200"
                        : "bg-white text-gray-800 shadow-sm border border-gray-200"
                    }`}
                  >
                    {message.isError && (
                      <div className="flex items-center space-x-1 mb-1">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1.5 ${
                        message.role === "user"
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-2xl px-4 py-3 flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm">Processing...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-shadow"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Try: Generate 5 medium questions about React
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
