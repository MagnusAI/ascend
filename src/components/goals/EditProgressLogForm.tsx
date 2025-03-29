import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Goal, ProgressLog } from '../../types/supabase'
import Text from '../atoms/Text'

interface EditProgressLogFormProps {
  log: ProgressLog
  goal: Goal
  user: User
  onSuccess: () => void
  onCancel: () => void
}

export default function EditProgressLogForm({ log, goal, user, onSuccess, onCancel }: EditProgressLogFormProps) {
  const [formData, setFormData] = useState({
    value: log.value,
    notes: log.notes || '',
    timestamp: new Date(log.timestamp).toISOString().slice(0, 16), // Format for datetime-local input
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { error } = await supabase
        .from('progress_logs')
        .update({
          value: formData.value,
          notes: formData.notes || null,
          timestamp: formData.timestamp,
        })
        .eq('id', log.id)
        .eq('user_id', user.id)

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error('Error updating progress log:', error)
      setError('Failed to update progress log')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Text variant="accent" size="lg" className="mb-4">Edit Progress Log</Text>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-md">
            {error}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="value" className="block text-sm font-medium text-primary-400 mb-1">
          Value ({goal.unit})
        </label>
        <input
          type="number"
          id="value"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
          step="any"
        />
      </div>

      <div>
        <label htmlFor="timestamp" className="block text-sm font-medium text-primary-400 mb-1">
          Date & Time
        </label>
        <input
          type="datetime-local"
          id="timestamp"
          value={formData.timestamp}
          onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-primary-400 mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-primary-400 hover:text-primary-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
} 