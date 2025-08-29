import React, { useState } from 'react';
import { User, Camera, Save } from 'lucide-react';
import { User as UserType } from '../types';
import { saveUser } from '../utils/storage';
import { setAuthCookie } from '../utils/auth';

interface SettingsProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    profilePicture: user.profilePicture || ''
  });
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);

    const updatedUser = {
      ...user,
      username: formData.username,
      profilePicture: formData.profilePicture
    };

    saveUser(updatedUser);
    setAuthCookie(updatedUser);
    onUpdateUser(updatedUser);
    
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600 mb-8">Manage your profile and account preferences</p>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <img
                    src={formData.profilePicture || predefinedAvatars[0]}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-4">Choose a new profile picture</p>
                  <div className="grid grid-cols-3 gap-3">
                    {predefinedAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData({...formData, profilePicture: avatar})}
                        className={`w-16 h-16 rounded-full border-2 overflow-hidden hover:border-purple-500 transition-all ${
                          formData.profilePicture === avatar ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
                        }`}
                      >
                        <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Username Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    required
                    className="form-input block w-full px-4 py-3 rounded-lg"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    className="form-input block w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-500"
                    value={user.email}
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center space-x-2 btn-hover disabled:opacity-50"
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