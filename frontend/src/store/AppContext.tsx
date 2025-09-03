import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, AppAction, User } from './types';
import { appReducer, initialState } from './reducer';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Action creators for common operations
  actions: {
    // Auth actions
    login: (user: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    
    // News actions
    fetchNews: () => void;
    setNewsData: (articles: any[], totalPages: number, currentPage: number) => void;
    setNewsError: (error: string) => void;
    addNewsArticle: (article: any) => void;
    
    // UI actions
    toggleSidebar: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    addNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
    removeNotification: (id: string) => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted state from localStorage on app start
  useEffect(() => {
    const savedTheme = localStorage.getItem('olden-wiki-theme') as 'light' | 'dark';
    const savedUser = localStorage.getItem('olden-wiki-user');
    
    if (savedTheme) {
      dispatch({ type: 'UI_SET_THEME', payload: savedTheme });
    }
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('olden-wiki-user');
      }
    }
  }, []);

  // Persist theme changes
  useEffect(() => {
    localStorage.setItem('olden-wiki-theme', state.ui.theme);
  }, [state.ui.theme]);

  // Persist user authentication
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('olden-wiki-user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('olden-wiki-user');
    }
  }, [state.user]);

  // Auto-remove notifications after their duration
  useEffect(() => {
    state.ui.notifications.forEach(notification => {
      if (notification.duration) {
        setTimeout(() => {
          dispatch({ type: 'UI_REMOVE_NOTIFICATION', payload: notification.id });
        }, notification.duration);
      }
    });
  }, [state.ui.notifications]);

  // Action creators
  const actions = {
    // Auth actions
    login: (user: User) => {
      dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: user });
    },
    
    logout: () => {
      dispatch({ type: 'AUTH_LOGOUT' });
    },
    
    setLoading: (loading: boolean) => {
      if (loading) {
        dispatch({ type: 'AUTH_LOGIN_START' });
      }
    },

    // News actions
    fetchNews: () => {
      dispatch({ type: 'NEWS_FETCH_START' });
    },
    
    setNewsData: (articles: any[], totalPages: number, currentPage: number) => {
      dispatch({ 
        type: 'NEWS_FETCH_SUCCESS', 
        payload: { articles, totalPages, currentPage } 
      });
    },
    
    setNewsError: (error: string) => {
      dispatch({ type: 'NEWS_FETCH_FAILURE', payload: error });
    },
    
    addNewsArticle: (article: any) => {
      dispatch({ type: 'NEWS_ADD_ARTICLE', payload: article });
    },

    // UI actions
    toggleSidebar: () => {
      dispatch({ type: 'UI_TOGGLE_SIDEBAR' });
    },
    
    setTheme: (theme: 'light' | 'dark') => {
      dispatch({ type: 'UI_SET_THEME', payload: theme });
    },
    
    addNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
      const notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        message,
        duration: type === 'error' ? 8000 : 5000,
      };
      dispatch({ type: 'UI_ADD_NOTIFICATION', payload: notification });
    },
    
    removeNotification: (id: string) => {
      dispatch({ type: 'UI_REMOVE_NOTIFICATION', payload: id });
    },
  };

  const value = {
    state,
    dispatch,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Custom hooks for specific parts of the state
export const useAuth = () => {
  const { state, actions } = useAppContext();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login: actions.login,
    logout: actions.logout,
    setLoading: actions.setLoading,
  };
};

export const useNews = () => {
  const { state, actions } = useAppContext();
  return {
    news: state.news,
    fetchNews: actions.fetchNews,
    setNewsData: actions.setNewsData,
    setNewsError: actions.setNewsError,
    addNewsArticle: actions.addNewsArticle,
  };
};

export const useUI = () => {
  const { state, actions } = useAppContext();
  return {
    ui: state.ui,
    toggleSidebar: actions.toggleSidebar,
    setTheme: actions.setTheme,
    addNotification: actions.addNotification,
    removeNotification: actions.removeNotification,
  };
};