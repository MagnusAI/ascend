import { useNavigate } from 'react-router-dom'
import { Goal } from '../../types/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '../atoms/Card'
import { Button } from '../atoms/Button'
import { Trash2, Pencil } from 'lucide-react'

interface GoalCardProps {
  goal: Goal
  onDelete: (id: string) => void
  onEdit: (goal: Goal) => void
}

export function GoalCard({ goal, onDelete, onEdit }: GoalCardProps) {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking delete or edit buttons
    if ((e.target as HTMLElement).closest('button')) return
    navigate(`/goals/${goal.id}`)
  }

  return (
    <Card
      className="cursor-pointer hover:border-primary-500 transition-colors"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl">{goal.name}</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(goal)
            }}
            title="Edit goal"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(goal.id)
            }}
            title="Delete goal"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-primary-400">Category</p>
            <p className="text-sm">{goal.category}</p>
          </div>
          <div>
            <p className="text-sm text-primary-400">Status</p>
            <p className="text-sm">{goal.status}</p>
          </div>
          <div>
            <p className="text-sm text-primary-400">Target</p>
            <p className="text-sm">
              {goal.target_type === 'above' ? '≥' : '≤'} {goal.target_value} {goal.unit}
            </p>
          </div>
          <div>
            <p className="text-sm text-primary-400">Due Date</p>
            <p className="text-sm">
              {goal.due_date ? new Date(goal.due_date).toLocaleDateString() : 'No due date'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 