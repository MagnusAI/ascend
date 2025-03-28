import { User, Goal as SupabaseGoal } from './supabase'

export type Goal = SupabaseGoal

export interface TextProps {
  variant?: 'default' | 'accent' | 'muted' | 'heading'
  size?: 'sm' | 'base' | 'lg' | 'xl'
  className?: string
  children: React.ReactNode
}

export interface GoalCardProps {
  goal: Goal
  onUpdate: () => void
  user: User
}

export interface GoalFormProps {
  onSuccess: () => void
  onCancel: () => void
  user: User
}

export interface EditGoalFormProps {
  goal: Goal
  onSuccess: () => void
  onCancel: () => void
  user: User
}

export interface GoalsListProps {
  user: User
} 