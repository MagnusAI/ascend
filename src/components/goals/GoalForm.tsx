import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Text from '../atoms/Text'
import { User } from '../../types/supabase'

interface GoalFormProps {
  onSuccess: () => void
  onCancel: () => void
  user: User
}

export default function GoalForm({ onSuccess, onCancel, user }: GoalFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    target_value: 0,
    unit: '',
    due_date: ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      console.log('User ID:', user.id) // Debug log
      const { error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            category: formData.category,
            status: 'in_progress', // Always set to in_progress on create
            due_date: formData.due_date || null,
            target_value: formData.target_value,
            unit: formData.unit
          }
        ])
        .select()

      if (error) {
        console.error('Error inserting goal:', error) // Debug log
        throw error
      }

      onSuccess()
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to create goal')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Text variant="accent" size="lg">Create New Goal</Text>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Target and Unit */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Target Value</label>
            <input
              type="number"
              value={formData.target_value}
              onChange={(e) => setFormData({ ...formData, target_value: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Unit</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Due Date (Optional)</label>
            <input
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Create Goal
        </button>
      </div>
    </form>
  )
} 