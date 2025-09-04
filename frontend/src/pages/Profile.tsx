import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Unable to load user profile.</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={user.displayName}
                    className="h-20 w-20 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-2xl font-bold text-primary-600">
                      {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold font-fantasy">{user.displayName}</h1>
                <p className="text-primary-100">{user.email}</p>
                <div className="flex space-x-2 mt-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {user.firstName || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {user.lastName || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-mono">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Roles</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                  className="btn btn-primary disabled:opacity-50"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Sign Out
                </button>
              </div>
              
              {isEditing && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Profile editing functionality will be implemented in a future update.
                  </p>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">News Articles</h3>
              <p className="text-2xl font-bold text-primary-600 mt-2">0</p>
              <p className="text-sm text-gray-500">Articles read</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Comments</h3>
              <p className="text-2xl font-bold text-primary-600 mt-2">0</p>
              <p className="text-sm text-gray-500">Comments posted</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Forum Posts</h3>
              <p className="text-2xl font-bold text-primary-600 mt-2">0</p>
              <p className="text-sm text-gray-500">Posts created</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Community features and statistics will be expanded as more functionality is added.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;