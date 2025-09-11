import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminEditButtonProps {
  to: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'minimal';
  className?: string;
}

const AdminEditButton: React.FC<AdminEditButtonProps> = ({ 
  to, 
  label = 'Edit',
  size = 'sm',
  variant = 'minimal',
  className = ''
}) => {
  const { isModerator } = useAuth();

  // Only show for moderators/admins
  if (!isModerator) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm', 
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
    minimal: 'bg-gray-800/80 hover:bg-gray-700 text-white backdrop-blur-sm border border-gray-600 hover:border-gray-500'
  };

  const baseClasses = 'inline-flex items-center rounded transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-transparent';

  return (
    <Link
      to={to}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title={`${label} (Admin)`}
    >
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      {label}
    </Link>
  );
};

export default AdminEditButton;