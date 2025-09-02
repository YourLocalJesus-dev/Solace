import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Chrome, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    const { error } = await signUp(formData.email, formData.password, formData.username);
    
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-500 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-300/20 rounded-full filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-300/20 rounded-full filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 z-10">
        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-md relative">
          {/* Close Button - Updated to match Login component */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-purple-500/30 rounded-full blur"></div>
              <div className="relative bg-gradient-to-br from-white to-purple-100 p-3 rounded-full shadow-lg">
                <UserPlus className="mx-auto h-12 w-12 text-purple-600" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white drop-shadow-md">Join Solace</h2>
            <p className="mt-2 text-sm text-white/80">Start your kidpreneur journey today</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-400/20 border border-red-500/30 rounded-xl p-4 flex items-center space-x-2 backdrop-blur-sm">
                <AlertCircle className="h-5 w-5 text-red-100" />
                <span className="text-red-100 text-sm">{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white/90">
                  Username
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-sm"></div>
                  <div className="relative glass-input flex items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
                    <User className="ml-3 h-5 w-5 text-white/70" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full pl-3 pr-3 py-3 bg-transparent border-none text-white placeholder-white/60 focus:ring-0 outline-none"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-sm"></div>
                  <div className="relative glass-input flex items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
                    <Mail className="ml-3 h-5 w-5 text-white/70" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full pl-3 pr-3 py-3 bg-transparent border-none text-white placeholder-white/60 focus:ring-0 outline-none"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-sm"></div>
                  <div className="relative glass-input flex items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
                    <Lock className="ml-3 h-5 w-5 text-white/70" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      className="w-full pl-3 pr-3 py-3 bg-transparent border-none text-white placeholder-white/60 focus:ring-0 outline-none"
                      placeholder="Create a password (min 6 characters)"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:shadow-purple-500/30 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/80">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  className="relative w-full inline-flex justify-center items-center py-3 px-4 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-sm font-medium text-white shadow-lg hover:bg-white/20 transition-all duration-300"
                >
                  <div className="bg-white p-1 rounded-full">
                    <Chrome className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="ml-2">Continue with Google</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-white/80">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-white hover:text-purple-200 underline transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .glass-input {
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        .glass-input:focus-within {
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 2px rgba(192, 132, 252, 0.5);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};