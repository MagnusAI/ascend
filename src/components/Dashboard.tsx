import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import AppBar from './AppBar'
import Text from './atoms/Text'
import GoalsList from './goals/GoalsList'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/signin')
        return
      }
      setUser(user)
    }
    getUser()
  }, [navigate])

  if (!user) return null

  return (
    <div className="min-h-screen bg-dark-900">
      <AppBar userEmail={user.email} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-8">
            <div className="border-2 border-dark-800 rounded-lg p-6 bg-dark-800/50 backdrop-blur-sm shadow-neon">
              <Text variant="accent" size="xl">
                Welcome to your dashboard!
              </Text>
            </div>
            <GoalsList />
          </div>
        </div>
      </main>
    </div>
  )
} 