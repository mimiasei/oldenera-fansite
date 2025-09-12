import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaItems, useMediaCategories } from '../hooks/useSWR';
import { mediaApi, MediaFiltersParams, adminApi, RegenerateThumbnailsRequest } from '../services/api';
import { MediaItem } from '../types';

const AdminMedia: React.FC = () => {
  const [filters, setFilters] = useState<MediaFiltersParams>({
    approvedOnly: false, // Show all items for admin
    pageSize: 50,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [regeneratingThumbnails, setRegeneratingThumbnails] = useState(false);
  const [thumbnailResults, setThumbnailResults] = useState<any[]>([]);

  const { mediaItems, isLoading, isError, refetch } = useMediaItems(filters);
  const { categories } = useMediaCategories();

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return;
    }

    setDeletingId(item.id);
    try {
      await mediaApi.deleteMediaItem(item.id);
      refetch();
    } catch (error) {
      console.error('Failed to delete media item:', error);
      alert('Failed to delete media item. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleApproval = async (item: MediaItem) => {
    setUpdatingId(item.id);
    try {
      await mediaApi.updateMediaItem(item.id, {
        ...item,
        isApproved: !item.isApproved,
      });
      refetch();
    } catch (error) {
      console.error('Failed to update approval status:', error);
      alert('Failed to update approval status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRegenerateThumbnails = async (force: boolean = false) => {
    const confirmed = confirm(
      force 
        ? 'This will regenerate ALL thumbnails, even existing ones. This may take several minutes. Continue?'
        : 'This will generate thumbnails for media items that are missing WebP thumbnails. Continue?'
    );
    
    if (!confirmed) return;

    setRegeneratingThumbnails(true);
    setThumbnailResults([]);
    
    try {
      const request: RegenerateThumbnailsRequest = { force };
      const response = await adminApi.regenerateThumbnails(request);
      
      setThumbnailResults(response.data.results || []);
      refetch(); // Refresh media items to show new thumbnails
      
      alert(response.data.message);
    } catch (error: any) {
      console.error('Failed to regenerate thumbnails:', error);
      const errorMessage = error.response?.data?.message || 'Failed to regenerate thumbnails';
      alert(`Error: ${errorMessage}`);
    } finally {
      setRegeneratingThumbnails(false);
    }
  };

  const handleToggleFeatured = async (item: MediaItem) => {
    setUpdatingId(item.id);
    try {
      await mediaApi.updateMediaItem(item.id, {
        ...item,
        isFeatured: !item.isFeatured,
      });
      refetch();
    } catch (error) {
      console.error('Failed to update featured status:', error);
      alert('Failed to update featured status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading media items...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 text-lg">Failed to load media items</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure the ASP.NET Core backend is running: <code className="bg-gray-200 px-2 py-1 rounded">cd backend && dotnet run</code>
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Management</h1>
          <p className="text-gray-600 mt-2">Manage screenshots, concept art, and other media content</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleRegenerateThumbnails(false)}
            disabled={regeneratingThumbnails}
            className="btn btn-secondary"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {regeneratingThumbnails ? 'Generating...' : 'Generate WebP Thumbnails'}
          </button>
          <button 
            onClick={() => handleRegenerateThumbnails(true)}
            disabled={regeneratingThumbnails}
            className="btn btn-secondary"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {regeneratingThumbnails ? 'Regenerating...' : 'Force Regenerate All'}
          </button>
          <button className="btn btn-primary">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Media
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, categoryId: undefined }))}
              className={`px-3 py-2 rounded-md text-sm ${
                !filters.categoryId 
                  ? 'bg-primary-100 text-primary-800 border-primary-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } border`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilters(prev => ({ ...prev, categoryId: category.id }))}
                className={`px-3 py-2 rounded-md text-sm border ${
                  filters.categoryId === category.id
                    ? 'bg-primary-100 text-primary-800 border-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setFilters(prev => ({ ...prev, approvedOnly: false }))}
              className={`px-3 py-2 rounded-md text-sm border ${
                !filters.approvedOnly
                  ? 'bg-secondary-100 text-secondary-800 border-secondary-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, approvedOnly: true }))}
              className={`px-3 py-2 rounded-md text-sm border ${
                filters.approvedOnly
                  ? 'bg-secondary-100 text-secondary-800 border-secondary-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved Only
            </button>
          </div>
        </div>
      </div>

      {/* Media Items Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {mediaItems.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mt-2">No media items found</h3>
            <p className="text-gray-500">Upload your first media item to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Media
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mediaItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {item.mediaType}
                            </span>
                            {item.width && item.height && (
                              <span className="text-xs text-gray-500 ml-2">
                                {item.width} × {item.height}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getCategoryName(item.categoryId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isApproved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.isApproved ? 'Approved' : 'Pending'}
                        </span>
                        {item.isFeatured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.viewCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/media/${item.id}/edit`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleApproval(item)}
                          disabled={updatingId === item.id}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                            item.isApproved
                              ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                              : 'text-green-700 bg-green-100 hover:bg-green-200'
                          } disabled:opacity-50`}
                        >
                          {item.isApproved ? 'Unapprove' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(item)}
                          disabled={updatingId === item.id}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                            item.isFeatured
                              ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                              : 'text-primary-700 bg-primary-100 hover:bg-primary-200'
                          } disabled:opacity-50`}
                        >
                          {item.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50"
                        >
                          {deletingId === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedia;