import { NewsArticle } from '../types';

export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface AppState {
  // User authentication
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // News management
  news: {
    articles: NewsArticle[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
  };

  // UI state
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    notifications: Notification[];
  };

  // Forum/Comments (future)
  forum: {
    topics: any[];
    loading: boolean;
    error: string | null;
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export type AppAction =
  // Authentication actions
  | { type: 'AUTH_LOGIN_START' }
  | { type: 'AUTH_LOGIN_SUCCESS'; payload: User }
  | { type: 'AUTH_LOGIN_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  
  // News actions
  | { type: 'NEWS_FETCH_START' }
  | { type: 'NEWS_FETCH_SUCCESS'; payload: { articles: NewsArticle[]; totalPages: number; currentPage: number } }
  | { type: 'NEWS_FETCH_FAILURE'; payload: string }
  | { type: 'NEWS_ADD_ARTICLE'; payload: NewsArticle }
  | { type: 'NEWS_UPDATE_ARTICLE'; payload: NewsArticle }
  | { type: 'NEWS_DELETE_ARTICLE'; payload: number }
  
  // UI actions
  | { type: 'UI_TOGGLE_SIDEBAR' }
  | { type: 'UI_SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'UI_ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UI_REMOVE_NOTIFICATION'; payload: string }
  
  // Forum actions (future)
  | { type: 'FORUM_FETCH_START' }
  | { type: 'FORUM_FETCH_SUCCESS'; payload: any[] }
  | { type: 'FORUM_FETCH_FAILURE'; payload: string };