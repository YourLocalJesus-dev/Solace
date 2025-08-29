import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { PublicStartups } from './components/PublicStartups';
import { Dashboard } from './components/Dashboard';
import { MyStartups } from './components/MyStartups';
import { Settings } from './components/Settings';
import { AdminDashboard } from './components/AdminDashboard';
import { Sidebar } from './components/Layout/Sidebar';
import { User } from './types';
import { getAuthCookie } from './utils/auth';
import './styles.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = getAuthCookie();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user ? (
          <div className="flex">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="flex-1 ml-64">
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/my-startups" element={<MyStartups user={user} />} />
                <Route path="/settings" element={<Settings user={user} onUpdateUser={handleUpdateUser} />} />
                {user.isAdmin && (
                  <Route path="/admin" element={<AdminDashboard />} />
                )}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/startups" element={<PublicStartups />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
