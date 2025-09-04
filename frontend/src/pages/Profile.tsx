import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UpdateProfileRequest } from '../services/api';
import AvatarSelector from '../components/AvatarSelector';

const Profile: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    profilePictureUrl: user?.profilePictureUrl || ''
  });
  const [error, setError] = useState<string | null>(null);

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

  const handleEditClick = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      profilePictureUrl: user?.profilePictureUrl || ''
    });
    setError(null);
    setIsEditing(true);
  };

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      profilePictureUrl: user?.profilePictureUrl || ''
    });
  };

  const handleAvatarSelect = (avatarPath: string) => {
    setFormData(prev => ({
      ...prev,
      profilePictureUrl: avatarPath
    }));
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      setShowAvatarSelector(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 relative">
                <div
                  className={`h-20 w-20 rounded-full border-4 border-white shadow-lg ${
                    isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
                  }`}
                  onClick={handleAvatarClick}
                >
                  {(isEditing ? formData.profilePictureUrl : user.profilePictureUrl) ? (
                    <img
                      src={isEditing ? formData.profilePictureUrl || '' : user.profilePictureUrl || ''}
                      alt={user.displayName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
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
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {user.firstName || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {user.lastName || 'Not provided'}
                      </p>
                    )}
                  </div>
                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Avatar</label>
                      <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm text-blue-700">
                              Click on your profile picture above to choose from fantasy-themed avatars.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
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
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn btn-primary disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="btn btn-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditClick}
                      className="btn btn-primary"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="btn btn-secondary bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
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
      
      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={formData.profilePictureUrl || ''}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
};

export default Profile;