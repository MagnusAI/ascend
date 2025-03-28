import { User as SupabaseUser } from '@supabase/auth-js'

export type User = SupabaseUser

export interface Goal {
  id: string
  user_id: string
  name: string
  category: string
  status: string
  due_date: string | null
  target_value: number
  target_type: 'above' | 'below'
  unit: string
  created_at: string
  updated_at: string
} 