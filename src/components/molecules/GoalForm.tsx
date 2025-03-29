import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Goal } from '../../types/supabase'
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormError,
  FormActions,
} from '../atoms/Form'
import { Button } from '../atoms/Button'

interface GoalFormProps {
  user: User
  onSuccess: () => void
  onCancel: () => void
  initialData?: Partial<Omit<Goal, 'notes'>> & { notes?: string }
}

type TargetType = 'above' | 'below'

export function GoalForm({ user, onSuccess, onCancel, initialData }: GoalFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    status: initialData?.status || 'in_progress',
    target_value: initialData?.target_value || 0,
    target_type: (initialData?.target_type as TargetType) || 'above',
    unit: initialData?.unit || '',
    due_date: initialData?.due_date || '',
    notes: initialData?.notes || '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          ...formData,
          user_id: user.id,
        })

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error('Error creating goal:', error)
      setError('Failed to create goal')
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <FormError>{error}</FormError>}

      <FormGroup>
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormInput
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="category">Category</FormLabel>
        <FormInput
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="status">Status</FormLabel>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="target_value">Target Value</FormLabel>
        <FormInput
          id="target_value"
          type="number"
          value={formData.target_value}
          onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) })}
          required
          step="any"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="target_type">Target Type</FormLabel>
        <select
          id="target_type"
          value={formData.target_type}
          onChange={(e) => setFormData({ ...formData, target_type: e.target.value as TargetType })}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="unit">Unit</FormLabel>
        <FormInput
          id="unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="due_date">Due Date</FormLabel>
        <FormInput
          id="due_date"
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="notes">Notes (optional)</FormLabel>
        <FormTextarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </FormGroup>

      <FormActions>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Goal' : 'Create Goal'}
        </Button>
      </FormActions>
    </Form>
  )
} 