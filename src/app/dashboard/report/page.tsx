"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import axios from "axios";
import { 
  Search, Calendar, Users, TrendingUp, Filter, MoreVertical, 
  Award, Target, Download, Play, Trash2, ChevronLeft, ChevronRight 
} from "lucide-react";

// ===== INTERFACES =====
interface SessionSummary {
  sessionId: string;
  sessionCode: string;
  sessionName: string;
  quizTitle: string;
  status: "WAITING" | "SCHEDULED" | "IN_PROGRESS" | "PAUSED" | "ENDED" | "CANCELLED";
  startTime: string;
  endTime: string;
  totalParticipants: number;
  averageAccuracy: number;
  completionRate: number;
  hostName: string;
  totalQuestions: number;
}

type FilterType = "ALL" | "RUNNING" | "SCHEDULED" | "ENDED" | "PAUSED";

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

// ===== ACTIONS DROPDOWN COMPONENT =====
interface ActionsDropdownProps {
  session: SessionSummary;
  onPlayAgain: () => void;
  onMoveToTrash: () => void;
}

function ActionsDropdown({ session, onPlayAgain, onMoveToTrash }: ActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setIsOpen(false);
    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  const exportToCSV = () => {
    const csvRows = [];
    
    // Header - Quiz Title (spans multiple columns with purple background effect)
    csvRows.push([session.quizTitle, '', '', '', '', '', '', '']);
    
    // Session Details
    csvRows.push(['Played on', session.startTime 
      ? new Date(session.startTime).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })
      : "Not started", '', '', '', '', '', ''
    ]);
    csvRows.push(['Hosted by', session.hostName, '', '', '', '', '', '']);
    csvRows.push(['Played with', `${session.totalParticipants} player${session.totalParticipants !== 1 ? 's' : ''}`, '', '', '', '', '', '']);
    csvRows.push(['Played', `${session.totalQuestions} of ${session.totalQuestions}`, '', '', '', '', '', '']);
    csvRows.push(['', '', '', '', '', '', '', '']); // Empty row
    
    // Overall Performance Section
    csvRows.push(['Overall Performance', '', '', '', '', '', '', '']);
    csvRows.push(['Total correct answers (%)', `${session.averageAccuracy.toFixed(2)}%`, '', '', '', '', '', '']);
    csvRows.push(['Total incorrect answers (%)', `${(100 - session.averageAccuracy).toFixed(2)}%`, '', '', '', '', '', '']);
    csvRows.push(['Average score (points)', `${(session.averageAccuracy * 10).toFixed(2)} points`, '', '', '', '', '', '']);
    csvRows.push(['', '', '', '', '', '', '', '']); // Empty row
    
    // Feedback Section
    csvRows.push(['Feedback', '', '', '', '', '', '', '']);
    csvRows.push(['Number of responses', '0', '', '', '', '', '', '']);
    csvRows.push(['How fun was it? (out of 5)', '0.00 out of 5', '', '', '', '', '', '']);
    csvRows.push(['Did you learn something?', '0.00% Yes', '', '0.00% No', '', '', '', '']);
    csvRows.push(['Do you recommend it?', '0.00% Yes', '', '0.00% No', '', '', '', '']);
    csvRows.push(['How do you feel?', '0.00% Positive', '', '0.00% Neutral', '', '0.00% Negative', '', '']);
    csvRows.push(['', '', '', '', '', '', '', '']); // Empty row
    
    // Footer message
    csvRows.push(['Switch tabs/pages to view other result breakdown', '', '', '', '', '', '', '']);
    
    // Convert to CSV string with proper formatting
    const csvContent = '\uFEFF' + csvRows
      .map(row => row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma, newline, or quote
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(','))
      .join('\r\n');
    
    // Create blob with proper Excel compatibility
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Create filename with session code and date
    const dateStr = new Date().toISOString().split('T')[0];
    const cleanTitle = session.quizTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
    const fileName = `${session.sessionCode}_${cleanTitle}_${dateStr}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    setIsOpen(false);
  };

  const handlePlayAgain = () => {
    onPlayAgain();
    setIsOpen(false);
  };

  const handleMoveToTrash = () => {
    onMoveToTrash();
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl sm:rounded-2xl transition-all flex items-center justify-between group"
      >
        <span className="text-slate-700 font-medium text-sm sm:text-base">More Actions</span>
        <MoreVertical className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-600 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-3 mb-2 left-0 right-0 z-50 bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden">
          <div className="py-1">
            {/* Play Again */}
            <button
              onClick={handlePlayAgain}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 fill-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-slate-800">Play Again</div>
                <div className="text-xs text-slate-500 hidden sm:block">Start a new session</div>
              </div>
            </button>

            {/* Export Report - Only show for ENDED sessions */}
            {session.status === "ENDED" && (
              <button
                onClick={exportToCSV}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 hover:bg-emerald-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-slate-800">Export Report</div>
                  <div className="text-xs text-slate-500 hidden sm:block">Download as CSV file</div>
                </div>
              </button>
            )}

            {/* Move to Trash */}
            <button
              onClick={handleMoveToTrash}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 hover:bg-red-50 transition-colors text-left group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-red-600">Move to Trash</div>
                <div className="text-xs text-red-500 hidden sm:block">Delete this session</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== PAGINATION COMPONENT =====
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (showEllipsisStart) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (showEllipsisEnd) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-all ${
          currentPage === 1
            ? 'text-slate-300 cursor-not-allowed'
            : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-1 sm:gap-2">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-all ${
          currentPage === totalPages
            ? 'text-slate-300 cursor-not-allowed'
            : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHostSessions();
  }, []);

  useEffect(() => {
    filterAndSortSessions();
    setCurrentPage(1); // Reset to first page when filters change
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
          case "ENDED":
            return session.status === "ENDED";
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ENDED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      IN_PROGRESS: "bg-blue-500/10 text-blue-600 border-blue-500/20 animate-pulse",
      SCHEDULED: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      PAUSED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      WAITING: "bg-gray-500/10 text-gray-600 border-gray-500/20",
      CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20"
    };
    const labels: Record<string, string> = {
      ENDED: "ENDED",
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

  const handlePlayAgain = (session: SessionSummary) => {
    console.log("Play again:", session.sessionCode);
    alert(`Play Again: ${session.quizTitle}`);
  };

  const handleMoveToTrash = async (session: SessionSummary) => {
    if (confirm(`Are you sure you want to move "${session.quizTitle}" to trash?`)) {
      try {
        const headers = await getAuthHeaders();
        console.log("Moving to trash:", session.sessionCode);
        setSessions(sessions.filter(s => s.sessionId !== session.sessionId));
        alert(`"${session.quizTitle}" has been moved to trash`);
      } catch (err: any) {
        console.error("Error moving to trash:", err);
        alert("Failed to move session to trash");
      }
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
        case "ENDED":
          return session.status === "ENDED";
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg">Track performance and insights across all sessions</p>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 border border-slate-200/60 shadow-lg">
              <div className="text-xs sm:text-sm text-slate-600">Total Sessions</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">{sessions.length}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 border border-slate-200/60 shadow-lg">
              <div className="text-xs sm:text-sm text-slate-600">Avg Accuracy</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600">{calculateAverageAccuracy()}%</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/60 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search sessions, quizzes, or codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-2 sm:gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
              >
                <option value="date">Latest first</option>
                <option value="participants">Most participants</option>
                <option value="accuracy">Highest accuracy</option>
              </select>
              <button 
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3 sm:px-4 py-3 sm:py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl hover:bg-slate-100 transition-all"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {(["ALL", "ENDED", "RUNNING", "SCHEDULED", "PAUSED"] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Sessions Grid */}
        {currentSessions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200/60 shadow-xl">
            <div className="text-4xl sm:text-6xl mb-4">📭</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No sessions found</h3>
            <p className="text-sm sm:text-base text-gray-600">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Start hosting quizzes to see reports here"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6">
              {currentSessions.map((session, index) => {
                const statusBadge = getStatusBadge(session.status);
                return (
                  <div
                    key={session.sessionId}
                    className="group bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Left: Gradient Card */}
                      <div className={`bg-gradient-to-br ${getGradient(index)} p-6 sm:p-8 lg:w-80 text-white relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm bg-white/20 border-white/30 text-white ${session.status === 'IN_PROGRESS' ? 'animate-pulse' : ''}`}>
                              {statusBadge.label}
                            </span>
                            <div className="text-xs font-mono bg-white/20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg backdrop-blur-sm">
                              {session.sessionCode}
                            </div>
                          </div>
                          
                          <h3 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2">
                            {session.quizTitle}
                          </h3>
                          <p className="text-white/80 text-sm mb-4 sm:mb-6 line-clamp-1">{session.sessionName}</p>
                          
                          <div className="flex items-center gap-2 text-sm text-white/90">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                              {session.startTime
                                ? new Date(session.startTime).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                  })
                                : "Not started"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Stats and Actions */}
                      <div className="flex-1 p-6 sm:p-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                          {/* Participants */}
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 text-xs sm:text-sm">
                              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>Participants</span>
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                              {session.totalParticipants}
                            </div>
                          </div>

                          {/* Accuracy */}
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 text-xs sm:text-sm">
                              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>Accuracy</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`text-2xl sm:text-3xl font-bold ${getAccuracyColor(session.averageAccuracy)}`}>
                                {session.averageAccuracy.toFixed(0)}%
                              </div>
                              <CircularProgress value={session.averageAccuracy} />
                            </div>
                          </div>

                          {/* Completion Rate */}
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 text-xs sm:text-sm">
                              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>ENDED</span>
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                              {session.completionRate}%
                            </div>
                          </div>

                          {/* Questions */}
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 text-xs sm:text-sm">
                              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>Questions</span>
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                              {session.totalQuestions}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <button
                            onClick={() => handleViewReport(session.sessionCode)}
                            disabled={session.status !== "ENDED"}
                            className={`w-full px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all ${
                              session.status === "ENDED"
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            {session.status === "ENDED" ? "View Full Report" : "Report Unavailable"}
                          </button>
                          
                          <ActionsDropdown
                            session={session}
                            onPlayAgain={() => handlePlayAgain(session)}
                            onMoveToTrash={() => handleMoveToTrash(session)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
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
    <div className="relative w-8 h-8 sm:w-10 sm:h-10">
      <svg className="transform -rotate-90 w-8 h-8 sm:w-10 sm:h-10">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
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