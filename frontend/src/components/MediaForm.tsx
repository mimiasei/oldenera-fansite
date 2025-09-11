import { useState } from 'react';
import { MediaItem } from '../types';
import { mediaApi } from '../services/api';
import { useMediaCategories, useFactions } from '../hooks/useSWR';

interface MediaFormProps {
  mediaItem?: MediaItem;
  onSave?: (mediaItem: MediaItem) => void;
  onCancel?: () => void;
}

const MediaForm = ({ mediaItem, onSave, onCancel }: MediaFormProps) => {
  const [formData, setFormData] = useState({
    title: mediaItem?.title || '',
    description: mediaItem?.description || '',
    mediaType: mediaItem?.mediaType || 'image',
    altText: mediaItem?.altText || '',
    caption: mediaItem?.caption || '',
    tags: mediaItem?.tags || '',
    categoryId: mediaItem?.categoryId || 0,
    factionId: mediaItem?.factionId || 0,
    isApproved: mediaItem?.isApproved ?? false,
    isFeatured: mediaItem?.isFeatured ?? false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { categories, isLoading: categoriesLoading } = useMediaCategories();
  const { factions, isLoading: factionsLoading } = useFactions();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               name === 'categoryId' || name === 'factionId' ? parseInt(value) || 0 : 
               value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const selectedCategory = categories.find(c => c.id === formData.categoryId);
      const selectedFaction = factions.find(f => f.id === formData.factionId);
      
      const mediaData = {
        ...mediaItem, // Include all existing media item data
        ...formData, // Override with form data
        categoryId: formData.categoryId || 1,
        category: selectedCategory || mediaItem?.category, // Include full category object
        factionId: formData.factionId || undefined,
        faction: formData.factionId ? selectedFaction : undefined, // Include full faction object or undefined
        // Ensure required fields are preserved from original media item
        originalUrl: mediaItem?.originalUrl || '',
        fileSize: mediaItem?.fileSize || 0,
        viewCount: mediaItem?.viewCount || 0,
        sortOrder: mediaItem?.sortOrder || 0,
      };

      if (mediaItem?.id) {
        // Update existing media item
        const response = await mediaApi.updateMediaItem(mediaItem.id, mediaData);
        onSave?.(response.data);
      } else {
        // Create new media item (though this might not be fully implemented)
        const response = await mediaApi.createMediaItem(mediaData as any);
        onSave?.(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save media item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesLoading || factionsLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-gray-600">Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            name="description"
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Detailed description of the media item..."
          />
        </div>

        {/* Media Type and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700">
              Media Type *
            </label>
            <select
              name="mediaType"
              id="mediaType"
              required
              value={formData.mediaType}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="gif">GIF</option>
            </select>
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="categoryId"
              id="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={0}>Select a category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alt Text and Caption Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="altText" className="block text-sm font-medium text-gray-700">
              Alt Text
            </label>
            <input
              type="text"
              name="altText"
              id="altText"
              value={formData.altText}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Alternative text for accessibility"
            />
          </div>

          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
              Caption
            </label>
            <input
              type="text"
              name="caption"
              id="caption"
              value={formData.caption}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Optional caption for the media"
            />
          </div>
        </div>

        {/* Tags and Faction Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={formData.tags}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="screenshot, gameplay, concept (comma-separated)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate multiple tags with commas
            </p>
          </div>

          <div>
            <label htmlFor="factionId" className="block text-sm font-medium text-gray-700">
              Related Faction
            </label>
            <select
              name="factionId"
              id="factionId"
              value={formData.factionId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={0}>No specific faction</option>
              {factions.map((faction) => (
                <option key={faction.id} value={faction.id}>
                  {faction.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isApproved"
              id="isApproved"
              checked={formData.isApproved}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isApproved" className="ml-2 block text-sm text-gray-700">
              Approved for public display
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
              Featured item (highlighted in gallery)
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : mediaItem?.id ? 'Update Media Item' : 'Create Media Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MediaForm;