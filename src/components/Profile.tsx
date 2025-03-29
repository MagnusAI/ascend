import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import AppBar from './AppBar'
import Text from './atoms/Text'
import { Button } from './atoms/Button'

export default function Profile() {
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/signin')
        return
      }
      setEmail(user.email || '')
    }
    getUser()
  }, [navigate])

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({ email })
      if (error) throw error
      setMessage({ type: 'success', text: 'Email updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
      setMessage({ type: 'success', text: 'Password updated successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      )
      if (error) throw error
      await supabase.auth.signOut()
      navigate('/signin')
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <AppBar />
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-6">
            {/* User Information Section */}
            <div className="border-2 border-dark-800 rounded-lg p-6 bg-dark-800/50 backdrop-blur-sm shadow-neon">
              <Text variant="heading" size="lg" className="mb-4">Account Information</Text>
              <div className="space-y-2">
                <Text variant="muted">Current Email</Text>
                <Text variant="accent">{email}</Text>
              </div>
            </div>

            {/* Email Update Section */}
            <div className="border-2 border-dark-800 rounded-lg p-6 bg-dark-800/50 backdrop-blur-sm shadow-neon">
              <Text variant="heading" size="lg" className="mb-4">Update Email</Text>
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-400 mb-1">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  Update Email
                </Button>
              </form>
            </div>

            {/* Password Change Section */}
            <div className="border-2 border-dark-800 rounded-lg p-6 bg-dark-800/50 backdrop-blur-sm shadow-neon">
              <Text variant="heading" size="lg" className="mb-4">Change Password</Text>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-primary-400 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-primary-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  Change Password
                </Button>
              </form>
            </div>

            {/* Account Deletion Section */}
            <div className="border-2 border-dark-800 rounded-lg p-6 bg-dark-800/50 backdrop-blur-sm shadow-neon">
              <Text variant="heading" size="lg" className="mb-4">Delete Account</Text>
              <Text variant="muted" className="mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </Text>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                Delete Account
              </Button>
            </div>

            {/* Status Messages */}
            {message && (
              <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                }`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 