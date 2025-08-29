import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Settings, Shield, LogOut, Rocket } from 'lucide-react';
import { User } from '../../types';
import { removeAuthCookie } from '../../utils/auth';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthCookie();
    onLogout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/my-startups', icon: Briefcase, label: 'My Startups' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  if (user.isAdmin) {
    navItems.push({ to: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <div className="sidebar bg-white h-full w-64 fixed left-0 top-0 shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Rocket className="h-8 w-8 text-purple-600" />
          <span className="text-xl font-bold gradient-text">Solace</span>
        </div>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={user.profilePicture || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{user.username}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-item flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'active text-purple-700 bg-purple-100'
                      : 'text-gray-700 hover:text-purple-700'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};