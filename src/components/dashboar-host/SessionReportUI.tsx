

"use client"
import { getSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { Search, MoreVertical, Edit2, Users, Target, Clock, ChevronDown, ChevronRight } from "lucide-react"

// ===== INTERFACES =====
interface SessionReportData {
  sessionId: string
  sessionCode: string
  sessionName: string
  quizTitle: string
  hostName: string
  startTime: string
  endTime: string
  duration: number
  status: string
  statistics: SessionStatistics
  questionAnalysis: QuestionAnalysis[]
  participantReports: ParticipantReport[]
  performanceInsights?: PerformanceInsights
}

interface SessionStatistics {
  totalParticipants: number
  completedParticipants: number
  completionRate: number
  averageScore: number
  averageAccuracy: number
  averageResponseTime: number
  totalQuestions: number
  totalAnswers: number
  correctAnswers: number
  incorrectAnswers: number
  engagementRate: number
}

interface QuestionAnalysis {
  questionNumber: number
  questionText: string
  questionType: string
  difficulty: string
  totalAttempts: number
  correctAttempts: number
  incorrectAttempts: number
  accuracyRate?: number
  averageResponseTime?: number
  optionAnalysis?: OptionAnalysis[]
}

interface OptionAnalysis {
  optionText: string
  isCorrect: boolean
  selectionCount: number
  selectionPercentage: number
}

interface ParticipantReport {
  participantId: string
  nickname: string
  avatarId: string
  totalScore: number
  rank: number
  questionsAnswered: number
  correctAnswers: number
  incorrectAnswers: number
  accuracy?: number
  averageResponseTime?: number
  completionStatus: string
  performance: PerformanceMetrics
  answers: ParticipantAnswer[] // Added to include answers
}

interface ParticipantAnswer {
  questionId: string
  questionNumber: number
  questionText: string
  selectedOptionId: string
  selectedOptionText: string
  correctOptionId: string
  correctOptionText: string
  isCorrect: boolean
  pointsEarned: number
  maxPoints: number
  responseTime: number
  answeredAt: string
  answerStatus: string
  explanation: string | null
  responseSpeed: string
  wasGuessed: boolean
  attemptNumber: number
}

interface PerformanceMetrics {
  scorePercentile: number
  accuracyPercentile: number
  speedPercentile: number
  consistencyScore: number
  improvementTrend: string
}

interface PerformanceInsights {
  strengths?: string[]
  weaknesses?: string[]
  recommendations?: string[]
  dropoffRate?: number
  engagementLevel?: string
  difficultyBalance?: string
}

// Get auth headers
const getAuthHeaders = async () => {
  try {
    const session = await getSession()
    console.log("🔍 Checking session...", session ? "Session found" : "No session")
    if (!session) {
      throw new Error("No session found. Please login first.")
    }
    const token = (session as any)?.apiAccessToken
    if (!token) {
      console.error("❌ No API access token in session")
      throw new Error("No authentication token found. Please login again.")
    }
    console.log("✅ Auth token found, length:", token.length)
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  } catch (error) {
    console.error("❌ Error getting auth headers:", error)
    throw error
  }
}

// ===== MAIN COMPONENT =====
export default function SessionReportUI({ sessionCode }: { sessionCode: string }) {
  const [reportData, setReportData] = useState<SessionReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"summary" | "participants" | "questions" | "feedback" | "insights">(
    "summary",
  )
  const [exportFormat, setExportFormat] = useState<"PDF" | "CSV" | "EXCEL">("PDF")

  useEffect(() => {
    fetchSessionReport()
  }, [sessionCode])

  const fetchSessionReport = async () => {
    setLoading(true)
    setError("")
    try {
      const headers = await getAuthHeaders()
      const response = await axios.get(`https://stackquiz-api.stackquiz.me/api/v1/reports/session/${sessionCode}`, {
        params: {
          reportType: "DETAILED",
          includeDetailedAnswers: true,
          includePerformanceInsights: true,
          includeRecommendations: true,
        },
        headers,
      })
      const transformedData = {
        ...response.data,
        questionAnalysis: response.data.questionAnalysis.map((qa: any) => ({
          ...qa,
          optionAnalysis: qa.optionAnalysis.map((opt: any) => ({
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            selectionCount: opt.responseCount,
            selectionPercentage: opt.responsePercentage,
          })),
        })),
      }
      setReportData(transformedData)
    } catch (err: any) {
      console.error("Error fetching session report:", err)
      setError(err.response?.data?.message || "Failed to load session report")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await axios.get(`https://stackquiz-api.stackquiz.me/api/v1/reports/session/${sessionCode}/export`, {
        params: {
          format: exportFormat,
          reportType: "DETAILED",
        },
        headers,
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `session_report_${sessionCode}.${exportFormat.toLowerCase()}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error("Error exporting report:", err)
      alert("Failed to export report")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Report Not Available</h2>
          <p className="text-gray-600 text-center mb-4">{error || "Unable to load session report"}</p>
          <button
            onClick={fetchSessionReport}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-sm font-medium text-gray-600">Report</h1>
            </div>
            <button className="text-gray-600 hover:text-gray-900">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl font-bold text-gray-900">{reportData.quizTitle}</h2>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Edit2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-semibold text-gray-700">Live</span>
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <div className="text-sm text-gray-600">
                {new Date(reportData.startTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-sm text-gray-600">Host by : {reportData.hostName}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === "summary" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Summary
              {activeTab === "summary" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === "participants" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Participants ({reportData.participantReports.length})
              {activeTab === "participants" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === "questions" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Questions ({reportData.questionAnalysis.length})
              {activeTab === "questions" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === "feedback" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Feedback
              {activeTab === "feedback" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === "insights" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Insights
              {activeTab === "insights" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            </button>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "summary" && <SummaryTab key="summary" data={reportData} />}
              {activeTab === "participants" && (
                <ParticipantsTab
                  key="participants"
                  participants={reportData.participantReports}
                  reportData={reportData}
                />
              )}
              {activeTab === "questions" && <QuestionsTab key="questions" questions={reportData.questionAnalysis} />}
              {activeTab === "feedback" && <FeedbackTab key="feedback" />}
              {activeTab === "insights" && <InsightsTab key="insights" insights={reportData.performanceInsights} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== SUMMARY TAB =====
function SummaryTab({ data }: { data: SessionReportData }) {
  const stats = data.statistics
  const perfectScore = stats.averageAccuracy === 100

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left card - Score circle */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#10b981"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - stats.averageAccuracy / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-gray-900">{stats.averageAccuracy.toFixed(0)}%</div>
                <div className="text-sm font-medium text-gray-600 mt-1">Correct</div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{perfectScore ? "Perfection!" : "Great Job!"}</h3>
            <p className="text-gray-600 text-sm">
              {perfectScore
                ? "Play again and see if the same group can stay perfect or see if new participants can match this score."
                : "Keep practicing to improve your score and accuracy."}
            </p>
          </div>

          <button className="w-full py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700">
            Play Again
          </button>
        </div>

        {/* Right side - Stats */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Participants</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Completed</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.completedParticipants}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Time</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{Math.floor(data.duration / 60)} min</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-4xl">🏆</div>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 mb-2">
              View podium
            </button>
            <button className="w-full py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 border border-gray-200">
              Share podium
            </button>
            <p className="text-xs text-blue-800 mt-3">
              <strong>Top tip:</strong> Boost participant engagement by sharing the podium.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced reports section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-sm text-gray-600 mb-2">Difficult questions (0)</div>
            <div className="text-gray-500 text-sm">Great job! No one found any questions too challenging.</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-sm text-gray-600 mb-2">Need help (0)</div>
            <div className="text-gray-500 text-sm">No one seems to need help</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-sm text-gray-600 mb-2">Didn finish (0)</div>
            <div className="text-gray-500 text-sm">Great! Everyone finished</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ===== QUESTIONS TAB =====
function QuestionsTab({ questions }: { questions: QuestionAnalysis[] }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredQuestions = questions.filter((q) => q.questionText.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">All ({questions.length})</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Question</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Correct/Incorrect</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <QuestionRow key={question.questionNumber} question={question} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

function QuestionRow({ question }: { question: QuestionAnalysis }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="px-6 py-4">
          <div className="flex items-start space-x-3">
            <span className="font-semibold text-gray-900">{question.questionNumber}.</span>
            <span className="text-sm text-gray-800">{question.questionText}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="text-sm text-gray-700">{question.questionType}</span>
        </td>
        <td className="px-6 py-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">{(question.accuracyRate ?? 0).toFixed(0)}%</span>
          </div>
        </td>
        <td className="px-6 py-4 text-center">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={4} className="px-6 py-4 bg-gray-50">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-lg font-bold text-gray-800">{question.totalAttempts}</div>
                  <div className="text-xs text-gray-600">Attempts</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-lg font-bold text-green-600">{question.correctAttempts}</div>
                  <div className="text-xs text-green-700">Correct</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-lg font-bold text-red-600">{question.incorrectAttempts}</div>
                  <div className="text-xs text-red-700">Incorrect</div>
                </div>
              </div>

              {question.optionAnalysis && question.optionAnalysis.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Option Analysis:</h4>
                  {question.optionAnalysis.map((option, optIndex) => (
                    <div key={optIndex} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="text-sm font-medium text-gray-800">{option.optionText}</span>
                          {option.isCorrect && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              Correct
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {option.selectionCount} ({option.selectionPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${option.selectionPercentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ===== PARTICIPANTS TAB =====
function ParticipantsTab({
  participants,
  reportData,
}: { participants: ParticipantReport[]; reportData: SessionReportData | null }) {
  const [sortBy, setSortBy] = useState<"rank" | "score" | "accuracy">("rank")
  const [sortedParticipants, setSortedParticipants] = useState(participants)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null)

  useEffect(() => {
    const sorted = [...participants].sort((a, b) => {
      switch (sortBy) {
        case "rank":
          return (a.rank ?? Number.POSITIVE_INFINITY) - (b.rank ?? Number.POSITIVE_INFINITY)
        case "score":
          return b.totalScore - a.totalScore
        case "accuracy":
          return (b.accuracy ?? 0) - (a.accuracy ?? 0)
        default:
          return 0
      }
    })
    sorted.forEach((p, index) => {
      if (p.rank === undefined) p.rank = index + 1
    })
    setSortedParticipants(sorted)
  }, [sortBy, participants])

  const filteredParticipants = sortedParticipants.filter((p) =>
    p.nickname.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleExpand = (participantId: string) => {
    setExpandedParticipant(expandedParticipant === participantId ? null : participantId)
  }

  // Ensure totalQuestions is correctly accessed, providing a fallback if participants array is empty
  const totalQuestions = participants.length > 0 ? participants[0].answers.length : 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">All ({participants.length})</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nickname</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Correct answers</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Unanswered</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Final score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParticipants.map((participant) => (
              <ParticipantRow
                key={participant.participantId}
                participant={participant}
                expanded={expandedParticipant === participant.participantId}
                onToggle={() => toggleExpand(participant.participantId)}
                // Pass totalQuestions from the report's statistics, or 0 if not available
                totalQuestions={reportData?.statistics.totalQuestions || 0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

function ParticipantRow({
  participant,
  expanded,
  onToggle,
  totalQuestions,
}: {
  participant: ParticipantReport
  expanded: boolean
  onToggle: () => void
  totalQuestions: number
}) {
  const unanswered = totalQuestions - participant.questionsAnswered

  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={onToggle}>
        <td className="px-6 py-4 text-sm font-medium text-gray-900">{participant.nickname}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{participant.rank}</td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">{(participant.accuracy ?? 0).toFixed(0)}%</span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-700 text-center">{unanswered > 0 ? unanswered : "-"}</td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{participant.totalScore}</td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-gray-50">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Answer Breakdown</h4>
              {participant.answers.length > 0 ? (
                <div className="space-y-2">
                  {participant.answers.map((answer, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold text-blue-600">Q{answer.questionNumber}:</span>
                          <span className="ml-2 text-gray-700 text-sm">{answer.questionText}</span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            answer.isCorrect
                              ? "bg-green-100 text-green-700"
                              : answer.answerStatus === "INCORRECT"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {answer.isCorrect ? "Correct" : answer.answerStatus === "INCORRECT" ? "Wrong" : "Unattempted"}
                        </span>
                      </div>
                      {answer.selectedOptionText && (
                        <div className="ml-6 text-sm text-gray-600">
                          Selected: <span className="font-medium">{answer.selectedOptionText}</span>
                          {!answer.isCorrect && answer.correctOptionText && (
                            <span className="ml-2 text-green-600">(Correct: {answer.correctOptionText})</span>
                          )}
                        </div>
                      )}
                      <div className="ml-6 text-xs text-gray-500 mt-1">
                        Time: {answer.responseTime.toFixed(1)}s • Score: {answer.pointsEarned}/{answer.maxPoints}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic text-sm">No answers recorded.</div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ===== INSIGHTS TAB =====
function InsightsTab({ insights }: { insights?: PerformanceInsights }) {
  if (!insights) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-6"
      >
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Insights</h3>
          <p className="text-gray-600">No performance insights available for this session.</p>
        </div>
      </motion.div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          <span className="mr-2">💪</span> Strengths
        </h3>
        <ul className="space-y-2">
          {(insights?.strengths || []).map((strength, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-green-800">{strength}</span>
            </li>
          ))}
          {(!insights.strengths || insights.strengths.length === 0) && (
            <li className="text-green-600 italic">No specific strengths identified.</li>
          )}
        </ul>
      </div>
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
        <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
          <span className="mr-2">⚠️</span> Areas for Improvement
        </h3>
        <ul className="space-y-2">
          {(insights?.weaknesses || []).map((weakness, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-red-600 mt-1">!</span>
              <span className="text-red-800">{weakness}</span>
            </li>
          ))}
          {(!insights.weaknesses || insights.weaknesses.length === 0) && (
            <li className="text-red-600 italic">No areas for improvement identified.</li>
          )}
        </ul>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <span className="mr-2">💡</span> Recommendations
        </h3>
        <ul className="space-y-2">
          {(insights?.recommendations || []).map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">→</span>
              <span className="text-blue-800">{recommendation}</span>
            </li>
          ))}
          {(!insights.recommendations || insights.recommendations.length === 0) && (
            <li className="text-blue-600 italic">No recommendations available.</li>
          )}
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{(100 - (insights?.dropoffRate ?? 0)).toFixed(1)}%</div>
            <div className="text-sm text-gray-600 mt-2">Retention Rate</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{insights?.engagementLevel || "N/A"}</div>
            <div className="text-sm text-gray-600 mt-2">Engagement Level</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border-2 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{insights?.difficultyBalance || "N/A"}</div>
            <div className="text-sm text-gray-600 mt-2">Difficulty Balance</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ===== FEEDBACK TAB =====
function FeedbackTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">You didn receive feedback for this StackQuiz.</h3>
      <p className="text-gray-600 max-w-2xl mx-auto">
        To receive feedback for your next StackQuiz, select Get feedback when it finishes. Participants will be
        prompted to rate the quiz and share how the StackQuiz made them feel. They ll also be asked if they learned
        something and if they would recommend this StackQuiz.
      </p>
    </motion.div>
  )
}

// ===== HELPER COMPONENTS =====
type MetricCardColor = "blue" | "green" | "purple" | "orange"

interface MetricCardProps {
  icon: string
  label: string
  value: string | number
  color: MetricCardColor
}

function MetricCard({ icon, label, value, color }: MetricCardProps) {
  const colorClasses: Record<MetricCardColor, string> = {
    blue: "from-blue-50 to-blue-100 text-blue-800 border-blue-200",
    green: "from-green-50 to-green-100 text-green-800 border-green-200",
    purple: "from-purple-50 to-purple-100 text-purple-800 border-purple-200",
    orange: "from-orange-50 to-orange-100 text-orange-800 border-orange-200",
  }
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border-2`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-75">{label}</div>
    </motion.div>
  )
}

function ScoreDistributionChart({ participants }: { participants: ParticipantReport[] }) {
  const ranges = [
    { label: "0-20%", min: 0, max: 20, count: 0 },
    { label: "21-40%", min: 21, max: 40, count: 0 },
    { label: "41-60%", min: 41, max: 60, count: 0 },
    { label: "61-80%", min: 61, max: 80, count: 0 },
    { label: "81-100%", min: 81, max: 100, count: 0 },
  ]
  participants.forEach((p) => {
    const percentage = p.accuracy ?? 0
    const range = ranges.find((r) => percentage >= r.min && percentage <= r.max)
    if (range) range.count++
  })
  const maxCount = Math.max(...ranges.map((r) => r.count), 1)
  return (
    <div className="space-y-3">
      {ranges.map((range, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-20 text-sm font-medium text-gray-700">{range.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(range.count / maxCount) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-end pr-3"
            >
              {range.count > 0 && <span className="text-white font-bold text-sm">{range.count}</span>}
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  )
}
