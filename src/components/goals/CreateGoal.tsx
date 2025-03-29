import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Card, CardContent } from '../atoms/Card'
import { GoalForm } from '../molecules/GoalForm'

export default function CreateGoal() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-400">Create New Goal</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <GoalForm
              user={user}
              onSuccess={() => navigate('/dashboard')}
              onCancel={() => navigate('/dashboard')}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 