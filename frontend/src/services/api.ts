import axios from 'axios';
import { NewsArticle } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface NewsFilters {
  search?: string;
  tag?: string;
  author?: string;
  page?: number;
  pageSize?: number;
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const newsApi = {
  getAll: (filters: NewsFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.author) params.append('author', filters.author);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    return api.get<NewsArticle[]>(`/news?${params.toString()}`);
  },
  getFilters: () => api.get<{ tags: string[], authors: string[] }>('/news/filters'),
  getById: (id: number) => api.get<NewsArticle>(`/news/${id}`),
  create: (article: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<NewsArticle>('/news', article),
  update: (id: number, article: Partial<NewsArticle>) => 
    api.put(`/news/${id}`, article),
  delete: (id: number) => api.delete(`/news/${id}`),
};

// Authentication interfaces
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  profilePictureUrl?: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}

// Authentication API
export const authAPI = {
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  getCurrentUser: () => api.get<User>('/auth/me'),
  updateProfile: (data: UpdateProfileRequest) => api.put<User>('/auth/profile', data),
  refreshToken: () => api.post<{ token: string }>('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

// SWR fetcher function
export const fetcher = (url: string) => api.get(url).then(res => res.data);

export default api;