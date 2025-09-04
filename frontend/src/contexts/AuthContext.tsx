import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, UpdateProfileRequest } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  profilePictureUrl?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isModerator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    
    if (savedToken && savedUser) {
      try {
        const userInfo = JSON.parse(savedUser) as User;
        setToken(savedToken);
        setUser(userInfo);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (authToken: string, userInfo: User) => {
    setToken(authToken);
    setUser(userInfo);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authUser', JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      const response = await authAPI.updateProfile(data);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  const isAdmin = hasRole('Admin');
  const isModerator = hasRole('Moderator') || isAdmin;
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      updateProfile,
      isLoading,
      isAuthenticated,
      hasRole,
      isAdmin,
      isModerator
    }}>
      {children}
    </AuthContext.Provider>
  );
};