import { useState } from 'react'
import { goalsService } from '../../services/goals'
import { CreateGoalInput, GoalCategory, GoalFrequency, GoalLogicType } from '../../types/goals'
import Text from '../atoms/Text'
import Button from '../atoms/Button'

interface CreateGoalFormProps {
    onSuccess: () => void
    onCancel: () => void
}

export default function CreateGoalForm({ onSuccess, onCancel }: CreateGoalFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<CreateGoalInput>({
        name: '',
        category: 'strength',
        unit: '',
        target_value: 0,
        frequency: 'daily',
        logic_type: 'SUM'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await goalsService.createGoal(formData)
            onSuccess()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'target_value' ? parseFloat(value) : value
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-primary-400 mb-1">
                    Goal Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-primary-400 mb-1">
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="mental">Mental</option>
                    <option value="habit">Habit</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <label htmlFor="unit" className="block text-sm font-medium text-primary-400 mb-1">
                    Unit
                </label>
                <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="target_value" className="block text-sm font-medium text-primary-400 mb-1">
                    Target Value
                </label>
                <input
                    type="number"
                    id="target_value"
                    name="target_value"
                    value={formData.target_value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    min="0"
                    step="any"
                />
            </div>

            <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-primary-400 mb-1">
                    Frequency
                </label>
                <select
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="one-time">One Time</option>
                </select>
            </div>

            <div>
                <label htmlFor="logic_type" className="block text-sm font-medium text-primary-400 mb-1">
                    Progress Type
                </label>
                <select
                    id="logic_type"
                    name="logic_type"
                    value={formData.logic_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="SUM">Sum</option>
                    <option value="MAX">Maximum</option>
                    <option value="COUNT">Count</option>
                    <option value="AVERAGE">Average</option>
                </select>
            </div>

            {error && (
                <div className="text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="flex justify-end space-x-3">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    Create Goal
                </Button>
            </div>
        </form>
    )
} 