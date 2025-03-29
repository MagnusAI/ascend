import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Goal } from '../../types/supabase'
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
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

export function GoalForm({ user, onSuccess, onCancel, initialData }: GoalFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    target_value: initialData?.target_value || 0,
    target_type: (initialData?.target_type as 'above' | 'below') || 'above',
    unit: initialData?.unit || '',
    due_date: initialData?.due_date || '',
    notes: initialData?.notes || '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          name: formData.name,
          category: formData.category,
          target_value: formData.target_value,
          target_type: formData.target_type,
          unit: formData.unit,
          due_date: formData.due_date || null
        })

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error('Error creating goal:', error)
      setError('Failed to create goal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabel htmlFor="name">Goal Name</FormLabel>
        <FormInput
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="category">Category</FormLabel>
        <FormInput
          id="category"
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="target_value">Target Value</FormLabel>
        <FormInput
          id="target_value"
          type="number"
          value={formData.target_value}
          onChange={(e) => setFormData({ ...formData, target_value: Number(e.target.value) })}
          required
          min="0"
          step="any"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="target_type">Target Type</FormLabel>
        <select
          id="target_type"
          value={formData.target_type}
          onChange={(e) => setFormData({ ...formData, target_type: e.target.value as 'above' | 'below' })}
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
          type="text"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="due_date">Due Date (Optional)</FormLabel>
        <FormInput
          id="due_date"
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
        />
      </FormGroup>

      {error && <FormError>{error}</FormError>}

      <FormActions>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Goal' : 'Create Goal'}
        </Button>
      </FormActions>
    </Form>
  )
} 