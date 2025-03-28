import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { GoalFormProps } from '../../types/components'

export default function GoalForm({ onSuccess, onCancel, user }: GoalFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
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
            target_value: formData.target_value,
            unit: formData.unit,
            due_date: formData.due_date || null,
            status: 'In Progress'
          }
        ])

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error('Error creating goal:', error)
      setError('Failed to create goal')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          Create Goal
        </button>
      </div>
    </form>
  )
} 