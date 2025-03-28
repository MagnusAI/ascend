import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import GoalsList from './goals/GoalsList'
import AppBar from './AppBar'
import Text from './atoms/Text'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        setError('Failed to load user data')
        return
      }
      setUser(user)
    }
    getUser()
  }, [])

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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <AppBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Text variant="accent" size="xl">
            Welcome back!
          </Text>
        </div>
        <GoalsList user={user} />
      </main>
    </div>
  )
} 