"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import axios from "axios";
import { Search, Calendar, Users, TrendingUp, Filter, MoreVertical, Award, Target } from "lucide-react";

// ===== INTERFACES =====
interface SessionSummary {
  sessionId: string;
  sessionCode: string;
  sessionName: string;
  quizTitle: string;
  status: "WAITING" | "SCHEDULED" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "CANCELLED";
  startTime: string;
  endTime: string;
  totalParticipants: number;
  averageAccuracy: number;
  completionRate: number;
  hostName: string;
  totalQuestions: number;
}

type FilterType = "ALL" | "RUNNING" | "SCHEDULED" | "COMPLETED" | "PAUSED";

const getAuthHeaders = async () => {
  try {
    const session = await getSession();
    console.log("🔍 Checking session...", session ? "Session found" : "No session");
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
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } catch (error) {
    console.error("❌ Error getting auth headers:", error);
    throw error;
  }
};

// ===== MAIN COMPONENT =====
export default function ReportsHistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "participants" | "accuracy">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchHostSessions();
  }, []);

  useEffect(() => {
    filterAndSortSessions();
  }, [sessions, activeFilter, searchQuery, sortBy, sortOrder]);

  const fetchHostSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(
        `https://stackquiz-api.stackquiz.me/api/v1/reports-history/my-sessions`,
        { headers }
      );
      setSessions(response.data);
    } catch (err: any) {
      console.error("Error fetching sessions:", err);
      setError(err.response?.data?.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSessions = () => {
    let filtered = [...sessions];

    if (activeFilter !== "ALL") {
      filtered = filtered.filter((session) => {
        switch (activeFilter) {
          case "RUNNING":
            return session.status === "IN_PROGRESS";
          case "SCHEDULED":
            return session.status === "SCHEDULED";
          case "COMPLETED":
            return session.status === "COMPLETED";
          case "PAUSED":
            return session.status === "PAUSED";
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (session) =>
          session.quizTitle.toLowerCase().includes(query) ||
          session.sessionName.toLowerCase().includes(query) ||
          session.sessionCode.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          break;
        case "participants":
          comparison = a.totalParticipants - b.totalParticipants;
          break;
        case "accuracy":
          comparison = a.averageAccuracy - b.averageAccuracy;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredSessions(filtered);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      IN_PROGRESS: "bg-blue-500/10 text-blue-600 border-blue-500/20 animate-pulse",
      SCHEDULED: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      PAUSED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      WAITING: "bg-gray-500/10 text-gray-600 border-gray-500/20",
      CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20"
    };
    const labels = {
      COMPLETED: "Completed",
      IN_PROGRESS: "Live Now",
      SCHEDULED: "Scheduled",
      PAUSED: "Paused",
      WAITING: "Waiting",
      CANCELLED: "Cancelled"
    };
    return { style: styles[status] || styles.WAITING, label: labels[status] || status };
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 70) return "text-emerald-600";
    if (accuracy >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getGradient = (index: number) => {
    const gradients = [
      "from-violet-500 to-purple-600",
      "from-blue-500 to-cyan-600",
      "from-emerald-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-pink-500 to-rose-600",
      "from-indigo-500 to-blue-600"
    ];
    return gradients[index % gradients.length];
  };

  const handleViewReport = (sessionCode: string) => {
    console.log("handleViewReport called with sessionCode:", sessionCode);
    const reportUrl = `/dashboard/host/${sessionCode}/report`;
    console.log("Attempting to navigate to:", reportUrl);
    try {
      router.push(reportUrl);
      console.log("Navigation pushed successfully");
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  const getFilterCount = (filter: FilterType) => {
    if (filter === "ALL") return sessions.length;
    return sessions.filter((session) => {
      switch (filter) {
        case "RUNNING":
          return session.status === "IN_PROGRESS";
        case "SCHEDULED":
          return session.status === "SCHEDULED";
        case "COMPLETED":
          return session.status === "COMPLETED";
        case "PAUSED":
          return session.status === "PAUSED";
        default:
          return false;
      }
    }).length;
  };

  const calculateAverageAccuracy = () => {
    if (sessions.length === 0) return 0;
    const total = sessions.reduce((sum, s) => sum + s.averageAccuracy, 0);
    return Math.round(total / sessions.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 text-lg">Track performance and insights across all sessions</p>
          </div>

          {/* Stats Cards - Compact */}
          <div className="flex gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-3 border border-slate-200/60 shadow-lg">
              <div className="text-sm text-slate-600">Total Sessions</div>
              <div className="text-2xl font-bold text-slate-900">{sessions.length}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-3 border border-slate-200/60 shadow-lg">
              <div className="text-sm text-slate-600">Avg Accuracy</div>
              <div className="text-2xl font-bold text-emerald-600">{calculateAverageAccuracy()}%</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sessions, quizzes, or codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer appearance-none pr-10"
              >
                <option value="date">Latest first</option>
                <option value="participants">Most participants</option>
                <option value="accuracy">Highest accuracy</option>
              </select>
              <button 
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all"
              >
                <Filter className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {(["ALL", "COMPLETED", "RUNNING", "SCHEDULED", "PAUSED"] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filter === "ALL" ? "All Sessions" : filter === "RUNNING" ? "Live Now" : filter.replace("_", " ")} ({getFilterCount(filter)})
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 text-center border border-slate-200/60 shadow-xl">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No sessions found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Start hosting quizzes to see reports here"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredSessions.map((session, index) => {
              const statusBadge = getStatusBadge(session.status);
              return (
                <div
                  key={session.sessionId}
                  className="group bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Left: Gradient Card with Key Info */}
                    <div className={`bg-gradient-to-br ${getGradient(index)} p-8 lg:w-80 text-white relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm bg-white/20 border-white/30 text-white ${session.status === 'IN_PROGRESS' ? 'animate-pulse' : ''}`}>
                            {statusBadge.label}
                          </span>
                          <div className="text-xs font-mono bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                            {session.sessionCode}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2 line-clamp-2">
                          {session.quizTitle}
                        </h3>
                        <p className="text-white/80 text-sm mb-6">{session.sessionName}</p>
                        
                        <div className="flex items-center gap-2 text-sm text-white/90">
                          <Calendar className="w-4 h-4" />
                          {session.startTime
                            ? new Date(session.startTime).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })
                            : "Not started"}
                        </div>
                      </div>
                    </div>

                    {/* Right: Stats and Actions */}
                    <div className="flex-1 p-8">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Participants */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Users className="w-4 h-4" />
                            <span>Participants</span>
                          </div>
                          <div className="text-3xl font-bold text-slate-900">
                            {session.totalParticipants}
                          </div>
                        </div>

                        {/* Accuracy */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Target className="w-4 h-4" />
                            <span>Accuracy</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`text-3xl font-bold ${getAccuracyColor(session.averageAccuracy)}`}>
                              {session.averageAccuracy.toFixed(0)}%
                            </div>
                            <CircularProgress value={session.averageAccuracy} />
                          </div>
                        </div>

                        {/* Completion Rate */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Award className="w-4 h-4" />
                            <span>Completed</span>
                          </div>
                          <div className="text-3xl font-bold text-slate-900">
                            {session.completionRate}%
                          </div>
                        </div>

                        {/* Questions */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>Questions</span>
                          </div>
                          <div className="text-3xl font-bold text-slate-900">
                            {session.totalQuestions}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewReport(session.sessionCode)}
                          disabled={session.status !== "COMPLETED"}
                          className={`flex-1 px-6 py-3.5 rounded-2xl font-semibold transition-all ${
                            session.status === "COMPLETED"
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {session.status === "COMPLETED" ? "View Full Report" : "Report Unavailable"}
                        </button>
                        <button className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">
                          <MoreVertical className="w-5 h-5 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Circular Progress Component
function CircularProgress({ value }: { value: number }) {
  const getColor = (val: number) => {
    if (val >= 70) return "#10b981";
    if (val >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-10 h-10">
      <svg className="transform -rotate-90 w-10 h-10">
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={getColor(value)}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
    </div>
  );
}