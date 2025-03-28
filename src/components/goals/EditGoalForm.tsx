import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Text from '../atoms/Text'
import { EditGoalFormProps } from '../../types/components'

type TargetType = 'above' | 'below'

export default function EditGoalForm({ goal, onSuccess, onCancel, user }: EditGoalFormProps) {
  const [formData, setFormData] = useState({
    name: goal.name,
    category: goal.category,
    status: goal.status,
    target_value: goal.target_value,
    target_type: goal.target_type as TargetType,
    unit: goal.unit,
    due_date: goal.due_date || ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase
        .from('goals')
        .update({
          name: formData.name,
          category: formData.category,
          status: formData.status,
          target_value: formData.target_value,
          target_type: formData.target_type,
          unit: formData.unit,
          due_date: formData.due_date || null
        })
        .eq('id', goal.id)
        .eq('user_id', user.id)

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error('Error updating goal:', error)
      setError('Failed to update goal')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Text variant="accent" size="lg">Edit Goal</Text>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Goal Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="target_value" className="block text-sm font-medium text-gray-300">
            Target Value
          </label>
          <input
            type="number"
            id="target_value"
            value={formData.target_value}
            onChange={(e) => setFormData({ ...formData, target_value: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="target_type" className="block text-sm font-medium text-gray-300">
            Target Type
          </label>
          <select
            id="target_type"
            value={formData.target_type}
            onChange={(e) => setFormData({ ...formData, target_type: e.target.value as TargetType })}
            className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          >
            <option value="above">Above target (e.g., lift more than 100kg)</option>
            <option value="below">Below target (e.g., run faster than 22 minutes)</option>
          </select>
        </div>
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-300">
            Unit
          </label>
          <input
            type="text"
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-300">
            Due Date (Optional)
          </label>
          <input
            type="date"
            id="due_date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
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
          Save Changes
        </button>
      </div>
    </form>
  )
} 