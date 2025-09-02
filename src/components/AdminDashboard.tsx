import React, { useState, useEffect } from 'react';
import { Shield, Users, Briefcase, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  is_admin: boolean;
  startup_count: number;
  public_startups: number;
  private_startups: number;
}

interface Startup {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  visibility: string;
  created_at: string;
  user_id: string;
  user_email?: string;
  username?: string;
  avatar_url?: string;
}

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'startups'>('users');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Load all startups first
      const { data: startupsData, error: startupsError } = await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false });

      if (startupsError) {
        console.error('Error loading startups:', startupsError);
        setError('Failed to load startups');
        return;
      }

      console.log('Loaded startups:', startupsData);

      // Try to get users from auth (this might fail if not admin)
      let userProfiles: UserProfile[] = [];
      try {
        const { data: authData, error: usersError } = await supabase.auth.admin.listUsers();

        if (usersError) {
          console.error('Auth admin error:', usersError);
          // If admin API fails, create user profiles from startup data
          const uniqueUserIds = [...new Set(startupsData?.map(s => s.user_id) || [])];
          userProfiles = uniqueUserIds.map(userId => {
            const userStartups = startupsData?.filter(s => s.user_id === userId) || [];
            return {
              id: userId,
              email: 'Unknown',
              username: `User ${userId.slice(0, 8)}`,
              created_at: new Date().toISOString(),
              is_admin: false,
              startup_count: userStartups.length,
              public_startups: userStartups.filter(s => s.visibility === 'public').length,
              private_startups: userStartups.filter(s => s.visibility === 'private').length
            };
          });
        } else {
          // Process auth users
          userProfiles = (authData?.users || []).map((authUser: User) => {
            const userStartups = startupsData?.filter(s => s.user_id === authUser.id) || [];
            return {
              id: authUser.id,
              email: authUser.email || 'No email',
              username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'Unknown',
              avatar_url: authUser.user_metadata?.avatar_url,
              created_at: authUser.created_at,
              is_admin: ['nilaymishra2011@gmail.com', 'nilay2011op@gmail.com'].includes(authUser.email?.toLowerCase() || ''),
              startup_count: userStartups.length,
              public_startups: userStartups.filter(s => s.visibility === 'public').length,
              private_startups: userStartups.filter(s => s.visibility === 'private').length
            };
          });
        }
      } catch (authError) {
        console.error('Auth error:', authError);
        // Fallback: create user profiles from startup data
        const uniqueUserIds = [...new Set(startupsData?.map(s => s.user_id) || [])];
        userProfiles = uniqueUserIds.map(userId => {
          const userStartups = startupsData?.filter(s => s.user_id === userId) || [];
          return {
            id: userId,
            email: 'Unknown',
            username: `User ${userId.slice(0, 8)}`,
            created_at: new Date().toISOString(),
            is_admin: false,
            startup_count: userStartups.length,
            public_startups: userStartups.filter(s => s.visibility === 'public').length,
            private_startups: userStartups.filter(s => s.visibility === 'private').length
          };
        });
      }

      setUsers(userProfiles);

      // Enrich startups with user info
      const enrichedStartups = startupsData?.map(startup => {
        const userInfo = userProfiles.find(u => u.id === startup.user_id);
        return {
          ...startup,
          user_email: userInfo?.email,
          username: userInfo?.username,
          avatar_url: userInfo?.avatar_url
        };
      }) || [];

      setStartups(enrichedStartups);
      console.log('Final data - Users:', userProfiles.length, 'Startups:', enrichedStartups.length);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStartups = startups.filter(startup =>
    startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    startup.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  const toggleStartupVisibility = async (startup: Startup) => {
    try {
      const newVisibility = startup.visibility === 'public' ? 'private' : 'public';
      const { error } = await supabase
        .from('startups')
        .update({ visibility: newVisibility })
        .eq('id', startup.id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error updating startup visibility:', error);
      alert('Error updating startup visibility. Please try again.');
    }
  };

  const handleDeleteStartup = async (startupId: string) => {
    if (!confirm('Are you sure you want to delete this startup?')) return;

    try {
      const { error } = await supabase
        .from('startups')
        .delete()
        .eq('id', startupId);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error deleting startup:', error);
      alert('Error deleting startup. Please try again.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
        <div className="glossy-card text-center p-8 max-w-md w-full">
          <Shield className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
        <div className="glossy-card text-center p-8 max-w-md w-full">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="glossy-button text-white px-6 py-2 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      color: 'text-blue-400',
      bg: 'bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/30',
      icon: <Users className="h-6 w-6 text-blue-400" />
    },
    {
      label: 'Total Startups',
      value: startups.length,
      color: 'text-green-400',
      bg: 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/30',
      icon: <Briefcase className="h-6 w-6 text-green-400" />
    },
    {
      label: 'Public Startups',
      value: startups.filter(s => s.visibility === 'public').length,
      color: 'text-purple-400',
      bg: 'bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/30',
      icon: <Eye className="h-6 w-6 text-purple-400" />
    },
    {
      label: 'Admin Users',
      value: users.filter(u => u.is_admin).length,
      color: 'text-orange-400',
      bg: 'bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-700/30',
      icon: <Shield className="h-6 w-6 text-orange-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <style jsx>{`
        .glossy-card {
          backdrop-filter: blur(10px);
          background: rgba(30, 30, 40, 0.7);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.36),
            inset 0 1px 1px rgba(255, 255, 255, 0.1),
            0 0 20px rgba(167, 139, 250, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
        }
        
        .glossy-button {
          background: linear-gradient(145deg, rgba(139, 92, 246, 0.9), rgba(124, 58, 237, 0.9));
          box-shadow: 
            0 4px 15px rgba(139, 92, 246, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.2),
            0 0 10px rgba(167, 139, 250, 0.5);
          transition: all 0.3s ease;
        }
        
        .glossy-button:hover:not(:disabled) {
          background: linear-gradient(145deg, rgba(139, 92, 246, 1), rgba(124, 58, 237, 1));
          box-shadow: 
            0 6px 20px rgba(139, 92, 246, 0.6),
            inset 0 1px 1px rgba(255, 255, 255, 0.3),
            0 0 15px rgba(167, 139, 250, 0.7);
          transform: translateY(-2px);
        }
        
        .glossy-tab {
          backdrop-filter: blur(10px);
          background: rgba(30, 30, 40, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .glossy-tab.active {
          background: linear-gradient(145deg, rgba(139, 92, 246, 0.9), rgba(124, 58, 237, 0.9));
          box-shadow: 
            0 4px 15px rgba(139, 92, 246, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }
        
        .glossy-table-row {
          backdrop-filter: blur(5px);
          background: rgba(40, 40, 50, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        
        .glossy-table-row:hover {
          background: rgba(50, 50, 60, 0.7);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .glossy-startup-card {
          backdrop-filter: blur(10px);
          background: rgba(40, 40, 50, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .glossy-startup-card:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.15),
            0 0 15px rgba(167, 139, 250, 0.3);
        }
        
        .admin-badge {
          background: linear-gradient(145deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.3));
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
          border: 1px solid rgba(167, 139, 250, 0.3);
        }
        
        .user-badge {
          background: rgba(55, 65, 81, 0.5);
          border: 1px solid rgba(156, 163, 175, 0.3);
        }
        
        .visibility-badge {
          background: rgba(55, 65, 81, 0.5);
          border: 1px solid rgba(156, 163, 175, 0.3);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="relative">
            <Shield className="h-10 w-10 text-purple-400 mr-3 z-10 relative" />
            <div className="absolute -inset-3 bg-purple-500 rounded-full opacity-20 blur-md"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Admin Dashboard</h1>
            <p className="text-gray-400">Manage users and oversee community activity</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glossy-card p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="opacity-80">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Tabs */}
        <div className="glossy-card p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`glossy-tab px-4 py-2 rounded-xl font-medium flex items-center ${
                  activeTab === 'users' ? 'active text-white' : 'text-gray-400'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('startups')}
                className={`glossy-tab px-4 py-2 rounded-xl font-medium flex items-center ${
                  activeTab === 'startups' ? 'active text-white' : 'text-gray-400'
                }`}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Startups ({startups.length})
              </button>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto rounded-xl">
              {filteredUsers.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-4 px-4 font-semibold text-gray-200">User</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-200">Email</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-200">Startups</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-200">Role</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-200">Joined</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {filteredUsers.map((userProfile) => (
                      <tr key={userProfile.id} className="glossy-table-row rounded-xl">
                        <td className="py-4 px-4 rounded-l-xl">
                          <div className="flex items-center space-x-3">
                            <img
                              src={userProfile.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                              alt={userProfile.username}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                            />
                            <span className="font-medium text-gray-200">{userProfile.username}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{userProfile.email}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium text-gray-200">
                              {userProfile.startup_count} startup{userProfile.startup_count !== 1 ? 's' : ''}
                            </span>
                            {userProfile.startup_count > 0 && (
                              <div className="text-xs text-gray-400">
                                {userProfile.public_startups} public, {userProfile.private_startups} private
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              userProfile.is_admin ? 'admin-badge text-purple-300' : 'user-badge text-gray-300'
                            }`}
                          >
                            {userProfile.is_admin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {new Date(userProfile.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 rounded-r-xl">
                          <div className="flex space-x-2">
                            {!userProfile.is_admin && (
                              <button
                                onClick={() => handleDeleteUser(userProfile.id)}
                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-all duration-300"
                                title="Delete user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No users found</p>
                </div>
              )}
            </div>
          )}

          {/* Startups Tab */}
          {activeTab === 'startups' && (
            <div>
              {filteredStartups.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStartups.map((startup) => (
                    <div
                      key={startup.id}
                      className="glossy-startup-card rounded-xl p-5"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-100 line-clamp-2">{startup.name}</h3>
                        <div className="flex space-x-2 ml-2">
                          <button
                            onClick={() => toggleStartupVisibility(startup)}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                              startup.visibility === 'public'
                                ? 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
                                : 'text-gray-500 hover:text-gray-400 hover:bg-gray-800'
                            }`}
                            title={startup.visibility === 'public' ? 'Make private' : 'Make public'}
                          >
                            {startup.visibility === 'public' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteStartup(startup.id)}
                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-all duration-300"
                            title="Delete startup"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {startup.image_url && (
                        <img
                          src={startup.image_url}
                          alt={startup.name}
                          className="w-full h-32 object-cover rounded-lg mb-4 border border-gray-700"
                        />
                      )}

                      <p className="text-gray-300 mb-4 line-clamp-3">{startup.description}</p>

                      {/* Founder Info */}
                      <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg mb-4">
                        <img
                          src={startup.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop'}
                          alt={startup.username || 'Founder'}
                          className="w-8 h-8 rounded-full object-cover border border-gray-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {startup.username || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {startup.user_email || 'No email'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`visibility-badge inline-block text-xs px-3 py-1 rounded-full ${
                            startup.visibility === 'public'
                              ? 'text-green-300'
                              : 'text-gray-300'
                          }`}
                        >
                          {startup.visibility}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(startup.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {searchTerm ? 'No startups found matching your search' : 'No startups found'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};