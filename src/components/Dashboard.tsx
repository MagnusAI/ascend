import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Goal, ProgressLog } from '../types/supabase'
import { Card, CardHeader, CardTitle, CardContent } from './atoms/Card'
import { Button } from './atoms/Button'
import { CategorySpiderCharts } from './organisms/CategorySpiderCharts'
import { Plus } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    const fetchGoals = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError('Failed to load goals')
        return
      }

      setGoals(data || [])
    }

    const fetchProgressLogs = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })

      if (error) {
        setError('Failed to load progress logs')
        return
      }

      setProgressLogs(data || [])
    }

    fetchUser()
    fetchGoals()
    fetchProgressLogs()
  }, [user])

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

  return (
    <div className="min-h-screen bg-dark-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-400">Dashboard</h1>
            <Button onClick={() => navigate('/goals/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <CategorySpiderCharts
                goals={goals}
                progressLogs={progressLogs}
              />
            </CardContent>
          </Card>

          {/* Recent Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Goals</CardTitle>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <p className="text-primary-400">No goals yet. Create your first goal to get started!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {goals.slice(0, 6).map((goal) => (
                    <Card
                      key={goal.id}
                      className="cursor-pointer hover:bg-dark-800 transition-colors"
                      onClick={() => navigate(`/goals/${goal.id}`)}
                    >
                      <CardContent className="pt-6">
                        <h3 className="font-medium text-primary-400">{goal.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 