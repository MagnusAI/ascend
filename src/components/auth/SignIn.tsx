import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Form from '../molecules/Form'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      navigate('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-dark-400">
            Sign in to your account to continue
          </p>
        </div>
        <Form onSubmit={handleSignIn}>
          {error && (
            <div className="rounded-lg bg-red-900/50 p-4 border border-red-500">
              <div className="text-sm text-red-200">{error}</div>
            </div>
          )}
          <div className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </Form>

        <div className="text-center">
          <p className="text-sm text-dark-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-400 hover:text-primary-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 