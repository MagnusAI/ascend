import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Goal, ProgressLog } from '../../types/supabase'
import { Card, CardContent } from '../atoms/Card'
import { Button } from '../atoms/Button'
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../atoms/Modal'
import { ProgressLogCard } from '../molecules/ProgressLogCard'
import { GoalForm } from '../molecules/GoalForm'
import { ProgressLogForm } from '../molecules/ProgressLogForm'
import { Plus } from 'lucide-react'

interface GoalDetailsProps {
  user: User
}

export function GoalDetails({ user }: GoalDetailsProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [goal, setGoal] = useState<Goal | null>(null)
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingLog, setIsAddingLog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logToDelete, setLogToDelete] = useState<ProgressLog | null>(null)
  const [logToEdit, setLogToEdit] = useState<ProgressLog | null>(null)

  useEffect(() => {
    const fetchGoal = async () => {
      if (!id) return

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) {
        setError('Failed to load goal')
        return
      }

      setGoal(data)
    }

    const fetchProgressLogs = async () => {
      if (!id) return

      const { data, error } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('goal_id', id)
        .order('timestamp', { ascending: false })

      if (error) {
        setError('Failed to load progress logs')
        return
      }

      setProgressLogs(data || [])
    }

    fetchGoal()
    fetchProgressLogs()
  }, [id, user.id])

  const handleDelete = async () => {
    if (!id) return

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      navigate('/dashboard')
    } catch (error) {
      console.error('Error deleting goal:', error)
      setError('Failed to delete goal')
    }
  }

  const handleLogSuccess = async () => {
    setIsAddingLog(false)
    // Refresh progress logs
    const { data, error } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('goal_id', id)
      .order('timestamp', { ascending: false })

    if (!error && data) {
      setProgressLogs(data)
    }
  }

  const handleDeleteLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('progress_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', user.id)

      if (error) throw error

      // Refresh progress logs
      const { data, error: fetchError } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('goal_id', id)
        .order('timestamp', { ascending: false })

      if (!fetchError && data) {
        setProgressLogs(data)
      }
      setLogToDelete(null) // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting progress log:', error)
      setError('Failed to delete progress log')
    }
  }

  const handleLogEditSuccess = async () => {
    setLogToEdit(null)
    // Refresh progress logs
    const { data, error } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('goal_id', id)
      .order('timestamp', { ascending: false })

    if (!error && data) {
      setProgressLogs(data)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-primary-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-400">
              {goal.name}
            </h1>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {isEditing ? (
          <Card>
            <CardContent className="pt-6">
              <GoalForm
                user={user}
                onSuccess={() => {
                  setIsEditing(false)
                  // Refresh goal data
                  const fetchGoal = async () => {
                    const { data, error } = await supabase
                      .from('goals')
                      .select('*')
                      .eq('id', id)
                      .eq('user_id', user.id)
                      .single()

                    if (!error && data) {
                      setGoal(data)
                    }
                  }
                  fetchGoal()
                }}
                onCancel={() => setIsEditing(false)}
                initialData={goal}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary-400">Progress Logs</h2>
                <Button
                  onClick={() => setIsAddingLog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Log
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  {progressLogs.length === 0 ? (
                    <p className="text-primary-400">No progress logs yet</p>
                  ) : (
                    <div className="space-y-4">
                      {progressLogs.map((log) => (
                        <ProgressLogCard
                          key={log.id}
                          log={log}
                          goal={goal}
                          onDelete={setLogToDelete}
                          onEdit={setLogToEdit}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add Log Modal */}
              <Modal
                isOpen={isAddingLog}
                onClose={() => setIsAddingLog(false)}
                size="lg"
              >
                <ModalHeader>
                  <ModalTitle>Add Progress Log</ModalTitle>
                </ModalHeader>
                <ModalContent>
                  <ProgressLogForm
                    goal={goal}
                    user={user}
                    onSuccess={handleLogSuccess}
                    onCancel={() => setIsAddingLog(false)}
                  />
                </ModalContent>
              </Modal>

              {/* Edit Log Modal */}
              <Modal
                isOpen={!!logToEdit}
                onClose={() => setLogToEdit(null)}
                size="lg"
              >
                <ModalHeader>
                  <ModalTitle>Edit Progress Log</ModalTitle>
                </ModalHeader>
                <ModalContent>
                  <ProgressLogForm
                    goal={goal}
                    user={user}
                    onSuccess={handleLogEditSuccess}
                    onCancel={() => setLogToEdit(null)}
                    initialData={logToEdit || undefined}
                  />
                </ModalContent>
              </Modal>

              {/* Delete Log Confirmation Modal */}
              <Modal
                isOpen={!!logToDelete}
                onClose={() => setLogToDelete(null)}
                showCloseButton={false}
              >
                <ModalHeader>
                  <ModalTitle>Delete Progress Log</ModalTitle>
                </ModalHeader>
                <ModalContent>
                  <p className="text-primary-400">
                    Are you sure you want to delete this progress log? This action cannot be undone.
                  </p>
                </ModalContent>
                <ModalFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setLogToDelete(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => logToDelete && handleDeleteLog(logToDelete.id)}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 