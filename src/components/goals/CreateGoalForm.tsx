import { useState } from 'react'
import { CreateGoalInput, GoalCategory, GoalFrequency, GoalLogicType } from '../../types/goals'

interface CreateGoalFormProps {
    onSubmit: (data: CreateGoalInput) => void
    onCancel: () => void
}

export default function CreateGoalForm({ onSubmit, onCancel }: CreateGoalFormProps) {
    const [formData, setFormData] = useState<CreateGoalInput>({
        name: '',
        category: 'other',
        unit: '',
        target_value: 0,
        frequency: 'daily',
        logic_type: 'SUM'
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                        Goal Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                        Category
                    </label>
                    <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as GoalCategory })}
                        className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
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
                    <label htmlFor="target_value" className="block text-sm font-medium text-gray-300">
                        Target Value
                    </label>
                    <input
                        type="number"
                        id="target_value"
                        value={formData.target_value}
                        onChange={(e) => setFormData({ ...formData, target_value: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-300">
                        Unit
                    </label>
                    <input
                        type="text"
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-300">
                        Frequency
                    </label>
                    <select
                        id="frequency"
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as GoalFrequency })}
                        className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="one-time">One Time</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="logic_type" className="block text-sm font-medium text-gray-300">
                        Progress Type
                    </label>
                    <select
                        id="logic_type"
                        value={formData.logic_type}
                        onChange={(e) => setFormData({ ...formData, logic_type: e.target.value as GoalLogicType })}
                        className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                    >
                        <option value="SUM">Sum</option>
                        <option value="MAX">Maximum</option>
                        <option value="COUNT">Count</option>
                        <option value="AVERAGE">Average</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-300">
                        Deadline (Optional)
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        value={formData.deadline || ''}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
                >
                    Create Goal
                </button>
            </div>
        </form>
    )
} 