import { User, Goal } from '../supabase'

declare module './GoalCard' {
  interface GoalCardProps {
    goal: Goal
    onUpdate: () => void
    user: User
  }
  const GoalCard: React.FC<GoalCardProps>
  export default GoalCard
}

declare module './GoalForm' {
  interface GoalFormProps {
    onSuccess: () => void
    onCancel: () => void
    user: User
  }
  const GoalForm: React.FC<GoalFormProps>
  export default GoalForm
}

declare module './EditGoalForm' {
  interface EditGoalFormProps {
    goal: Goal
    onSuccess: () => void
    onCancel: () => void
    user: User
  }
  const EditGoalForm: React.FC<EditGoalFormProps>
  export default EditGoalForm
}

declare module './GoalsList' {
  interface GoalsListProps {
    user: User
  }
  const GoalsList: React.FC<GoalsListProps>
  export default GoalsList
} 