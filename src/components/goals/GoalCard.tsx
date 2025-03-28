import { useNavigate } from 'react-router-dom'
import Text from '../atoms/Text'
import { GoalCardProps } from '../../types/components'

export default function GoalCard({ goal }: GoalCardProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/goals/${goal.id}`)}
      className="bg-dark-800 rounded-lg p-6 cursor-pointer hover:bg-dark-700 transition-colors border-2 border-primary-500/50 shadow-neon"
    >
      <Text variant="accent" size="lg">
        {goal.name}
      </Text>
    </div>
  )
} 