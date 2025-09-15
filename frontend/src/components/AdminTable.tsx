import React, { useState, useRef, useEffect } from 'react';

export interface AdminTableColumn<T> {
  key: keyof T;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'color' | 'checkbox' | 'date' | 'readonly';
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  width?: string;
  render?: (value: any, item: T) => React.ReactNode;
  readonly?: boolean; // Helper flag for cleaner type checking
}

export interface AdminTableProps<T> {
  data: T[];
  columns: AdminTableColumn<T>[];
  onUpdate: (id: string | number, field: keyof T, value: any) => void;
  onDelete?: (id: string | number) => Promise<void>;
  onAdd?: () => void;
  onSave?: () => Promise<void>;
  onRevert?: () => void;
  idField?: keyof T;
  title: string;
  description?: string;
  isLoading?: boolean;
  hasChanges?: boolean;
  addButtonText?: string;
  emptyStateText?: string;
}

interface EditingCell {
  id: string | number;
  field: string;
}

export default function AdminTable<T extends Record<string, any>>({
  data,
  columns,
  onUpdate,
  onDelete,
  onAdd,
  idField = 'id' as keyof T,
  title,
  description,
  isLoading = false,
  hasChanges = false,
  onSave,
  onRevert,
  addButtonText = 'Add New Item',
  emptyStateText = 'No items found'
}: AdminTableProps<T>) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  const startEdit = (id: string | number, field: keyof T, currentValue: any) => {
    setEditingCell({ id, field: String(field) });
    setEditValue(currentValue ?? '');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveEdit = () => {
    if (!editingCell) return;

    onUpdate(editingCell.id, editingCell.field as keyof T, editValue);
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      saveEdit();
      // Tab navigation could be implemented here in the future
    }
  };

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const renderCell = (item: T, column: AdminTableColumn<T>) => {
    const id = item[idField];
    const value = item[column.key];
    const isEditing = editingCell?.id === id && editingCell?.field === String(column.key);

    if (column.render && !isEditing) {
      return column.render(value, item);
    }

    // Handle readonly columns
    if (column.type === 'readonly') {
      return (
        <span className="text-gray-400 italic">
          {value !== null && value !== undefined ? String(value) : '-'}
        </span>
      );
    }

    if (isEditing) {
      return (
        <div className="min-w-0">
          {column.type === 'textarea' ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={saveEdit}
              className="w-full px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary-500 focus:outline-none resize-none"
              rows={2}
              maxLength={column.maxLength}
              placeholder={column.placeholder}
            />
          ) : column.type === 'select' ? (
            <select
              ref={inputRef as React.RefObject<HTMLSelectElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={saveEdit}
              className="w-full px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary-500 focus:outline-none"
            >
              {column.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : column.type === 'color' ? (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="color"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              className="w-full h-8 bg-gray-700 rounded border border-gray-600 focus:border-primary-500 focus:outline-none"
            />
          ) : column.type === 'checkbox' ? (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="checkbox"
              checked={editValue}
              onChange={(e) => setEditValue(e.target.checked)}
              onBlur={saveEdit}
              className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(column.type === 'number' ? Number(e.target.value) : e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={saveEdit}
              className="w-full px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary-500 focus:outline-none"
              placeholder={column.placeholder}
              maxLength={column.maxLength}
              min={column.min}
              max={column.max}
            />
          )}
        </div>
      );
    }

    const displayValue = () => {
      if (value === null || value === undefined) return '-';
      if (column.type === 'checkbox') return value ? '✓' : '✗';
      if (column.type === 'color') return (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded border border-gray-600"
            style={{ backgroundColor: value }}
          ></div>
          <span>{value}</span>
        </div>
      );
      if (column.type === 'date' && value) {
        return new Date(value).toLocaleDateString();
      }
      return String(value);
    };

    return (
      <button
        onClick={() => startEdit(id, column.key, value)}
        className="text-left w-full p-1 rounded hover:bg-gray-700/50 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <span className="break-words">
            {displayValue()}
          </span>
          <svg
            className="h-3 w-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white/90 rounded-lg">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">{title}</h2>
            {description && (
              <p className="text-gray-400 mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && onSave && onRevert && (
              <>
                <button
                  onClick={onRevert}
                  className="btn btn-secondary"
                >
                  Revert Changes
                </button>
                <button
                  onClick={onSave}
                  className="btn btn-primary"
                >
                  Save All Changes
                </button>
              </>
            )}
            {onAdd && (
              <button
                onClick={onAdd}
                className="btn btn-primary"
                disabled={isLoading}
              >
                <div className="flex">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {addButtonText}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-400">Loading...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0116 7.414V9" />
            </svg>
            <p>{emptyStateText}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 font-medium">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="text-left px-4 py-2"
                    style={{ width: column.width }}
                  >
                    {column.label}
                    {column.required && <span className="text-red-400 ml-1">*</span>}
                  </th>
                ))}
                {onDelete && (
                  <th className="text-right p-4 w-16">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={String(item[idField])}
                  className="border-b border-gray-700/50 hover:bg-gray-700/25 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="p-4 align-top"
                      style={{ width: column.width }}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {onDelete && (
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onDelete(item[idField])}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                        title="Delete"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        <div className="flex items-center justify-between">
          <div>
            Showing {data.length} item{data.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-4">
            <span>Click any cell to edit • Tab to move • Enter to save • ESC to cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
}