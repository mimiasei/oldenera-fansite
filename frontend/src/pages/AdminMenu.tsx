import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminMediaCategories from '../components/admin/AdminMediaCategories';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  component: React.ComponentType;
}

const AdminMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeMenuItem, setActiveMenuItem] = useState<string>('media-categories');
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  // Check if user is admin
  if (!user || !user.roles.includes('Admin')) {
    navigate('/admin');
    return null;
  }

  const menuItems: MenuItem[] = [
    {
      id: 'media-categories',
      label: 'Media Categories',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5zM21 15a2 2 0 00-2-2h-4a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4z" />
        </svg>
      ),
      description: '',
      component: AdminMediaCategories
    },
  ];

  const activeComponent = menuItems.find(item => item.id === activeMenuItem)?.component;
  const ActiveComponent = activeComponent || AdminMediaCategories;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-fantasy">Admin Management</h1>
              <p className="text-primary-100 mt-1">
                Comprehensive data management and administration tools
              </p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="btn btn-secondary"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8 relative">
          {/* Show Sidebar Button (when hidden) */}
          {!sidebarVisible && (
            <button
              onClick={() => setSidebarVisible(true)}
              className="fixed left-4 top-1/8 transform z-10 p-2 hover:bg-gray-800 text-white rounded-lg shadow-lg transition-colors"
              title="Show sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Sidebar */}
          <div className={`flex-shrink-0 transition-all duration-200 ${
            sidebarVisible ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'
          }`}>
            <div className="bg-gray-700/50 rounded-lg p-6 sticky top-8 relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Management Sections</h2>
                <button
                  onClick={() => setSidebarVisible(false)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded transition-colors"
                  title="Hide sidebar"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenuItem(item.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      activeMenuItem === item.id
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm opacity-75 mt-1">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/admin/game-assets')}
                    className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-gray-700/50 transition-colors"
                  >
                    🎮 Game Assets Management
                  </button>
                  <button
                    onClick={() => navigate('/admin/media')}
                    className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-gray-700/50 transition-colors"
                  >
                    📸 Media Management
                  </button>
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-gray-700/50 transition-colors"
                  >
                    📊 Admin Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;