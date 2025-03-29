import { useMemo } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { Goal, ProgressLog } from '../../types/supabase'

interface SpiderChartProps {
  goals: Goal[]
  progressLogs: ProgressLog[]
  category: string
}

export function SpiderChart({ goals, progressLogs, category }: SpiderChartProps) {
  const chartData = useMemo(() => {
    // Filter goals for the current category
    const categoryGoals = goals.filter(goal => goal.category === category)

    // Create data points for each goal
    return categoryGoals.map(goal => {
      // Find the latest progress log for this goal
      const latestLog = progressLogs
        .filter(log => log.goal_id === goal.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

      // Calculate progress percentage
      const currentValue = latestLog ? latestLog.value : 0
      const progress = goal.target_type === 'above'
        ? Math.min((currentValue / goal.target_value) * 100, 100)
        : Math.min((goal.target_value / currentValue) * 100, 100)

      return {
        goal: goal.name,
        target: 100, // Always 100% for the target
        progress: progress,
      }
    })
  }, [goals, progressLogs, category])

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-primary-400">
        No goals in this category
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={chartData}
        >
          <PolarGrid
            stroke="#374151"
            strokeDasharray="4 4"
          />
          <PolarAngleAxis
            dataKey="goal"
            tick={{
              fill: '#9CA3AF',
              fontSize: 12,
              fontWeight: 500,
            }}
            tickLine={{ stroke: '#374151' }}
            axisLine={{ stroke: '#374151' }}
            stroke="#374151"
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            tickLine={{ stroke: '#374151' }}
            axisLine={{ stroke: '#374151' }}
            stroke="#374151"
          />
          <Radar
            name="Target"
            dataKey="target"
            stroke="#6B7280"
            fill="#6B7280"
            fillOpacity={0.1}
            isAnimationActive={false}
            dot={false}
          />
          <Radar
            name="Progress"
            dataKey="progress"
            stroke="#F97316"
            fill="#F97316"
            fillOpacity={0.3}
            isAnimationActive={false}
            dot={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
} 