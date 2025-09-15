import React, { useState } from 'react';
import { useMediaCategories } from '../../hooks/useSWR';
import AdminTable, { AdminTableColumn } from '../AdminTable';
import { MediaCategory } from '../../types';
import { updateMediaCategory, createMediaCategory, deleteMediaCategory } from '../../services/api';

const AdminMediaCategories: React.FC = () => {
  const { categories, isLoading, error, refetch: mutate } = useMediaCategories();
  const [hasChanges, setHasChanges] = useState(false);
  const [localCategories, setLocalCategories] = useState<MediaCategory[]>([]);

  React.useEffect(() => {
    if (categories) {
      setLocalCategories([...categories]);
    }
  }, [categories]);

  const columns: AdminTableColumn<MediaCategory>[] = [
    {
      key: 'id',
      label: 'ID',
      type: 'readonly',
      width: '80px'
    },
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Category name...',
      maxLength: 100,
      width: '200px'
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Describe this category...',
      maxLength: 500,
      width: '300px'
    },
    {
      key: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      placeholder: 'url-friendly-slug',
      maxLength: 50,
      width: '150px'
    },
    {
      key: 'color',
      label: 'Color',
      type: 'color',
      required: true,
      width: '120px'
    },
    {
      key: 'iconUrl',
      label: 'Icon URL',
      type: 'text',
      placeholder: '/images/icons/category.png',
      maxLength: 255,
      width: '200px'
    },
    {
      key: 'sortOrder',
      label: 'Sort Order',
      type: 'number',
      min: 0,
      max: 1000,
      width: '120px'
    },
    {
      key: 'isActive',
      label: 'Active',
      type: 'checkbox',
      width: '80px'
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

  const handleUpdate = (id: string | number, field: keyof MediaCategory, value: any) => {
    // Update local state only
    setLocalCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
    setHasChanges(true);
  };

  const handleAdd = () => {
    const newCategory = {
      id: -Date.now(), // Temporary negative ID
      name: 'New Category',
      description: '',
      slug: `new-category-${Date.now()}`,
      color: '#3B82F6',
      iconUrl: '',
      sortOrder: Math.max(...(localCategories || []).map(c => c.sortOrder || 0), 0) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as MediaCategory;

    setLocalCategories(prev => [newCategory, ...prev]);
    setHasChanges(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteMediaCategory(Number(id));
      await mutate();
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      // Save new categories
      for (const category of localCategories) {
        if (category.id < 0) {
          // New category - create it
          const { id, createdAt, updatedAt, ...createData } = category;
          await createMediaCategory(createData);
        } else {
          // Existing category - check if it was modified
          const original = categories?.find(c => c.id === category.id);
          if (original && JSON.stringify(original) !== JSON.stringify(category)) {
            await updateMediaCategory(Number(category.id), category);
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
    setLocalCategories(categories || []);
    setHasChanges(false);
  };

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
        <h3 className="text-red-400 font-semibold mb-2">Error Loading Categories</h3>
        <p className="text-red-300">
          {error.message || 'Failed to load media categories. Please check your connection and try again.'}
        </p>
      </div>
    );
  }

  return (
    <AdminTable
      data={localCategories}
      columns={columns}
      onUpdate={handleUpdate}
      onAdd={handleAdd}
      onDelete={handleDelete}
      idField="id"
      title="Media Categories"
      description=""
      isLoading={isLoading}
      hasChanges={hasChanges}
      onSave={handleSave}
      onRevert={handleRevert}
      addButtonText="Add New Category"
      emptyStateText="No media categories found. Create your first category to get started."
    />
  );
};

export default AdminMediaCategories;