import React, { useState } from 'react';
import { useNews } from '../../hooks/useSWR';
import AdminTable, { AdminTableColumn } from '../AdminTable';
import { NewsArticle } from '../../types';
import { updateNewsArticle, createNewsArticle, deleteNewsArticle } from '../../services/api';

const AdminNewsArticles: React.FC = () => {
  const { news, isLoading, error, refetch: mutate } = useNews({});
  const [hasChanges, setHasChanges] = useState(false);
  const [localNews, setLocalNews] = useState<NewsArticle[]>([]);

  React.useEffect(() => {
    if (news) {
      setLocalNews([...news]);
    }
  }, [news]);

  const columns: AdminTableColumn<NewsArticle>[] = [
    {
      key: 'id',
      label: 'ID',
      type: 'readonly',
      width: '80px'
    },
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Article title...',
      maxLength: 200,
      width: '250px'
    },
    {
      key: 'summary',
      label: 'Summary',
      type: 'textarea',
      required: true,
      placeholder: 'Brief summary...',
      maxLength: 300,
      width: '300px'
    },
    {
      key: 'author',
      label: 'Author',
      type: 'text',
      required: true,
      placeholder: 'Author name...',
      maxLength: 100,
      width: '150px'
    },
    {
      key: 'isPublished',
      label: 'Published',
      type: 'checkbox',
      width: '100px'
    },
    {
      key: 'imageUrl',
      label: 'Featured Image',
      type: 'text',
      placeholder: '/images/news/article.jpg',
      maxLength: 255,
      width: '200px'
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'text',
      placeholder: 'tag1, tag2, tag3',
      width: '200px',
      render: (value: string[]) => Array.isArray(value) ? value.join(', ') : '-'
    },
    {
      key: 'publishedAt',
      label: 'Published Date',
      type: 'date',
      width: '140px'
    },
    {
      key: 'createdAt',
      label: 'Created',
      type: 'readonly',
      width: '120px',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      type: 'readonly',
      width: '120px',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  const handleUpdate = (id: string | number, field: keyof NewsArticle, value: any) => {
    // Handle tags conversion
    let processedValue = value;
    if (field === 'tags' && typeof value === 'string') {
      processedValue = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    // Update local state only
    setLocalNews(prev => prev.map(article =>
      article.id === id ? { ...article, [field]: processedValue } : article
    ));
    setHasChanges(true);
  };

  const handleAdd = () => {
    const newArticle = {
      id: -Date.now(), // Temporary negative ID
      title: 'New Article',
      content: 'Article content goes here...',
      summary: 'Brief summary of the article',
      author: 'Admin',
      isPublished: false,
      imageUrl: '',
      tags: [],
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as NewsArticle;

    setLocalNews(prev => [newArticle, ...prev]);
    setHasChanges(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteNewsArticle(Number(id));
      await mutate();
    } catch (error) {
      console.error('Failed to delete article:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      // Save new articles
      for (const article of localNews) {
        if (article.id < 0) {
          // New article - create it
          const { id, createdAt, updatedAt, ...createData } = article;
          await createNewsArticle(createData);
        } else {
          // Existing article - check if it was modified
          const original = news?.find(a => a.id === article.id);
          if (original && JSON.stringify(original) !== JSON.stringify(article)) {
            await updateNewsArticle(Number(article.id), article);
          }
        }
      }

      // Refresh data from server
      await mutate();
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
      throw error;
    }
  };

  const handleRevert = () => {
    setLocalNews(news || []);
    setHasChanges(false);
  };

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
        <h3 className="text-red-400 font-semibold mb-2">Error Loading News Articles</h3>
        <p className="text-red-300">
          {error.message || 'Failed to load news articles. Please check your connection and try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminTable
        data={localNews}
        columns={columns}
        onUpdate={handleUpdate}
        onAdd={handleAdd}
        onDelete={handleDelete}
        idField="id"
        title="News Articles"
        description="Create, edit, and manage news articles and announcements. Use the full editor by clicking on individual articles."
        isLoading={isLoading}
        hasChanges={hasChanges}
        onSave={handleSave}
        onRevert={handleRevert}
        addButtonText="Add New Article"
        emptyStateText="No news articles found. Create your first article to get started."
      />

      {/* Quick Actions */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Content Editor</h4>
            <p className="text-gray-400 text-sm mb-3">
              For full content editing with rich text, images, and formatting, use the dedicated editor.
            </p>
            <button
              onClick={() => window.open('/admin/news/new', '_blank')}
              className="btn btn-primary btn-sm"
            >
              Open Rich Editor
            </button>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Bulk Operations</h4>
            <p className="text-gray-400 text-sm mb-3">
              Publish/unpublish multiple articles or update tags in bulk.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              disabled
            >
              Coming Soon
            </button>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Analytics</h4>
            <p className="text-gray-400 text-sm mb-3">
              View article performance, engagement metrics, and reader statistics.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsArticles;