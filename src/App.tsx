import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LandingPage } from './components/LandingPage'
import { Login } from './components/Auth/Login'
import { Signup } from './components/Auth/Signup'
import { PublicStartups } from './components/PublicStartups'
import { Dashboard } from './components/Dashboard'
import { MyStartups } from './components/MyStartups'
import { Settings } from './components/Settings'
import { AdminDashboard } from './components/AdminDashboard'
import { Sidebar } from './components/Layout/Sidebar'
import { LoadingScreen } from './components/LoadingScreen'
import { useAuth } from './hooks/useAuth'
import CustomCursor from './components/CustomCursor' // Import the CustomCursor
import './styles.css'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  const [showLoading, setShowLoading] = useState(true)
  const location = useLocation()

  // Show loading animation only on homepage
  useEffect(() => {
    if (location.pathname === '/' && !user) {
      setShowLoading(true)
    } else {
      setShowLoading(false)
    }
  }, [location, user])

  if (loading || showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Add CustomCursor here - it will be visible on all pages */}
      <CustomCursor />
      
      {user ? (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-startups" element={<MyStartups />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/startups" element={<PublicStartups />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  )
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])
  
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App