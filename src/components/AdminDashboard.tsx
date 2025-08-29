import React, { useState, useEffect } from 'react';
import { Shield, Users, Briefcase, Edit, Trash2, Search } from 'lucide-react';
import { User, Startup } from '../types';
import { getUsers, getStartups, deleteUser, saveUser } from '../utils/storage';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'startups'>('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(getUsers());
    setStartups(getStartups());
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStartups = startups.filter(startup =>
    startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    startup.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      loadData();
    }
  };

  const toggleUserAdminStatus = (user: User) => {
    const updatedUser = { ...user, isAdmin: !user.isAdmin };
    saveUser(updatedUser);
    loadData();
  };

  const stats = [
    { label: 'Total Users', value: users.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Startups', value: startups.length, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Admin Users', value: users.filter(u => u.isAdmin).length, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Today', value: Math.floor(users.length * 0.3), color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

  return (
    <div className="p-8">
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 text-purple-600 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and oversee community activity</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`card-hover bg-white p-6 rounded-xl shadow-sm border-2 ${stat.bg} border-opacity-50`}>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'users' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('startups')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'startups' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Briefcase className="h-4 w-4 inline mr-2" />
              Startups
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="form-input w-full pl-10 pr-4 py-2 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profilePicture || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleUserAdminStatus(user)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title={user.isAdmin ? 'Remove admin' : 'Make admin'}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Startups Tab */}
        {activeTab === 'startups' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => {
              const founder = users.find(u => u.id === startup.userId);
              return (
                <div key={startup.id} className="card-hover border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{startup.name}</h3>
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {startup.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{startup.description}</p>
                  
                  <div className="text-sm text-gray-500">
                    <p>Founder: {founder?.username || 'Unknown'}</p>
                    <p>Created: {new Date(startup.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};