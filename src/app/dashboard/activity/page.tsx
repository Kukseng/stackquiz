'use client'

import { useEffect, useState } from 'react'
import { Line, Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { getSession } from "next-auth/react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// ===== Types =====
type TimeRange = '7days' | '30days' | '90days' | '1year' | 'all'

interface TimeSeriesPoint {
  date: string
  count: number
}

interface MostPopularQuiz {
  title: string
  totalSessions: number
  totalParticipants: number
}

interface RecentActivity {
  description: string
  timestamp: string
  activityType: string
}

interface ActivityByDayOfWeek {
  MONDAY?: number
  TUESDAY?: number
  WEDNESDAY?: number
  THURSDAY?: number
  FRIDAY?: number
  SATURDAY?: number
  SUNDAY?: number
  [key: string]: number | undefined
}

interface Stats {
  totalQuizzesCreated: number
  quizzesCreatedThisWeek: number
  totalSessionsStarted: number
  activeSessionsCount: number
  totalParticipants: number
  averageParticipantsPerSession: number
  sessionCompletionRate: number
  quizCreationTimeSeries: TimeSeriesPoint[]
  sessionActivityTimeSeries: TimeSeriesPoint[]
  quizzesByDifficulty: Record<string, number>
  activityByDayOfWeek: ActivityByDayOfWeek
  mostPopularQuiz?: MostPopularQuiz | null
  recentActivities: RecentActivity[]
}

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

// ===== Components =====
function StatCard({ title, value, subtitle, trend, icon, gradient }: { 
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  icon?: string
  gradient: string
}) {
  return (
    <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/60 p-6 hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Gradient Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-200">
              {trend}
            </span>
          )}
        </div>
        <h3 className="text-slate-600 text-sm font-semibold mb-2 uppercase tracking-wide">{title}</h3>
        <p className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">{value}</p>
        {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
      </div>
    </div>
  )
}

function ChartCard({ title, children, subtitle }: { 
  title: string
  subtitle?: string
  children: React.ReactNode 
}) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/60 p-8 hover:shadow-2xl transition-all duration-300">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
      </div>
      <div className="h-80">{children}</div>
    </div>
  )
}

// ===== Page =====
export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('30days')
  const [loading, setLoading] = useState<boolean>(true)
  const [cache, setCache] = useState<Record<TimeRange, Stats>>({} as Record<TimeRange, Stats>)

  useEffect(() => {
    fetchStats(timeRange)
  }, [timeRange])

  async function fetchStats(range: TimeRange) {
    // Check cache first
    if (cache[range]) {
      console.log(`✅ Loading ${range} from cache`)
      setStats(cache[range])
      setLoading(false)
      return
    }

    console.log(`⏳ Fetching ${range} from API...`)
    setLoading(true)
    try {
      const res = await fetch(`https://stackquiz-api.stackquiz.me/api/v1/analytics/activity/${range}`, {
        headers: await getAuthHeaders(),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      
      const data = (await res.json()) as Stats
      data.quizCreationTimeSeries = data.quizCreationTimeSeries || []
      data.sessionActivityTimeSeries = data.sessionActivityTimeSeries || []
      data.quizzesByDifficulty = data.quizzesByDifficulty || {}
      data.activityByDayOfWeek = data.activityByDayOfWeek || {}
      data.recentActivities = data.recentActivities || []
      
      // Store in cache
      setCache(prev => ({ ...prev, [range]: data }))
      setStats(data)
      console.log(`✅ Cached ${range} data`)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const timeRangeOptions = [
    { value: '7days', label: '7D' },
    { value: '30days', label: '30D' },
    { value: '90days', label: '90D' },
    { value: '1year', label: '1Y' },
    { value: 'all', label: 'All' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative text-center">
          <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-700 font-semibold text-lg">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-md border border-slate-200">
          <div className="text-7xl mb-6">📊</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">No Data Available</h2>
          <p className="text-slate-600">Unable to load analytics data. Please try again later.</p>
        </div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      'QUIZ_CREATED': '📝',
      'SESSION_STARTED': '🎮',
      'SESSION_COMPLETED': '✅',
      'PARTICIPANT_JOINED': '👤'
    }
    return icons[type] || '📌'
  }

  // Normalize difficulty labels to Easy, Medium, Hard
  const normalizeDifficulty = (difficulty: string): string => {
    const normalized = difficulty.toLowerCase()
    if (normalized === 'easy' || normalized === 'beginner') return 'Easy'
    if (normalized === 'medium' || normalized === 'intermediate') return 'Medium'
    if (normalized === 'hard' || normalized === 'advanced' || normalized === 'expert') return 'Hard'
    return difficulty
  }

  const normalizedDifficulty: Record<string, number> = {}
  Object.entries(stats.quizzesByDifficulty).forEach(([key, value]) => {
    const normalized = normalizeDifficulty(key)
    normalizedDifficulty[normalized] = (normalizedDifficulty[normalized] || 0) + value
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent mb-3">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 text-lg font-medium">Track your quiz performance and engagement metrics</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-slate-200/60">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as TimeRange)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  timeRange === option.value
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Quizzes"
            value={stats.totalQuizzesCreated}
            subtitle={`${stats.quizzesCreatedThisWeek} created this week`}
            trend="+12%"
            icon="📝"
            gradient="from-blue-500 to-cyan-600"
          />
          <StatCard
            title="Total Sessions"
            value={stats.totalSessionsStarted}
            subtitle={`${stats.activeSessionsCount} currently active`}
            trend="+8%"
            icon="🎮"
            gradient="from-purple-500 to-pink-600"
          />
          <StatCard
            title="Total Participants"
            value={stats.totalParticipants}
            subtitle={`${Number(stats.averageParticipantsPerSession).toFixed(1)} avg per session`}
            trend="+15%"
            icon="👥"
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats.sessionCompletionRate}%`}
            subtitle="Session completion"
            icon="✅"
            gradient="from-orange-500 to-amber-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quiz Creation Over Time */}
          <ChartCard 
            title="Quiz Creation Trend" 
            subtitle="Number of quizzes created over time"
          >
            <Line
              data={{
                labels: stats.quizCreationTimeSeries.map((d) => d.date),
                datasets: [
                  {
                    label: 'Quizzes Created',
                    data: stats.quizCreationTimeSeries.map((d) => d.count),
                    borderColor: 'rgb(139, 92, 246)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(139, 92, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: 16,
                    cornerRadius: 12,
                    titleFont: { size: 15, weight: 'bold' },
                    bodyFont: { size: 14 },
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    borderWidth: 1
                  }
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 12, weight: '500' }, color: '#64748b' }
                  },
                  y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)', lineWidth: 1 },
                    ticks: { font: { size: 12, weight: '500' }, color: '#64748b' }
                  }
                }
              }}
            />
          </ChartCard>

          {/* Session Activity */}
          <ChartCard 
            title="Session Activity" 
            subtitle="Sessions started over time"
          >
            <Line
              data={{
                labels: stats.sessionActivityTimeSeries.map((d) => d.date),
                datasets: [
                  {
                    label: 'Sessions Started',
                    data: stats.sessionActivityTimeSeries.map((d) => d.count),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: 16,
                    cornerRadius: 12,
                    titleFont: { size: 15, weight: 'bold' },
                    bodyFont: { size: 14 },
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                    borderWidth: 1
                  }
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 12, weight: '500' }, color: '#64748b' }
                  },
                  y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)', lineWidth: 1 },
                    ticks: { font: { size: 12, weight: '500' }, color: '#64748b' }
                  }
                }
              }}
            />
          </ChartCard>

          {/* Quiz Difficulty Distribution */}
          <ChartCard 
            title="Quiz Difficulty Distribution" 
            subtitle="Breakdown by difficulty level"
          >
            <Pie
              data={{
                labels: Object.keys(normalizedDifficulty),
                datasets: [
                  {
                    data: Object.values(normalizedDifficulty),
                    backgroundColor: [
                      'rgba(34, 197, 94, 0.85)',
                      'rgba(250, 204, 21, 0.85)',
                      'rgba(239, 68, 68, 0.85)',
                    ],
                    borderWidth: 4,
                    borderColor: '#fff',
                    hoverOffset: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      font: { size: 13, weight: 'bold' },
                      usePointStyle: true,
                      pointStyle: 'circle',
                      color: '#334155'
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: 16,
                    cornerRadius: 12,
                    titleFont: { size: 15, weight: 'bold' },
                    bodyFont: { size: 14 },
                  }
                }
              }}
            />
          </ChartCard>

          {/* Activity by Day of Week */}
          <ChartCard 
            title="Activity by Day" 
            subtitle="Weekly activity pattern"
          >
            <Bar
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    label: 'Activity Count',
                    data: [
                      stats.activityByDayOfWeek.MONDAY || 0,
                      stats.activityByDayOfWeek.TUESDAY || 0,
                      stats.activityByDayOfWeek.WEDNESDAY || 0,
                      stats.activityByDayOfWeek.THURSDAY || 0,
                      stats.activityByDayOfWeek.FRIDAY || 0,
                      stats.activityByDayOfWeek.SATURDAY || 0,
                      stats.activityByDayOfWeek.SUNDAY || 0,
                    ],
                    backgroundColor: [
                      'rgba(139, 92, 246, 0.85)',
                      'rgba(59, 130, 246, 0.85)',
                      'rgba(14, 165, 233, 0.85)',
                      'rgba(34, 197, 94, 0.85)',
                      'rgba(250, 204, 21, 0.85)',
                      'rgba(251, 146, 60, 0.85)',
                      'rgba(239, 68, 68, 0.85)',
                    ],
                    borderRadius: 12,
                    borderSkipped: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: 16,
                    cornerRadius: 12,
                    titleFont: { size: 15, weight: 'bold' },
                    bodyFont: { size: 14 },
                  }
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 12, weight: '500' }, color: '#64748b' }
                  },
                  y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)', lineWidth: 1 },
                    ticks: { font: { size: 12, weight: '500' }, color: '#64748b' }
                  }
                }
              }}
            />
          </ChartCard>
        </div>

        {/* Most Popular Quiz */}
        {stats.mostPopularQuiz && (
          <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-lg border border-orange-200/60 p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-300/20 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  🏆
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Most Popular Quiz</h2>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                <p className="text-2xl font-bold text-slate-900 mb-4">{stats.mostPopularQuiz.title}</p>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">📊</div>
                    <div>
                      <span className="block text-2xl font-bold text-slate-900">{stats.mostPopularQuiz.totalSessions}</span>
                      <span className="text-sm text-slate-600 font-medium">sessions</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl">👥</div>
                    <div>
                      <span className="block text-2xl font-bold text-slate-900">{stats.mostPopularQuiz.totalParticipants}</span>
                      <span className="text-sm text-slate-600 font-medium">participants</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/60 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-md">
                  {getActivityIcon(activity.activityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 mb-1">{activity.description}</p>
                  <p className="text-sm text-slate-500 font-medium">
                    {new Date(activity.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold whitespace-nowrap border border-blue-200">
                  {activity.activityType.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}