import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Goal, ProgressLog } from '../../types/supabase'
import AppBar from '../AppBar'
import Text from '../atoms/Text'
import EditGoalForm from './EditGoalForm'
import ProgressLogForm from './ProgressLogForm'
import EditProgressLogForm from './EditProgressLogForm'
import { Trash2, Pencil } from 'lucide-react'

interface GoalDetailsProps {
  user: User
}

export default function GoalDetails({ user }: GoalDetailsProps) {
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
        <AppBar />
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
        <AppBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Text variant="accent" size="xl">
            Loading...
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <AppBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <Text variant="accent" size="xl">
              {goal.name}
            </Text>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm font-medium text-primary-400 hover:text-primary-300"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="bg-dark-800 rounded-lg p-6">
            <EditGoalForm
              goal={goal}
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
              user={user}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-dark-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Text variant="muted" size="sm">Category</Text>
                  <Text variant="default" size="base">{goal.category}</Text>
                </div>
                <div className="flex flex-col gap-2">
                  <Text variant="muted" size="sm">Status</Text>
                  <Text variant="default" size="base">{goal.status}</Text>
                </div>
                <div className="flex flex-col gap-2">
                  <Text variant="muted" size="sm">Target</Text>
                  <Text variant="default" size="base">
                    {goal.target_type === 'above' ? '≥' : '≤'} {goal.target_value} {goal.unit}
                  </Text>
                </div>
                <div className="flex flex-col gap-2">
                  <Text variant="muted" size="sm">Due Date</Text>
                  <Text variant="default" size="base">
                    {goal.due_date ? new Date(goal.due_date).toLocaleDateString() : 'No due date'}
                  </Text>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Text variant="accent" size="lg">Progress Logs</Text>
                <button
                  onClick={() => setIsAddingLog(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
                >
                  Add Log
                </button>
              </div>

              {isAddingLog && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddingLog(false)} />
                    <div className="relative transform overflow-hidden rounded-lg bg-dark-800 p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                      <div className="absolute right-0 top-0 pr-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsAddingLog(false)}
                          className="rounded-md text-gray-400 hover:text-gray-300 focus:outline-none"
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <ProgressLogForm
                        goal={goal}
                        user={user}
                        onSuccess={handleLogSuccess}
                        onCancel={() => setIsAddingLog(false)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-dark-800 rounded-lg p-6">
                {progressLogs.length === 0 ? (
                  <Text variant="muted">No progress logs yet</Text>
                ) : (
                  <div className="space-y-4">
                    {progressLogs.map((log) => (
                      <div key={log.id} className="flex justify-between items-center py-2 border-b border-dark-700 last:border-0">
                        <div>
                          <Text variant="default" size="base">{log.value} {goal.unit}</Text>
                          <Text variant="muted" size="sm">
                            {new Date(log.timestamp).toLocaleString()}
                          </Text>
                          {log.notes && (
                            <Text variant="muted" size="sm" className="mt-1">
                              {log.notes}
                            </Text>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setLogToEdit(log)}
                            className="p-2 text-primary-400 hover:text-primary-300 hover:bg-dark-700 rounded-md transition-colors"
                            title="Edit log"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setLogToDelete(log)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-dark-700 rounded-md transition-colors"
                            title="Delete log"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Progress Log Dialog */}
              {logToEdit && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setLogToEdit(null)} />
                    <div className="relative transform overflow-hidden rounded-lg bg-dark-800 p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="absolute right-0 top-0 pr-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setLogToEdit(null)}
                          className="rounded-md text-gray-400 hover:text-gray-300 focus:outline-none"
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <EditProgressLogForm
                        log={logToEdit}
                        goal={goal}
                        user={user}
                        onSuccess={handleLogEditSuccess}
                        onCancel={() => setLogToEdit(null)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Dialog */}
              {logToDelete && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setLogToDelete(null)} />
                    <div className="relative transform overflow-hidden rounded-lg bg-dark-800 p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left">
                          <Text variant="accent" size="lg" className="mb-2">Delete Progress Log</Text>
                          <Text variant="default" size="base" className="mb-4">
                            Are you sure you want to delete this progress log? This action cannot be undone.
                          </Text>
                          <div className="mt-4 flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setLogToDelete(null)}
                              className="px-4 py-2 text-sm font-medium text-primary-400 hover:text-primary-300"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLog(logToDelete.id)}
                              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 