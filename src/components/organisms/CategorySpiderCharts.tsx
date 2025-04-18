import { useMemo } from 'react'
import { Goal, ProgressLog } from '../../types/supabase'
import { SpiderChart } from '../molecules/SpiderChart'

interface CategorySpiderChartsProps {
  goals: Goal[]
  progressLogs: ProgressLog[]
}

export function CategorySpiderCharts({ goals, progressLogs }: CategorySpiderChartsProps) {
  // Get unique categories that have goals
  const categories = useMemo(() => {
    const uniqueCategories = new Set(goals.map(goal => goal.category))
    return Array.from(uniqueCategories)
  }, [goals])

  if (categories.length === 0) {
    return (
      <div className="text-primary-400 text-center py-8">
        No goals found. Create a goal to see your progress visualization.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map(category => (
        <div key={category}>
          <h3 className="text-primary-400 text-lg font-bold">{category}</h3>
          <SpiderChart
            goals={goals}
            progressLogs={progressLogs}
            category={category}
          />
        </div>
      ))}
    </div>
  )
} 