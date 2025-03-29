import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Goal, ProgressLog } from '../../types/supabase'

interface ProgressLineChartProps {
  goal: Goal
  progressLogs: ProgressLog[]
}

export function ProgressLineChart({ goal, progressLogs }: ProgressLineChartProps) {
  const chartData = useMemo(() => {
    // Sort logs by timestamp
    const sortedLogs = [...progressLogs].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    // Create data points for each log
    return sortedLogs.map(log => ({
      date: new Date(log.timestamp).toLocaleDateString(),
      value: log.value,
      target: goal.target_value,
    }))
  }, [goal, progressLogs])

  if (progressLogs.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-primary-400">
        No progress logs yet
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid 
            stroke="#374151" 
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.375rem',
            }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#F97316"
            strokeWidth={2}
            dot={{
              fill: '#F97316',
              stroke: '#F97316',
              strokeWidth: 2,
              r: 4,
            }}
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#6B7280"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 