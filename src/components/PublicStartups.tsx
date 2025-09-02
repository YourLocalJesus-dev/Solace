import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, ExternalLink, Rocket, X, Eye, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface Startup {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  visibility: string;
  created_at: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
}

export const PublicStartups: React.FC = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadStartups();
  }, []);

  useEffect(() => {
    filterAndSortStartups();
  }, [startups, searchTerm, sortBy]);

  const loadStartups = async () => {
    try {
      const { data: startupsData, error } = await supabase
        .from('startups')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: authData } = await supabase.auth.admin.listUsers();
      
      const enrichedStartups = startupsData?.map(startup => {
        const userInfo = authData?.users?.find(u => u.id === startup.user_id);
        return {
          ...startup,
          username: userInfo?.user_metadata?.username || userInfo?.email?.split('@')[0] || 'Anonymous',
          avatar_url: userInfo?.user_metadata?.avatar_url
        };
      }) || [];

      setStartups(enrichedStartups);
    } catch (error) {
      console.error('Error loading startups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortStartups = () => {
    let filtered = [...startups];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(startup =>
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredStartups(filtered);
  };

  const truncateDescription = (text: string, limit: number = 150) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 -left-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-400 rounded-full filter blur-3xl opacity-20 animate-pulse delay-500"></div>
        </div>
        <div className="spinner relative z-10"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -left-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-400 rounded-full filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-700/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-75"></div>
                <Rocket className="h-8 w-8 text-white relative" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Startup Showcase</h1>
                <p className="text-gray-600 dark:text-gray-300">Discover amazing startups from young entrepreneurs</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all hover:scale-105"
              >
                Back to Home
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25"
                >
                  Join Community
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Filters and Search */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-white/30 dark:border-gray-700/30">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search startups, founders, or descriptions..."
                className="form-input w-full pl-10 pr-4 py-3 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Sort */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <select
                  className="form-input pl-10 pr-8 py-3 rounded-lg appearance-none bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white min-w-[140px] backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredStartups.length} of {startups.length} startups
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Startups Grid */}
        {filteredStartups.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStartups.map((startup) => (
              <div key={startup.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                {/* Startup Image */}
                {startup.image_url && (
                  <div className="relative overflow-hidden">
                    <img 
                      src={startup.image_url} 
                      alt={startup.name}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}
                
                {/* Startup Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{startup.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {truncateDescription(startup.description)}
                  </p>

                  {startup.description.length > 150 && (
                    <button
                      onClick={() => setSelectedStartup(startup)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium mb-4 flex items-center space-x-1 transition-all"
                    >
                      <span>Read More</span>
                      <Eye className="h-3 w-3" />
                    </button>
                  )}

                  {/* Founder Info */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50/70 dark:bg-gray-700/70 rounded-lg mb-4 backdrop-blur-sm border border-gray-100/30 dark:border-gray-600/30">
                    <div className="relative">
                      <img
                        src={startup.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                        alt={startup.username || 'Founder'}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/50 dark:border-gray-600/50"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                        <User className="h-2 w-2 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {startup.username || 'Anonymous Founder'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Founder</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(startup.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <button 
                      onClick={() => setSelectedStartup(startup)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium flex items-center space-x-1 transition-all group"
                    >
                      <span>Learn More</span>
                      <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-12 border border-white/30 dark:border-gray-700/30">
              <div className="relative inline-block mb-4">
                <Rocket className="h-16 w-16 text-gray-400 mx-auto" />
                <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No startups found' : 'No public startups yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search criteria'
                  : 'Be the first to share your startup with the community!'
                }
              </p>
              {!searchTerm && !user && (
                <Link
                  to="/signup"
                  className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25"
                >
                  Join the Community
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        {filteredStartups.length > 0 && !user && (
          <div className="mt-16 text-center">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/30 dark:border-gray-700/30">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Share Your Startup?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Join our community of young entrepreneurs and showcase your innovative ideas. 
                Get feedback, find mentors, and connect with like-minded kidpreneurs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25"
                >
                  Join Solace
                </Link>
                <Link
                  to="/"
                  className="border-2 border-purple-600 text-purple-600 dark:text-purple-400 px-8 py-3 rounded-lg hover:bg-purple-600 hover:text-white transition-all backdrop-blur-sm bg-white/30"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Startup Detail Modal */}
      {selectedStartup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/30 dark:border-gray-700/30">
            <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStartup.name}</h3>
              <button 
                onClick={() => setSelectedStartup(null)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {selectedStartup.image_url && (
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <img 
                    src={selectedStartup.image_url} 
                    alt={selectedStartup.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              )}

              {/* Founder Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50/70 dark:bg-gray-700/70 rounded-lg mb-6 backdrop-blur-sm border border-gray-100/30 dark:border-gray-600/30">
                <div className="relative">
                  <img
                    src={selectedStartup.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'}
                    alt={selectedStartup.username || 'Founder'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/50 dark:border-gray-600/50"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                    <User className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedStartup.username || 'Anonymous Founder'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Founded on {new Date(selectedStartup.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Full Description */}
              <div className="prose dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About This Startup</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedStartup.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {!user && (
                  <>
                    <Link
                      to="/signup"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 text-center"
                    >
                      Join Community
                    </Link>
                    <Link
                      to="/login"
                      className="flex-1 border-2 border-purple-600 text-purple-600 dark:text-purple-400 px-6 py-3 rounded-lg hover:bg-purple-600 hover:text-white transition-all backdrop-blur-sm bg-white/30 text-center"
                    >
                      Sign In
                    </Link>
                  </>
                )}
                {user && (
                  <Link
                    to="/my-startups"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 text-center"
                  >
                    Create Your Startup
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};