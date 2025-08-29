import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, ExternalLink, Rocket } from 'lucide-react';
import { Startup } from '../types';
import { getStartups, getUsers } from '../utils/storage';

export const PublicStartups: React.FC = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  const categories = [
    'Technology', 'Healthcare', 'Education', 'Environment', 
    'Social Impact', 'E-commerce', 'Entertainment', 'Other'
  ];

  useEffect(() => {
    loadStartups();
  }, []);

  useEffect(() => {
    filterAndSortStartups();
  }, [startups, searchTerm, selectedCategory, sortBy]);

  const loadStartups = () => {
    const allStartups = getStartups();
    setStartups(allStartups);
  };

  const filterAndSortStartups = () => {
    let filtered = [...startups];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(startup =>
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.founder.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(startup => startup.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredStartups(filtered);
  };

  const getFounderInfo = (userId: string) => {
    const users = getUsers();
    return users.find(user => user.id === userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Rocket className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold gradient-text">Startup Showcase</h1>
                <p className="text-gray-600">Discover amazing startups from young entrepreneurs</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-gray-600 hover:text-purple-600 font-medium transition-all"
              >
                Back to Home
              </a>
              <a
                href="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 btn-hover"
              >
                Join Community
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search startups, founders, or descriptions..."
                className="form-input w-full pl-10 pr-4 py-3 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="form-input pl-10 pr-8 py-3 rounded-lg appearance-none bg-white min-w-[160px]"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="form-input pl-10 pr-8 py-3 rounded-lg appearance-none bg-white min-w-[140px]"
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
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredStartups.length} of {startups.length} startups
              {selectedCategory && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Startups Grid */}
        {filteredStartups.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStartups.map((startup) => {
              const founder = getFounderInfo(startup.userId);
              return (
                <div key={startup.id} className="card-hover bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Startup Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{startup.name}</h3>
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        {startup.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {startup.description}
                    </p>
                  </div>

                  {/* Founder Info */}
                  <div className="px-6 pb-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={founder?.profilePicture || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                        alt={founder?.username || 'Founder'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {founder?.username || 'Anonymous Founder'}
                        </p>
                        <p className="text-xs text-gray-500">Founder</p>
                      </div>
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(startup.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1 transition-all">
                        <span>Learn More</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm p-12">
              <Rocket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedCategory ? 'No startups found' : 'No startups yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Be the first to share your startup with the community!'
                }
              </p>
              {!searchTerm && !selectedCategory && (
                <a
                  href="/signup"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 btn-hover"
                >
                  Join the Community
                </a>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        {filteredStartups.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Share Your Startup?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join our community of young entrepreneurs and showcase your innovative ideas. 
                Get feedback, find mentors, and connect with like-minded kidpreneurs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/signup"
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 btn-hover"
                >
                  Join Solace
                </a>
                <a
                  href="/"
                  className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-600 hover:text-white transition-all btn-hover"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};