import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Eye, EyeOff, Rocket } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface Startup {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  visibility: 'public' | 'private';
  created_at: string;
  user_id: string;
}

export const MyStartups: React.FC = () => {
  const { user } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    visibility: 'private' as 'public' | 'private'
  });

  useEffect(() => {
    if (user) {
      loadStartups();
    }
  }, [user]);

  const loadStartups = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStartups(data || []);
    } catch (error) {
      console.error('Error loading startups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (startup?: Startup) => {
    if (startup) {
      setEditingStartup(startup);
      setFormData({
        name: startup.name,
        description: startup.description,
        image_url: startup.image_url || '',
        visibility: startup.visibility
      });
    } else {
      setEditingStartup(null);
      setFormData({
        name: '',
        description: '',
        image_url: '',
        visibility: 'private'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStartup(null);
    setFormData({
      name: '',
      description: '',
      image_url: '',
      visibility: 'private'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (formData.description.length > 2000) {
      alert('Description must be 2000 characters or less');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (editingStartup) {
        const { error } = await supabase
          .from('startups')
          .update({
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url || null,
            visibility: formData.visibility
          })
          .eq('id', editingStartup.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('startups')
          .insert({
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url || null,
            visibility: formData.visibility,
            user_id: user.id
          });

        if (error) throw error;
      }

      loadStartups();
      closeModal();
    } catch (error) {
      console.error('Error saving startup:', error);
      alert('Error saving startup. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (startupId: string) => {
    if (!confirm('Are you sure you want to delete this startup?')) return;
    
    try {
      const { error } = await supabase
        .from('startups')
        .delete()
        .eq('id', startupId);

      if (error) throw error;
      loadStartups();
    } catch (error) {
      console.error('Error deleting startup:', error);
      alert('Error deleting startup. Please try again.');
    }
  };

  const toggleVisibility = async (startup: Startup) => {
    try {
      const newVisibility = startup.visibility === 'public' ? 'private' : 'public';
      const { error } = await supabase
        .from('startups')
        .update({ visibility: newVisibility })
        .eq('id', startup.id);

      if (error) throw error;
      loadStartups();
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('Error updating visibility. Please try again.');
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Startups</h1>
            <p className="text-gray-300">Manage and showcase your entrepreneurial ventures</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/20 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Startup</span>
          </button>
        </div>

        {startups.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <div key={startup.id} className="glass-card-dark rounded-2xl p-6 border border-gray-700 backdrop-blur-md hover:bg-gray-800/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{startup.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleVisibility(startup)}
                      className={`p-1 rounded ${
                        startup.visibility === 'public' 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                      title={startup.visibility === 'public' ? 'Make private' : 'Make public'}
                    >
                      {startup.visibility === 'public' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => openModal(startup)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(startup.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {startup.image_url && (
                  <img 
                    src={startup.image_url} 
                    alt={startup.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                
                <p className="text-gray-300 mb-4 line-clamp-3">{startup.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-block text-xs px-3 py-1 rounded-full ${
                    startup.visibility === 'public' 
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
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
          <div className="text-center py-12">
            <div className="glass-card-dark rounded-2xl p-12 border border-gray-700 backdrop-blur-md">
              <div className="inline-flex items-center justify-center p-4 bg-purple-600/20 rounded-full mb-4">
                <Rocket className="h-12 w-12 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No startups yet</h3>
              <p className="text-gray-300 mb-6">
                Ready to turn your ideas into reality? Create your first startup!
              </p>
              <button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/20"
              >
                Create My First Startup
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="glass-card-dark rounded-2xl border border-gray-700 shadow-xl max-w-md w-full p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingStartup ? 'Edit Startup' : 'Add New Startup'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-300">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Startup Name
                  </label>
                  <input
                    type="text"
                    required
                    className="glass-input w-full px-4 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (max 2000 characters)
                  </label>
                  <textarea
                    required
                    rows={6}
                    maxLength={2000}
                    className="glass-input w-full px-4 py-3 rounded-xl resize-none bg-gray-800/50 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    className="glass-input w-full px-4 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Visibility
                  </label>
                  <select
                    className="glass-input w-full px-4 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={formData.visibility}
                    onChange={(e) => setFormData({...formData, visibility: e.target.value as 'public' | 'private'})}
                  >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      editingStartup ? 'Update' : 'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .glass-card-dark {
          background: rgba(30, 30, 40, 0.4);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .glass-input {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
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