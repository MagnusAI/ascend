import { useState, useEffect } from 'react'
import { goalsService } from '../../services/goals'
import { Goal } from '../../types/goals'
import Text from '../atoms/Text'
import Button from '../atoms/Button'
import CreateGoalForm from './CreateGoalForm'
import { Plus, Trash2 } from 'lucide-react'

export default function GoalsList() {
    const [goals, setGoals] = useState<Goal[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showCreateForm, setShowCreateForm] = useState(false)

    const fetchGoals = async () => {
        try {
            const data = await goalsService.getGoals()
            setGoals(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [])

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) {
            return
        }

        try {
            await goalsService.deleteGoal(id)
            setGoals(goals.filter(goal => goal.id !== id))
        } catch (err: any) {
            setError(err.message)
        }
    }

    if (isLoading) {
        return <Text>Loading goals...</Text>
    }

    if (error) {
        return <Text variant="error">{error}</Text>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Text variant="heading" size="lg">Your Goals</Text>
                <Button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-dark-900 shadow-neon hover:shadow-neon/50 transition-all duration-300"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Goal</span>
                </Button>
            </div>

            {showCreateForm && (
                <div className="border-2 border-dark-800 rounded-lg p-6 bg-dark-800/50 backdrop-blur-sm shadow-neon">
                    <CreateGoalForm
                        onSuccess={() => {
                            setShowCreateForm(false)
                            fetchGoals()
                        }}
                        onCancel={() => setShowCreateForm(false)}
                    />
                </div>
            )}

            {goals.length === 0 ? (
                <div className="border-2 border-dark-800 rounded-lg p-8 bg-dark-800/50 backdrop-blur-sm shadow-neon text-center">
                    <Text variant="muted">No goals yet. Create one to get started!</Text>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goals.map(goal => (
                        <div
                            key={goal.id}
                            className="border-2 border-dark-800 rounded-lg p-4 bg-dark-800/50 backdrop-blur-sm shadow-neon hover:shadow-neon/50 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <Text variant="accent" size="lg">{goal.name}</Text>
                                    <Text variant="muted" size="sm" className="mt-1">
                                        {goal.category} • {goal.frequency}
                                    </Text>
                                </div>
                                <button
                                    onClick={() => handleDelete(goal.id)}
                                    className="p-1 text-primary-400 hover:text-primary-300 hover:bg-dark-700 rounded-md transition-colors duration-200"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="mt-4">
                                <Text variant="muted" size="sm">
                                    Target: {goal.target_value} {goal.unit}
                                </Text>
                                <Text variant="muted" size="sm">
                                    Progress Type: {goal.logic_type}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
} 