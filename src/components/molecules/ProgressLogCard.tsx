import { ProgressLog, Goal } from '../../types/supabase'
import { Card, CardContent } from '../atoms/Card'
import { Button } from '../atoms/Button'
import { Trash2, Pencil } from 'lucide-react'

interface ProgressLogCardProps {
  log: ProgressLog
  goal: Goal
  onDelete: (log: ProgressLog) => void
  onEdit: (log: ProgressLog) => void
}

export function ProgressLogCard({ log, goal, onDelete, onEdit }: ProgressLogCardProps) {
  return (
    <Card className="border-b border-dark-700 last:border-0">
      <CardContent className="flex justify-between items-start py-4">
        <div className="space-y-1">
          <p className="text-base">{log.value} {goal.unit}</p>
          <p className="text-sm text-primary-400">
            {new Date(log.timestamp).toLocaleString()}
          </p>
          {log.notes && (
            <p className="text-sm text-primary-400 mt-1">
              {log.notes}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(log)}
            title="Edit log"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(log)}
            title="Delete log"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 