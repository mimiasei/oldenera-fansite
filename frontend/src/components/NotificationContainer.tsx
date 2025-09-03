import React from 'react';
import { useUI } from '../store';

const NotificationContainer: React.FC = () => {
  const { ui, removeNotification } = useUI();

  if (ui.notifications.length === 0) {
    return null;
  }

  const getNotificationStyles = (type: string) => {
    const baseStyles = "p-4 mb-2 rounded-lg shadow-lg flex items-center justify-between transition-all duration-300 ease-in-out";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-black`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-500 text-white`;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-sm">
      {ui.notifications.map((notification) => (
        <div
          key={notification.id}
          className={getNotificationStyles(notification.type)}
        >
          <div className="flex items-center">
            <span className="mr-2 text-lg font-bold">
              {getIcon(notification.type)}
            </span>
            <span className="flex-1">{notification.message}</span>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-lg font-bold hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;