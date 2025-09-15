import React, { useState } from 'react';
import { useUsers } from '../../hooks/useSWR';
import AdminTable, { AdminTableColumn } from '../AdminTable';
import { User } from '../../types';
import { updateUser, deleteUser } from '../../services/api';

const AdminUsers: React.FC = () => {
  const { users, isLoading, error, mutate } = useUsers();
  const [hasChanges, setHasChanges] = useState(false);
  const [localUsers, setLocalUsers] = useState<User[]>([]);

  React.useEffect(() => {
    if (users) {
      setLocalUsers([...users]);
    }
  }, [users]);

  const roleOptions = [
    { value: 'User', label: 'User' },
    { value: 'Moderator', label: 'Moderator' },
    { value: 'Admin', label: 'Admin' }
  ];

  const columns: AdminTableColumn<User>[] = [
    {
      key: 'id',
      label: 'ID',
      type: 'readonly',
      width: '120px'
    },
    {
      key: 'userName',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'username...',
      maxLength: 50,
      width: '150px'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      required: true,
      placeholder: 'user@example.com',
      maxLength: 100,
      width: '200px'
    },
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'First name...',
      maxLength: 50,
      width: '120px'
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Last name...',
      maxLength: 50,
      width: '120px'
    },
    {
      key: 'roles',
      label: 'Roles',
      type: 'select',
      options: roleOptions,
      width: '120px',
      render: (value: string[]) => Array.isArray(value) ? value.join(', ') : '-'
    },
    {
      key: 'emailConfirmed',
      label: 'Email Verified',
      type: 'checkbox',
      width: '120px'
    },
    {
      key: 'profilePictureUrl',
      label: 'Profile Picture',
      type: 'text',
      placeholder: '/images/avatars/avatar.png',
      maxLength: 255,
      width: '200px',
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <img
            src={value}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-xs text-gray-400 truncate">{value}</span>
        </div>
      ) : '-'
    }
  ];

  const handleUpdate = (id: string | number, field: keyof User, value: any) => {
    // Handle roles conversion - for this simple case, we'll store as single role
    let processedValue = value;
    if (field === 'roles') {
      processedValue = [value]; // Convert single selection to array
    }

    // Update local state only
    setLocalUsers(prev => prev.map(user =>
      user.id === id ? { ...user, [field]: processedValue } : user
    ));
    setHasChanges(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone and will remove all their data.')) {
      return;
    }

    try {
      await deleteUser(String(id));
      await mutate();
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      // Save modified users (users don't typically have "add new" functionality)
      for (const user of localUsers) {
        const original = users?.find((u: User) => u.id === user.id);
        if (original && JSON.stringify(original) !== JSON.stringify(user)) {
          await updateUser(String(user.id), user);
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
    setLocalUsers(users || []);
    setHasChanges(false);
  };

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
        <h3 className="text-red-400 font-semibold mb-2">Error Loading Users</h3>
        <p className="text-red-300">
          {error.message || 'Failed to load users. Please check your connection and try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminTable
        data={localUsers}
        columns={columns}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onSave={handleSave}
        onRevert={handleRevert}
        idField="id"
        title="User Management"
        description="Manage user accounts, roles, and permissions. Be careful when modifying user roles or deleting accounts."
        isLoading={isLoading}
        hasChanges={hasChanges}
        emptyStateText="No users found in the system."
      />

      {/* User Statistics */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">User Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary-400">
              {localUsers.length}
            </div>
            <div className="text-sm text-gray-400">Total Users</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {localUsers.filter(u => u.roles.includes('Admin')).length}
            </div>
            <div className="text-sm text-gray-400">Admins</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {localUsers.filter(u => u.roles.includes('Moderator')).length}
            </div>
            <div className="text-sm text-gray-400">Moderators</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {localUsers.filter(u => u.emailConfirmed).length}
            </div>
            <div className="text-sm text-gray-400">Verified Emails</div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 className="text-amber-300 font-semibold mb-1">Security Notice</h4>
            <p className="text-amber-200 text-sm">
              Exercise caution when modifying user roles or deleting accounts. Admin and Moderator roles provide elevated access to the system.
              Always verify the identity of users before granting administrative privileges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;