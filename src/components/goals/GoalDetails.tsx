import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Goal } from '../../types/supabase'
import AppBar from '../AppBar'
import Text from '../atoms/Text'
import EditGoalForm from './EditGoalForm'

interface GoalDetailsProps {
  user: User
}

export default function GoalDetails({ user }: GoalDetailsProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [goal, setGoal] = useState<Goal | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGoal = async () => {
      if (!id) return

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) {
        setError('Failed to load goal')
        return
      }

      setGoal(data)
    }

    fetchGoal()
  }, [id, user.id])

  const handleDelete = async () => {
    if (!id) return

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      navigate('/dashboard')
    } catch (error) {
      console.error('Error deleting goal:', error)
      setError('Failed to delete goal')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900">
        <AppBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-dark-900">
        <AppBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Text variant="accent" size="xl">
            Loading...
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <AppBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <Text variant="accent" size="xl">
              {goal.name}
            </Text>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm font-medium text-primary-400 hover:text-primary-300"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="bg-dark-800 rounded-lg p-6">
            <EditGoalForm
              goal={goal}
              onSuccess={() => {
                setIsEditing(false)
                // Refresh goal data
                const fetchGoal = async () => {
                  const { data, error } = await supabase
                    .from('goals')
                    .select('*')
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .single()

                  if (!error && data) {
                    setGoal(data)
                  }
                }
                fetchGoal()
              }}
              onCancel={() => setIsEditing(false)}
              user={user}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-dark-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Text variant="muted" size="sm">Category</Text>
                  <Text variant="default" size="base">{goal.category}</Text>
                </div>
                <div className="flex flex-col gap-2">
                  <Text variant="muted" size="sm">Status</Text>
                  <Text variant="default" size="base">{goal.status}</Text>
                </div>
                <div className="flex flex-col gap-2">
                  <Text variant="muted" size="sm">Target Value</Text>
                  <Text variant="default" size="base">{goal.target_value} {goal.unit}</Text>
                </div>
                <div className="flex flex-col gap-2">
                  <Text variant="muted" size="sm">Due Date</Text>
                  <Text variant="default" size="base">
                    {goal.due_date ? new Date(goal.due_date).toLocaleDateString() : 'No due date'}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 