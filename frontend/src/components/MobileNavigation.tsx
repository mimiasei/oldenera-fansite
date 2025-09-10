import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, isModerator, logout } = useAuth();

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Mobile Navigation Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-gradient-to-b from-primary-900 to-primary-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="text-white font-fantasy">
            <div className="text-lg font-bold">Menu</div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-primary-200 transition-colors p-2"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1">
            {/* Main Navigation */}
            <Link
              to="/"
              className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors font-fantasy"
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>

            <Link
              to="/news"
              className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors font-fantasy"
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              News
            </Link>

            <Link
              to="/factions"
              className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors font-fantasy"
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7v2a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1h1m-6 5L4 7m0 0V4m0 3h3m4 0h6.5m-7.5 7h7.5m0 0v3m0-3l-3-3m0 0h-6" />
              </svg>
              Factions
            </Link>

            <Link
              to="/screenshots"
              className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors font-fantasy"
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Screenshots
            </Link>

            <Link
              to="/forum"
              className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors font-fantasy"
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Forum
            </Link>

            {/* Admin Section */}
            {isModerator && (
              <>
                <div className="px-6 py-2">
                  <div className="border-t border-white/20"></div>
                </div>
                <div className="px-6 py-2">
                  <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">Admin</span>
                </div>

                <Link
                  to="/admin/dashboard"
                  className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors"
                  onClick={handleLinkClick}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </Link>

                <Link
                  to="/admin/news"
                  className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors"
                  onClick={handleLinkClick}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Manage News
                </Link>

                <Link
                  to="/admin/media"
                  className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors"
                  onClick={handleLinkClick}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Manage Media
                </Link>

                {user?.roles?.includes('Admin') && (
                  <>
                    <Link
                      to="/admin/users"
                      className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors"
                      onClick={handleLinkClick}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      Manage Users
                    </Link>

                    <Link
                      to="/admin/settings"
                      className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors"
                      onClick={handleLinkClick}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-white/20 p-4">
          {isAuthenticated ? (
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                {user?.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={user.displayName}
                    className="h-10 w-10 rounded-full border-2 border-white/50"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50">
                    <span className="text-sm font-medium text-white">
                      {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <div className="text-white font-medium text-sm">{user?.displayName}</div>
                  <div className="text-white/70 text-xs">{user?.email}</div>
                </div>
              </div>

              {/* User Actions */}
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 text-white hover:bg-white/10 transition-colors rounded text-sm"
                  onClick={handleLinkClick}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-white hover:bg-white/10 transition-colors rounded text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center text-white border border-white/50 rounded hover:bg-white/10 transition-colors text-sm"
                onClick={handleLinkClick}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full px-4 py-2 text-center text-white bg-white/20 rounded hover:bg-white/30 transition-colors text-sm"
                onClick={handleLinkClick}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;