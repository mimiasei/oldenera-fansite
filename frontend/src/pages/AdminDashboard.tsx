import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { fetcher, adminApi } from '../services/api';
import { Skeleton } from '../components/ui/Skeleton';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    admins: number;
    moderators: number;
    regular: number;
  };
  news: {
    total: number;
    published: number;
    drafts: number;
  };
  recentActivity: {
    users: Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      createdAt: string;
    }>;
    news: Array<{
      id: number;
      title: string;
      author: string;
      createdAt: string;
      isPublished: boolean;
    }>;
  };
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: stats, error, isLoading } = useSWR<DashboardStats>('/admin/dashboard/stats', fetcher);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    
    try {
      const response = await adminApi.triggerManualSync();
      const result = response.data;
      
      setSyncMessage(result.message);
      if (result.triggered) {
        setTimeout(() => setSyncMessage(null), 5000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to connect to server';
      setSyncMessage(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton height="32px" className="w-64 mb-2" />
            <Skeleton height="16px" className="w-48" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton height="20px" className="w-24" />
                <Skeleton height="32px" className="w-8 rounded-full" />
              </div>
              <Skeleton height="36px" className="w-16 mb-2" />
              <Skeleton height="14px" className="w-20" />
            </div>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <Skeleton height="24px" className="w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton height="40px" className="w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton height="16px" className="w-3/4 mb-1" />
                    <Skeleton height="14px" className="w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <Skeleton height="24px" className="w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i}>
                  <Skeleton height="16px" className="w-full mb-2" />
                  <Skeleton height="14px" className="w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load dashboard data</p>
          <p className="text-sm text-gray-500 mt-2">
            Please ensure the backend is running and you have proper permissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-fantasy">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.displayName}! Here's an overview of your site.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{stats?.users.total || 0}</h3>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-xs text-green-600">{stats?.users.active || 0} active</p>
            </div>
          </div>
        </div>

        {/* Total News */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{stats?.news.total || 0}</h3>
              <p className="text-sm text-gray-500">News Articles</p>
              <p className="text-xs text-green-600">{stats?.news.published || 0} published</p>
            </div>
          </div>
        </div>

        {/* Admins */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{stats?.users.admins || 0}</h3>
              <p className="text-sm text-gray-500">Administrators</p>
              <p className="text-xs text-purple-600">{stats?.users.moderators || 0} moderators</p>
            </div>
          </div>
        </div>

        {/* Draft Articles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{stats?.news.drafts || 0}</h3>
              <p className="text-sm text-gray-500">Draft Articles</p>
              <p className="text-xs text-orange-600">Need review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        
        {/* Sync Message */}
        {syncMessage && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">{syncMessage}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link
            to="/admin/menu"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-8 w-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2h10a2 2 0 012 2v7z" />
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">Admin Menu</h3>
              <p className="text-sm text-gray-500">Comprehensive data management</p>
            </div>
          </Link>

          <Link
            to="/admin/news/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-8 w-8 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">Create News Article</h3>
              <p className="text-sm text-gray-500">Write a new article</p>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-8 w-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500">User management</p>
            </div>
          </Link>

          <Link
            to="/admin/news"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">Manage Articles</h3>
              <p className="text-sm text-gray-500">Edit existing articles</p>
            </div>
          </Link>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-8 w-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">
                {isSyncing ? 'Syncing...' : 'Sync Thumbnails'}
              </h3>
              <p className="text-sm text-gray-500">
                {isSyncing ? 'Triggering sync...' : 'Manual thumbnail sync'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
          <div className="space-y-4">
            {stats?.recentActivity.users.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {user.firstName?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Articles</h2>
          <div className="space-y-4">
            {stats?.recentActivity.news.map((article) => (
              <div key={article.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    article.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {article.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {article.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    By {article.author} • {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;