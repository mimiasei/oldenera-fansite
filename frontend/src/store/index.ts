export { AppProvider, useAppContext, useAuth, useNews, useUI } from './AppContext';
export type { AppState, AppAction, User, Notification } from './types';
export { initialState, appReducer } from './reducer';