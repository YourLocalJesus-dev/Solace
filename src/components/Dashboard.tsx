import React from 'react';
import { BarChart3, Users, Briefcase, TrendingUp, Plus, Star } from 'lucide-react';
import { User } from '../types';
import { getUserStartups } from '../utils/storage';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const userStartups = getUserStartups(user.id);
  
  const stats = [
    {
      icon: <Briefcase className="h-8 w-8 text-blue-600" />,
      label: 'My Startups',
      value: userStartups.length.toString(),
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      label: 'Community Members',
      value: '2,847',
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      label: 'Success Rate',
      value: '87%',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      label: 'Mentor Score',
      value: '4.8',
      color: 'bg-yellow-50 border-yellow-200'
    }
  ];

  const recentActivity = [
    { action: 'Joined mentorship program', time: '2 hours ago' },
    { action: 'Updated startup profile', time: '1 day ago' },
    { action: 'Connected with new mentor', time: '3 days ago' },
    { action: 'Completed business plan workshop', time: '1 week ago' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.username}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your entrepreneurial journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`card-hover bg-white p-6 rounded-xl shadow-sm border-2 ${stat.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all">
                <Plus className="h-5 w-5 text-purple-600" />
                <span className="text-purple-700 font-medium">Add New Startup</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-medium">Find Mentors</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{activity.action}</span>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* My Startups Preview */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">My Startups</h3>
            <button className="text-purple-600 hover:text-purple-700 font-medium">View All</button>
          </div>
          
          {userStartups.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {userStartups.slice(0, 2).map((startup) => (
                <div key={startup.id} className="card-hover border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{startup.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{startup.description}</p>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    {startup.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No startups yet. Ready to build something amazing?</p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 btn-hover">
                Create Your First Startup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};