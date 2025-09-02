import React, { useState, useEffect } from 'react';
import { User, Camera, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    avatar_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.user_metadata?.username || user.email?.split('@')[0] || '',
        avatar_url: user.user_metadata?.avatar_url || ''
      });
    }
  }, [user]);

  const predefinedAvatars = [
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: formData.username,
          avatar_url: formData.avatar_url
        }
      });

      if (error) throw error;
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 md:p-8">
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
        
        .glossy-card {
          backdrop-filter: blur(10px);
          background: rgba(30, 30, 40, 0.7);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.36),
            inset 0 1px 1px rgba(255, 255, 255, 0.1),
            0 0 20px rgba(167, 139, 250, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
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
        
        .avatar-ring {
          box-shadow: 
            0 0 0 4px rgba(139, 92, 246, 0.5),
            0 0 15px rgba(139, 92, 246, 0.7);
        }
        
        .spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid white;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">Settings</h1>
          <p className="text-gray-400">Manage your profile and account preferences</p>
        </div>

        <div className="glossy-card rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-300" />
                Profile Picture
              </h3>
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative flex-shrink-0">
                  <div className="relative">
                    <img
                      src={formData.avatar_url || predefinedAvatars[0]}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover avatar-ring"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-4">Choose a new profile picture</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {predefinedAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData({...formData, avatar_url: avatar})}
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden transition-all duration-300 ${
                          formData.avatar_url === avatar 
                            ? 'avatar-ring scale-110' 
                            : 'border-2 border-gray-700 hover:border-purple-500 hover:scale-110'
                        }`}
                      >
                        <img 
                          src={avatar} 
                          alt={`Avatar ${index + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Username Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 cursor-not-allowed"
                    value={user?.email || ''}
                  />
                  <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="glossy-button text-white px-6 py-3 rounded-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};