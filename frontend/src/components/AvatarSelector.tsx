import React, { useState } from 'react';
import { getAvatarsByCategory, AvatarOption } from '../data/avatars';

interface AvatarSelectorProps {
  currentAvatar?: string;
  onSelect: (avatarPath: string) => void;
  onClose: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ 
  currentAvatar, 
  onSelect, 
  onClose 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Human');
  const avatarsByCategory = getAvatarsByCategory();
  const categories = Object.keys(avatarsByCategory).sort();

  const handleAvatarSelect = (avatar: AvatarOption) => {
    onSelect(avatar.path);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 font-fantasy">
            Choose Your Avatar
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white border-b-2 border-primary-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {category}
              <span className="ml-1 text-xs opacity-75">
                ({avatarsByCategory[category].length})
              </span>
            </button>
          ))}
        </div>

        {/* Avatar Grid */}
        <div className="p-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-96 overflow-y-auto">
          {avatarsByCategory[selectedCategory]?.map(avatar => (
            <div
              key={avatar.id}
              className={`relative cursor-pointer group ${
                currentAvatar === avatar.path
                  ? 'ring-4 ring-primary-500 ring-opacity-75'
                  : 'hover:ring-2 hover:ring-primary-300'
              } rounded-lg overflow-hidden transition-all duration-200`}
              onClick={() => handleAvatarSelect(avatar)}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={avatar.path}
                  alt={avatar.name}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/icons/avatars/Human_01_nobg.webp';
                  }}
                />
              </div>
              
              {/* Avatar Name Overlay
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">
                  {avatar.name}
                </p>
              </div> */}
              
              {/* Selection Indicator */}
              {currentAvatar === avatar.path && (
                <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSelect('')}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Remove Avatar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;