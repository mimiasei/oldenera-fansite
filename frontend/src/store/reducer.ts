import { AppState, AppAction } from './types';

export const initialState: AppState = {
  // User authentication
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // News management
  news: {
    articles: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  },

  // UI state
  ui: {
    sidebarOpen: false,
    theme: 'light',
    notifications: [],
  },

  // Forum/Comments (future)
  forum: {
    topics: [],
    loading: false,
    error: null,
  },
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Authentication cases
    case 'AUTH_LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };

    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'AUTH_LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        ui: {
          ...state.ui,
          notifications: [
            ...state.ui.notifications,
            {
              id: Date.now().toString(),
              type: 'error',
              message: action.payload,
              duration: 5000,
            },
          ],
        },
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    // News cases
    case 'NEWS_FETCH_START':
      return {
        ...state,
        news: {
          ...state.news,
          loading: true,
          error: null,
        },
      };

    case 'NEWS_FETCH_SUCCESS':
      return {
        ...state,
        news: {
          ...state.news,
          articles: action.payload.articles,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
          loading: false,
          error: null,
        },
      };

    case 'NEWS_FETCH_FAILURE':
      return {
        ...state,
        news: {
          ...state.news,
          loading: false,
          error: action.payload,
        },
      };

    case 'NEWS_ADD_ARTICLE':
      return {
        ...state,
        news: {
          ...state.news,
          articles: [action.payload, ...state.news.articles],
        },
      };

    case 'NEWS_UPDATE_ARTICLE':
      return {
        ...state,
        news: {
          ...state.news,
          articles: state.news.articles.map(article =>
            article.id === action.payload.id ? action.payload : article
          ),
        },
      };

    case 'NEWS_DELETE_ARTICLE':
      return {
        ...state,
        news: {
          ...state.news,
          articles: state.news.articles.filter(article => article.id !== action.payload),
        },
      };

    // UI cases
    case 'UI_TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };

    case 'UI_SET_THEME':
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload,
        },
      };

    case 'UI_ADD_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, action.payload],
        },
      };

    case 'UI_REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(
            notification => notification.id !== action.payload
          ),
        },
      };

    // Forum cases (future)
    case 'FORUM_FETCH_START':
      return {
        ...state,
        forum: {
          ...state.forum,
          loading: true,
          error: null,
        },
      };

    case 'FORUM_FETCH_SUCCESS':
      return {
        ...state,
        forum: {
          ...state.forum,
          topics: action.payload,
          loading: false,
          error: null,
        },
      };

    case 'FORUM_FETCH_FAILURE':
      return {
        ...state,
        forum: {
          ...state.forum,
          loading: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
};