"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { getSession } from "next-auth/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
    const session = await getSession();
    const token = (session as any)?.apiAccessToken;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
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
      content: "👋 Hi! I'm your AI quiz assistant. I can help you generate questions for your quiz. Just tell me the topic!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      
      if (lowerInput.includes("generate") || lowerInput.includes("create") || lowerInput.includes("make")) {
        await handleGenerateQuestions(input);
      } else {
        const response = await getConversationalResponse(input);
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "❌ Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getConversationalResponse = async (userInput: string): Promise<string> => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "👋 Hello! How can I help you create quiz questions today?";
    }

    if (lowerInput.includes("help")) {
      return `I can help you generate quiz questions! Here's how:

1. Tell me the topic (e.g., "JavaScript basics")
2. Specify how many questions you want (e.g., "5 questions")
3. Choose difficulty: EASY, MEDIUM, or HARD
4. I'll generate the questions for you!

Example: "Generate 5 medium difficulty questions about React Hooks"`;
    }

    if (lowerInput.includes("topic") || lowerInput.includes("subject")) {
      return "What topic would you like to create questions about? For example: 'Python programming', 'World History', 'Mathematics', etc.";
    }

    return `I can generate quiz questions for you! Try saying something like:
    
"Generate 5 questions about ${userInput}"
    
Or tell me more about what you need!`;
  };

  const handleGenerateQuestions = async (userInput: string) => {
    const params = extractGenerationParams(userInput);

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `🎯 Generating ${params.numberOfQuestions} ${params.difficulty.toLowerCase()} questions about "${params.topic}"...`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("http://localhost:9999/api/v1/ai/quiz/chatbot/generate", {
        method: "POST",
        headers: await getAuthHeaders(),
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
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();

      if (data.success) {
        const questions = data.data.questions;
        if (onQuestionsGenerated) {
          onQuestionsGenerated(questions);
        }

        const successMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `✅ ${data.message}

I've generated ${questions.length} questions and added them to your quiz! Here's a preview of the first one:

**Q: ${questions[0].questionText}**

${questions[0].options
  .map((opt: any, i: number) => `${String.fromCharCode(65 + i)}. ${opt.optionText} ${opt.isCorrect ? "✅" : ""}`)
  .join("\n")}

Would you like to generate more questions?`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      } else {
        throw new Error(data.message || "Failed to generate questions");
      }
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `❌ Failed to generate questions: ${error instanceof Error ? error.message : "Unknown error"}

🔍 Troubleshooting:
- Check if backend is running on port 9999
- Verify endpoint: http://localhost:9999/api/v1/ai/quiz/chatbot/generate
- Check browser console for details`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const extractGenerationParams = (input: string) => {
    const lowerInput = input.toLowerCase();

    const numberMatch = lowerInput.match(/(\d+)\s*(question|q)/i);
    const numberOfQuestions = numberMatch ? parseInt(numberMatch[1]) : 5;

    let difficulty = "MEDIUM";
    if (lowerInput.includes("easy")) difficulty = "EASY";
    if (lowerInput.includes("hard")) difficulty = "HARD";
    if (lowerInput.includes("medium")) difficulty = "MEDIUM";

    let topic = input;
    const aboutMatch = input.match(/about\s+(.+)/i);
    const onMatch = input.match(/on\s+(.+)/i);
    
    if (aboutMatch) {
      topic = aboutMatch[1];
    } else if (onMatch) {
      topic = onMatch[1];
    }

    topic = topic
      .replace(/generate|create|make|questions?|quiz/gi, "")
      .replace(/\d+/g, "")
      .replace(/easy|medium|hard/gi, "")
      .trim();

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
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-50 group"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              AI Quiz Assistant
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
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Quiz Assistant</h3>
                  <p className="text-xs text-white/80">Powered by AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : "bg-white text-gray-800 shadow-sm border border-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user" ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                    <span className="text-sm">Thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me to generate questions..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Try: "Generate 5 medium questions about React"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}