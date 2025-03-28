import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/signin')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-dark-900">
      <nav className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">Ascend</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-dark-300">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to your dashboard!</h2>
            <p className="text-dark-300">
              Start tracking your goals and monitor your progress.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 