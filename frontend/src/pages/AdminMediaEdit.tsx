import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { mediaApi } from '../services/api';
import MediaForm from '../components/MediaForm';

const AdminMediaEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mediaId = parseInt(id || '0', 10);
  
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaItem = async () => {
      if (!mediaId) {
        setIsError(true);
        setError('Invalid media ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await mediaApi.getMediaItem(mediaId);
        setMediaItem(response.data);
      } catch (err: any) {
        setIsError(true);
        setError(err.response?.data?.message || 'Failed to load media item');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaItem();
  }, [mediaId]);

  const handleSave = (updatedMediaItem: MediaItem) => {
    // Success message could be shown here
    navigate('/admin/media');
  };

  const handleCancel = () => {
    navigate('/admin/media');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading media item...</p>
      </div>
    );
  }

  if (isError || !mediaItem) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Media Item Not Found</h1>
        <p className="text-gray-600 mb-6">
          {error || 'The media item you\'re trying to edit doesn\'t exist.'}
        </p>
        <button 
          onClick={() => navigate('/admin/media')}
          className="btn btn-primary"
        >
          Back to Media Management
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-fantasy">Edit Media Item</h1>
        <p className="mt-2 text-gray-600">
          Make changes to "{mediaItem.title}"
        </p>
      </div>

      {/* Media Preview */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Media</h2>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {mediaItem.thumbnailUrl ? (
              <img
                src={mediaItem.thumbnailUrl}
                alt={mediaItem.title}
                className="w-32 h-24 object-cover rounded-lg"
              />
            ) : (
              <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-900 capitalize">
                {mediaItem.mediaType}
              </span>
              {mediaItem.width && mediaItem.height && (
                <span className="text-sm text-gray-500">
                  {mediaItem.width} × {mediaItem.height}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Category: {mediaItem.category?.name}
            </p>
            {mediaItem.faction && (
              <p className="text-sm text-gray-600 mb-2">
                Faction: {mediaItem.faction.name}
              </p>
            )}
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                mediaItem.isApproved 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {mediaItem.isApproved ? 'Approved' : 'Pending'}
              </span>
              {mediaItem.isFeatured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <MediaForm mediaItem={mediaItem} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};

export default AdminMediaEdit;