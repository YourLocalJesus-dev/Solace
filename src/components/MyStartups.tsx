import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { User, Startup } from '../types';
import { getUserStartups, saveStartup, deleteStartup } from '../utils/storage';
import { generateId } from '../utils/auth';

interface MyStartupsProps {
  user: User;
}

export const MyStartups: React.FC<MyStartupsProps> = ({ user }) => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    founder: user.username
  });

  useEffect(() => {
    loadStartups();
  }, [user.id]);

  const loadStartups = () => {
    const userStartups = getUserStartups(user.id);
    setStartups(userStartups);
  };

  const openModal = (startup?: Startup) => {
    if (startup) {
      setEditingStartup(startup);
      setFormData({
        name: startup.name,
        description: startup.description,
        category: startup.category,
        founder: startup.founder
      });
    } else {
      setEditingStartup(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        founder: user.username
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
      category: '',
      founder: user.username
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startup: Startup = {
      id: editingStartup ? editingStartup.id : generateId(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      founder: formData.founder,
      userId: user.id,
      createdAt: editingStartup ? editingStartup.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveStartup(startup);
    loadStartups();
    closeModal();
  };

  const handleDelete = (startupId: string) => {
    if (confirm('Are you sure you want to delete this startup?')) {
      deleteStartup(startupId);
      loadStartups();
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Startups</h1>
          <p className="text-gray-600 mt-2">Manage and showcase your entrepreneurial ventures</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center space-x-2 btn-hover"
        >
          <Plus className="h-5 w-5" />
          <span>Add Startup</span>
        </button>
      </div>

      {startups.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <div key={startup.id} className="card-hover bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{startup.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(startup)}
                    className="text-blue-600 hover:text-blue-700 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(startup.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{startup.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  {startup.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(startup.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-sm p-12">
            <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No startups yet</h3>
            <p className="text-gray-600 mb-6">
              Ready to turn your ideas into reality? Create your first startup!
            </p>
            <button
              onClick={() => openModal()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 btn-hover"
            >
              Create My First Startup
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingStartup ? 'Edit Startup' : 'Add New Startup'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Name
                </label>
                <input
                  type="text"
                  required
                  className="form-input w-full px-4 py-3 rounded-lg"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  className="form-input w-full px-4 py-3 rounded-lg resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  required
                  className="form-input w-full px-4 py-3 rounded-lg"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Environment">Environment</option>
                  <option value="Social Impact">Social Impact</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 btn-hover"
                >
                  {editingStartup ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};