import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Briefcase, TrendingUp, Plus, Star, UserPlus, Search, Award, ChevronRight, Clock, Rocket } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import type { Startup } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userStartups, setUserStartups] = useState<Startup[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStartups, setTotalStartups] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      // Fetch user's startups
      const { data: startups } = await supabase
        .from('startups')
        .select('*')
        .eq('user_id', user.id);
      
      setUserStartups(startups || []);

      // Fetch platform stats
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const { count: startupsCount } = await supabase
        .from('startups')
        .select('*', { count: 'exact', head: true });

      setTotalUsers(authUsers?.users?.length || 0);
      setTotalStartups(startupsCount || 0);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStartup = () => {
    navigate('/my-startups');
  };

  const handleFindMentors = () => {
    alert('Mentor matching feature coming soon! We\'ll connect you with experienced entrepreneurs who can guide your journey.');
  };

  const handleViewAnalytics = () => {
    alert('Analytics dashboard coming soon! Track your startup\'s growth, engagement metrics, and community feedback.');
  };

  const stats = [
    {
      icon: <Briefcase className="h-8 w-8 text-blue-400" />,
      label: 'My Startups',
      value: userStartups.length.toString(),
      color: 'bg-blue-500/10 border-blue-400/30'
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
      label: 'Community Members',
      value: totalUsers.toString(),
      color: 'bg-green-500/10 border-green-400/30'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-400" />,
      label: 'Total Startups',
      value: totalStartups.toString(),
      color: 'bg-purple-500/10 border-purple-400/30'
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      label: 'Mentor Score',
      value: '4.8',
      color: 'bg-yellow-500/10 border-yellow-400/30'
    }
  ];

  const recentActivity = [
    { action: 'Joined mentorship program', time: '2 hours ago' },
    { action: 'Updated startup profile', time: '1 day ago' },
    { action: 'Connected with new mentor', time: '3 days ago' },
    { action: 'Completed business plan workshop', time: '1 week ago' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-900/20 rounded-full filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-indigo-900/20 rounded-full filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-900/20 rounded-full filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
            Welcome back, {user?.user_metadata?.username || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-300">
            Here's what's happening in your entrepreneurial journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`glass-card-dark rounded-2xl p-6 border ${stat.color} backdrop-blur-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="glass-card-dark rounded-2xl p-6 border border-gray-700 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleCreateStartup}
                  className="w-full flex items-center space-x-3 p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-all group"
                >
                  <div className="p-2 bg-purple-600/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Plus className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-white font-medium">Add New Startup</span>
                </button>
                <button 
                  onClick={handleFindMentors}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-all group"
                >
                  <div className="p-2 bg-blue-600/30 rounded-lg group-hover:scale-110 transition-transform">
                    <UserPlus className="h-5 w-5 text-blue-300" />
                  </div>
                  <span className="text-white font-medium">Find Mentors</span>
                </button>
                <button 
                  onClick={handleViewAnalytics}
                  className="w-full flex items-center space-x-3 p-4 bg-green-600/20 border border-green-500/30 rounded-xl hover:bg-green-600/30 transition-all group"
                >
                  <div className="p-2 bg-green-600/30 rounded-lg group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-5 w-5 text-green-300" />
                  </div>
                  <span className="text-white font-medium">View Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="glass-card-dark rounded-2xl p-6 border border-gray-700 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-600/30 rounded-lg">
                        <Clock className="h-4 w-4 text-purple-300" />
                      </div>
                      <span className="text-gray-200">{activity.action}</span>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My Startups */}
        <div className="mt-8">
          <div className="glass-card-dark rounded-2xl p-6 border border-gray-700 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">My Startups</h3>
              <button 
                onClick={() => navigate('/my-startups')}
                className="text-gray-300 hover:text-white font-medium flex items-center group"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {userStartups.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {userStartups.slice(0, 2).map((startup) => (
                  <div key={startup.id} className="glass-card-dark border border-gray-700 rounded-xl p-4 bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-white">{startup.name}</h4>
                      <div className="p-2 bg-purple-600/30 rounded-lg">
                        <Rocket className="h-4 w-4 text-purple-300" />
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{startup.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block bg-purple-600/30 text-purple-300 text-xs px-3 py-1 rounded-full">
                        {startup.visibility || 'Private'}
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
                <div className="inline-flex items-center justify-center p-4 bg-purple-600/20 rounded-full mb-4">
                  <Briefcase className="h-12 w-12 text-purple-300" />
                </div>
                <p className="text-gray-300 mb-4">No startups yet. Ready to build something amazing?</p>
                <button 
                  onClick={handleCreateStartup}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/20"
                >
                  Create Your First Startup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card-dark {
          background: rgba(30, 30, 40, 0.4);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
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