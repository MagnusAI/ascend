import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import GoalDetails from './components/goals/GoalDetails'
import CreateGoal from './components/goals/CreateGoal'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { User } from '@supabase/supabase-js'
import './App.css'
import AppBar from './components/AppBar'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setUser(session?.user ?? null)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isAuthenticated === null) {
    return null // Or a loading spinner
  }

  return (
    <Router basename="/ascend">
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/goals/new"
          element={
            user ? (
              <CreateGoal />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/goals/:id"
          element={
            user ? (
              <GoalDetails user={user} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
