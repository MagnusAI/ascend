import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Goal } from '../../types/supabase'
import Text from '../atoms/Text'

interface ProgressLogFormProps {
  goal: Goal
  user: User
  onSuccess: () => void
  onCancel: () => void
}

export default function ProgressLogForm({ goal, user, onSuccess, onCancel }: ProgressLogFormProps) {
  const [formData, setFormData] = useState({
    value: 0,
    notes: ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase
        .from('progress_logs')
        .insert([
          {
            goal_id: goal.id,
            user_id: user.id,
            value: formData.value,
            notes: formData.notes || null
          }
        ])

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error('Error creating progress log:', error)
      setError('Failed to create progress log')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Text variant="accent" size="lg">Add Progress Log</Text>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-300">
            Value ({goal.unit})
          </label>
          <input
            type="number"
            id="value"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
            step="any"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
        >
          Add Log
        </button>
      </div>
    </form>
  )
} 