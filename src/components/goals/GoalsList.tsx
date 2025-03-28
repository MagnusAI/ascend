import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import GoalCard from './GoalCard'
import GoalForm from './GoalForm'
import Text from '../atoms/Text'
import { User, Goal } from '../../types/supabase'

interface GoalsListProps {
  user: User
}

export default function GoalsList({ user }: GoalsListProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGoals(data || [])
    } catch (error) {
      console.error('Error fetching goals:', error)
      setError('Failed to load goals')
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleSuccess = () => {
    setIsFormOpen(false)
    fetchGoals()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Text variant="accent" size="lg">
          Your Goals
        </Text>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          New Goal
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <GoalForm onSuccess={handleSuccess} onCancel={() => setIsFormOpen(false)} user={user} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onUpdate={fetchGoals} />
        ))}
      </div>
    </div>
  )
} 