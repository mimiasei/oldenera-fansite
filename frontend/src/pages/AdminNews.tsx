import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../hooks/useSWR';
import { newsApi } from '../services/api';
import { NewsArticle } from '../types';

const AdminNews = () => {
  const { news, isLoading, isError, refetch } = useNews();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (article: NewsArticle) => {
    if (!confirm(`Are you sure you want to delete "${article.title}"?`)) {
      return;
    }

    setDeletingId(article.id);
    try {
      await newsApi.delete(article.id);
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete article. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading articles...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 text-lg">Failed to load articles</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure the ASP.NET Core backend is running: <code className="bg-gray-200 px-2 py-1 rounded">cd backend && dotnet run</code>
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-fantasy">Manage News Articles</h1>
        <Link to="/admin/news/create" className="btn btn-primary">
          Create New Article
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-500 mb-4">No articles yet</h2>
          <p className="text-gray-400 mb-6">Create your first news article to get started.</p>
          <Link to="/admin/news/create" className="btn btn-primary">
            Create First Article
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {news.map((article) => (
              <li key={article.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          article.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {article.title}
                        </h3>
                        <div className="flex items-center mt-1 space-x-4">
                          <p className="text-sm text-gray-500">
                            By {article.author}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </p>
                          {article.tags.length > 0 && (
                            <div className="flex space-x-1">
                              {article.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                  {tag}
                                </span>
                              ))}
                              {article.tags.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{article.tags.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/news/${article.id}`}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      View
                    </Link>
                    <Link
                      to={`/admin/news/edit/${article.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article)}
                      disabled={deletingId === article.id}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      {deletingId === article.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminNews;