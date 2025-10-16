'use client'
// 
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
import { getSession } from "next-auth/react";
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
function StatCard({ title, value, subtitle, trend, icon, color }: { 
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  icon?: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        {trend && (
          <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}

function ChartCard({ title, children, subtitle }: { 
  title: string
  subtitle?: string
  children: React.ReactNode 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="h-72">{children}</div>
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
      const res = await fetch(`http://localhost:9999/api/v1/analytics/activity/${range}`, {
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
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '1year', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Unable to load analytics data. Please try again later.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your quiz performance and engagement metrics</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as TimeRange)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timeRange === option.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
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
            color="bg-blue-100"
          />
          <StatCard
            title="Total Sessions"
            value={stats.totalSessionsStarted}
            subtitle={`${stats.activeSessionsCount} currently active`}
            trend="+8%"
            icon="🎮"
            color="bg-purple-100"
          />
          <StatCard
            title="Total Participants"
            value={stats.totalParticipants}
            subtitle={`${Number(stats.averageParticipantsPerSession).toFixed(1)} avg per session`}
            trend="+15%"
            icon="👥"
            color="bg-green-100"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats.sessionCompletionRate}%`}
            subtitle="Session completion"
            icon="✅"
            color="bg-orange-100"
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
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 }
                  }
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                  },
                  y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { size: 11 } }
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
                    borderColor: 'rgb(168, 85, 247)',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: 'rgb(168, 85, 247)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 }
                  }
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                  },
                  y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { size: 11 } }
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
                labels: Object.keys(stats.quizzesByDifficulty),
                datasets: [
                  {
                    data: Object.values(stats.quizzesByDifficulty),
                    backgroundColor: [
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(234, 179, 8, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                    ],
                    borderWidth: 2,
                    borderColor: '#fff',
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
                      padding: 15,
                      font: { size: 12 },
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
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
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderRadius: 8,
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
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                  }
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                  },
                  y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { size: 11 } }
                  }
                }
              }}
            />
          </ChartCard>
        </div>

        {/* Most Popular Quiz */}
        {stats.mostPopularQuiz && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-sm border border-orange-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏆</span>
              <h2 className="text-xl font-bold text-gray-900">Most Popular Quiz</h2>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-2xl font-bold text-gray-900 mb-3">{stats.mostPopularQuiz.title}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-xl">📊</span>
                  <span className="font-semibold">{stats.mostPopularQuiz.totalSessions}</span>
                  <span className="text-sm">sessions</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-xl">👥</span>
                  <span className="font-semibold">{stats.mostPopularQuiz.totalParticipants}</span>
                  <span className="text-sm">participants</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  {getActivityIcon(activity.activityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 mb-1">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
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