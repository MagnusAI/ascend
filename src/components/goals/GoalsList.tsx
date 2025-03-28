import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import GoalCard from './GoalCard'
import GoalForm from './GoalForm'
import Text from '../atoms/Text'
import { GoalsListProps, Goal } from '../../types/components'

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onUpdate={fetchGoals} user={user} />
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
            <div className="relative transform overflow-hidden rounded-lg bg-dark-800 p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-md text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <GoalForm onSuccess={handleSuccess} onCancel={() => setIsFormOpen(false)} user={user} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 