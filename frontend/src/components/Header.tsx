import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, isModerator, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="fantasy-gradient text-white shadow-lg">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="font-bold font-fantasy">
              <div className="text-3xl">Olden Wiki</div>
              <div className="text-xs ml-4">A Heroes of Might and Magic: Olden Era Fan Site</div>
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* Main Navigation */}
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    to="/" 
                    className="hover:text-primary-200 transition-colors duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/news" 
                    className="hover:text-primary-200 transition-colors duration-200"
                  >
                    News
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/game-info" 
                    className="hover:text-primary-200 transition-colors duration-200"
                  >
                    Factions
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/screenshots" 
                    className="hover:text-primary-200 transition-colors duration-200"
                  >
                    Screenshots
                  </Link>
                </li>
                <li>
                  <Link
                    to="/forum"
                    className="hover:text-primary-200 transition-colors duration-200"
                  >
                    Forum
                  </Link>
                </li>
                {isModerator && (
                  <li>
                    <Link 
                      to="/admin/news" 
                      className="hover:text-primary-200 transition-colors duration-200 bg-white/20 px-2 py-1 rounded"
                    >
                      Admin
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:text-primary-200 transition-colors duration-200 focus:outline-none"
                >
                  {user?.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={user.displayName}
                      className="h-8 w-8 rounded-full border-2 border-white/50"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50">
                      <span className="text-sm font-medium">
                        {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm">{user?.displayName}</span>
                  <svg 
                    className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1 text-sm border border-white/50 rounded hover:bg-white/10 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;