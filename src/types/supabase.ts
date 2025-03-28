import { User as SupabaseUser } from '@supabase/auth-js'

export type User = SupabaseUser

export interface Goal {
  id: string
  user_id: string
  name: string
  title: string
  description: string
  category: string
  status: string
  due_date: string
  frequency: string
  logic_type: string
  target_value: number
  unit: string
  created_at: string
  updated_at: string
} 