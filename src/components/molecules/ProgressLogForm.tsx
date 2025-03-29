import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Goal, ProgressLog } from '../../types/supabase'
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

interface ProgressLogFormProps {
  goal: Goal
  user: User
  onSuccess: () => void
  onCancel: () => void
  initialData?: Partial<ProgressLog>
}

export function ProgressLogForm({ goal, user, onSuccess, onCancel, initialData }: ProgressLogFormProps) {
  const [formData, setFormData] = useState({
    value: initialData?.value || 0,
    notes: initialData?.notes || '',
    timestamp: initialData?.timestamp 
      ? new Date(initialData.timestamp).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { error } = await supabase
        .from('progress_logs')
        .insert({
          ...formData,
          goal_id: goal.id,
          user_id: user.id,
        })

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error('Error creating progress log:', error)
      setError('Failed to create progress log')
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <FormError>{error}</FormError>}

      <FormGroup>
        <FormLabel htmlFor="value">Value ({goal.unit})</FormLabel>
        <FormInput
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
          required
          step="any"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="timestamp">Date & Time</FormLabel>
        <FormInput
          id="timestamp"
          type="datetime-local"
          value={formData.timestamp}
          onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
          required
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
          {initialData ? 'Update Log' : 'Add Log'}
        </Button>
      </FormActions>
    </Form>
  )
} 