import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Text from '../atoms/Text'
import { Goal } from '../../types/supabase'

interface GoalCardProps {
  goal: Goal
  onUpdate: () => void
}

export default function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goal.id)

      if (error) throw error
      onUpdate()
    } catch (error) {
      console.error('Error deleting goal:', error)
      setError('Failed to delete goal')
    }
  }

  return (
    <div className="border-2 border-dark-800 rounded-lg p-6 bg-dark-800/50 backdrop-blur-sm shadow-neon">
      <div className="flex justify-between items-start">
        <div>
          <Text variant="accent" size="lg">{goal.name}</Text>
          <Text variant="muted" size="sm" className="mt-1">
            {goal.category} • {goal.frequency || 'No frequency'}
          </Text>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-primary-400 hover:text-primary-300 hover:bg-dark-700 rounded-md transition-colors duration-200"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-red-400 hover:text-red-300 hover:bg-dark-700 rounded-md transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-4 space-y-2">
        <Text variant="muted" size="sm">
          Title: {goal.title}
        </Text>
        {goal.description && (
          <Text variant="muted" size="sm">
            Description: {goal.description}
          </Text>
        )}
        <Text variant="muted" size="sm">
          Status: {goal.status}
        </Text>
        {goal.due_date && (
          <Text variant="muted" size="sm">
            Due: {new Date(goal.due_date).toLocaleDateString()}
          </Text>
        )}
        <Text variant="muted" size="sm">
          Target: {goal.target_value} {goal.unit}
        </Text>
        <Text variant="muted" size="sm">
          Logic Type: {goal.logic_type}
        </Text>
      </div>
    </div>
  )
} 