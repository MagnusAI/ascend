import { supabase } from '../lib/supabase'
import { Goal, ProgressLog, CreateGoalInput, CreateProgressLogInput } from '../types/goals'

export const goalsService = {
    // Goals
    async createGoal(input: CreateGoalInput): Promise<Goal> {
        const { data, error } = await supabase
            .from('goals')
            .insert([input])
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getGoals(): Promise<Goal[]> {
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    async updateGoal(id: string, input: Partial<CreateGoalInput>): Promise<Goal> {
        const { data, error } = await supabase
            .from('goals')
            .update(input)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async deleteGoal(id: string): Promise<void> {
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Progress Logs
    async createProgressLog(input: CreateProgressLogInput): Promise<ProgressLog> {
        const { data, error } = await supabase
            .from('progress_logs')
            .insert([input])
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getProgressLogs(goalId: string): Promise<ProgressLog[]> {
        const { data, error } = await supabase
            .from('progress_logs')
            .select('*')
            .eq('goal_id', goalId)
            .order('timestamp', { ascending: false })

        if (error) throw error
        return data
    },

    async deleteProgressLog(id: string): Promise<void> {
        const { error } = await supabase
            .from('progress_logs')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Progress Calculation
    async calculateProgress(goalId: string): Promise<number> {
        const { data: goal } = await supabase
            .from('goals')
            .select('*')
            .eq('id', goalId)
            .single()

        if (!goal) throw new Error('Goal not found')

        const { data: logs } = await supabase
            .from('progress_logs')
            .select('value')
            .eq('goal_id', goalId)

        if (!logs) return 0

        switch (goal.logic_type) {
            case 'SUM':
                return logs.reduce((sum, log) => sum + log.value, 0)
            case 'MAX':
                return Math.max(...logs.map(log => log.value))
            case 'COUNT':
                return logs.length
            case 'AVERAGE':
                return logs.reduce((sum, log) => sum + log.value, 0) / logs.length
            default:
                return 0
        }
    }
} 