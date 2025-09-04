import React, { useState } from 'react';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Olden Wiki',
    siteDescription: 'A Heroes of Might and Magic: Olden Era Fan Site',
    enableComments: true,
    moderateComments: true,
    enableRegistration: true,
    requireEmailVerification: true,
    maxFileUploadSize: 10, // MB
    maintenanceMode: false,
    maintenanceMessage: 'The site is temporarily under maintenance. Please check back later.',
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save settings
      console.log('Saving settings:', settings);
      // await api.put('/admin/settings', settings);
      setIsDirty(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to original values
    setSettings({
      siteName: 'Olden Wiki',
      siteDescription: 'A Heroes of Might and Magic: Olden Era Fan Site',
      enableComments: true,
      moderateComments: true,
      enableRegistration: true,
      requireEmailVerification: true,
      maxFileUploadSize: 10,
      maintenanceMode: false,
      maintenanceMessage: 'The site is temporarily under maintenance. Please check back later.',
    });
    setIsDirty(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-fantasy">Site Settings</h1>
        {isDirty && (
          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              disabled={isSaving}
            >
              Reset Changes
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                rows={3}
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="maxFileUploadSize" className="block text-sm font-medium text-gray-700 mb-2">
                Max File Upload Size (MB)
              </label>
              <input
                type="number"
                id="maxFileUploadSize"
                min="1"
                max="100"
                value={settings.maxFileUploadSize}
                onChange={(e) => handleInputChange('maxFileUploadSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* User & Security Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">User & Security</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Enable User Registration</h3>
                <p className="text-sm text-gray-500">Allow new users to register accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableRegistration}
                  onChange={(e) => handleInputChange('enableRegistration', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Require Email Verification</h3>
                <p className="text-sm text-gray-500">Users must verify their email before logging in</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Comment Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Enable Comments</h3>
                <p className="text-sm text-gray-500">Allow users to comment on news articles</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableComments}
                  onChange={(e) => handleInputChange('enableComments', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Moderate Comments</h3>
                <p className="text-sm text-gray-500">Comments require approval before being published</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.moderateComments}
                  onChange={(e) => handleInputChange('moderateComments', e.target.checked)}
                  disabled={!settings.enableComments}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 ${settings.enableComments ? 'bg-gray-200' : 'bg-gray-100'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600`}></div>
              </label>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Maintenance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Temporarily disable the site for maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {settings.maintenanceMode && (
              <div>
                <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Message
                </label>
                <textarea
                  id="maintenanceMessage"
                  rows={3}
                  value={settings.maintenanceMessage}
                  onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Message to display to users during maintenance"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Developer Notice */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Development Note</h3>
            <p className="text-sm text-blue-700 mt-1">
              Settings functionality is prepared but not yet connected to a backend API. 
              The save operation will be implemented when the settings management API is created.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;