export type GoalCategory = 'strength' | 'cardio' | 'nutrition' | 'mental' | 'habit' | 'other'
export type GoalFrequency = 'daily' | 'weekly' | 'monthly' | 'one-time'
export type GoalLogicType = 'SUM' | 'MAX' | 'COUNT' | 'AVERAGE'

export interface Goal {
    id: string
    user_id: string
    name: string
    category: GoalCategory
    unit: string
    target_value: number
    frequency: GoalFrequency
    logic_type: GoalLogicType
    deadline?: string
    created_at: string
    updated_at: string
}

export interface ProgressLog {
    id: string
    goal_id: string
    timestamp: string
    value: number
    notes?: string
    created_at: string
}

export interface CreateGoalInput {
    name: string
    category: GoalCategory
    unit: string
    target_value: number
    frequency: GoalFrequency
    logic_type: GoalLogicType
    deadline?: string
}

export interface CreateProgressLogInput {
    goal_id: string
    value: number
    notes?: string
    timestamp?: string
} 