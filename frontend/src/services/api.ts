import axios from 'axios';
import { 
  NewsArticle, 
  Faction, 
  Unit, 
  Hero, 
  GameInfo, 
  UnitFilters, 
  GameInfoCategory,
  MediaItem,
  MediaCategory,
  MediaFilters
} from '../types';

// Smart environment detection
const getApiBaseUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect based on current URL
  const currentHost = window.location.hostname;
  
  // If running on localhost, use local backend
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // If running on any production domain (not localhost), use production backend
  return 'https://oldenera-fansite.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log the API URL being used for debugging
console.log(`🌐 API Base URL: ${API_BASE_URL}`);

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

// Faction API
export interface FactionFilters {
  includeUnits?: boolean;
  includeHeroes?: boolean;
  includeSpells?: boolean;
  activeOnly?: boolean;
}

export const factionApi = {
  getAll: (filters: FactionFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.includeUnits) params.append('includeUnits', 'true');
    if (filters.includeHeroes) params.append('includeHeroes', 'true');
    if (filters.includeSpells) params.append('includeSpells', 'true');
    if (filters.activeOnly !== undefined) params.append('activeOnly', filters.activeOnly.toString());
    
    return api.get<Faction[]>(`/faction?${params.toString()}`);
  },
  getById: (id: number, filters: FactionFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.includeUnits) params.append('includeUnits', 'true');
    if (filters.includeHeroes) params.append('includeHeroes', 'true');
    if (filters.includeSpells) params.append('includeSpells', 'true');
    
    return api.get<Faction>(`/faction/${id}?${params.toString()}`);
  },
  getUnits: (id: number, tier?: number, unitType?: string) => {
    const params = new URLSearchParams();
    if (tier) params.append('tier', tier.toString());
    if (unitType) params.append('unitType', unitType);
    
    return api.get<Unit[]>(`/faction/${id}/units?${params.toString()}`);
  },
  getHeroes: (id: number, heroClass?: string, heroType?: string) => {
    const params = new URLSearchParams();
    if (heroClass) params.append('heroClass', heroClass);
    if (heroType) params.append('heroType', heroType);
    
    return api.get<Hero[]>(`/faction/${id}/heroes?${params.toString()}`);
  },
  create: (faction: Omit<Faction, 'id' | 'createdAt' | 'updatedAt' | 'units' | 'heroes' | 'factionSpells'>) =>
    api.post<Faction>('/faction', faction),
  update: (id: number, faction: Partial<Faction>) =>
    api.put(`/faction/${id}`, faction),
  delete: (id: number) => api.delete(`/faction/${id}`),
};

// Unit API
export interface UnitApiFilters {
  factionId?: number;
  tier?: number;
  unitType?: string;
  activeOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export const unitApi = {
  getAll: (filters: UnitApiFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.factionId) params.append('factionId', filters.factionId.toString());
    if (filters.tier) params.append('tier', filters.tier.toString());
    if (filters.unitType) params.append('unitType', filters.unitType);
    if (filters.activeOnly !== undefined) params.append('activeOnly', filters.activeOnly.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    return api.get<Unit[]>(`/unit?${params.toString()}`);
  },
  getById: (id: number, includeUpgrades = false) => {
    const params = new URLSearchParams();
    if (includeUpgrades) params.append('includeUpgrades', 'true');
    
    return api.get<Unit>(`/unit/${id}?${params.toString()}`);
  },
  getFilters: () => api.get<UnitFilters>('/unit/filters'),
  create: (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt' | 'faction' | 'baseUnit' | 'upgrades'>) =>
    api.post<Unit>('/unit', unit),
  update: (id: number, unit: Partial<Unit>) =>
    api.put(`/unit/${id}`, unit),
  delete: (id: number) => api.delete(`/unit/${id}`),
};

// Game Info API
export interface GameInfoFilters {
  category?: string;
  search?: string;
  featuredOnly?: boolean;
  publishedOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export const gameInfoApi = {
  getAll: (filters: GameInfoFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.featuredOnly) params.append('featuredOnly', 'true');
    if (filters.publishedOnly !== undefined) params.append('publishedOnly', filters.publishedOnly.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    return api.get<GameInfo[]>(`/gameinfo?${params.toString()}`);
  },
  getById: (id: number) => api.get<GameInfo>(`/gameinfo/${id}`),
  getBySlug: (slug: string) => api.get<GameInfo>(`/gameinfo/slug/${slug}`),
  getCategories: () => api.get<GameInfoCategory[]>('/gameinfo/categories'),
  getFeatured: (limit = 6) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    
    return api.get<GameInfo[]>(`/gameinfo/featured?${params.toString()}`);
  },
  getRelated: (id: number, limit = 5) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    
    return api.get<GameInfo[]>(`/gameinfo/${id}/related?${params.toString()}`);
  },
  create: (gameInfo: Omit<GameInfo, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<GameInfo>('/gameinfo', gameInfo),
  update: (id: number, gameInfo: Partial<GameInfo>) =>
    api.put(`/gameinfo/${id}`, gameInfo),
  delete: (id: number) => api.delete(`/gameinfo/${id}`),
};

// Hero API (basic endpoints)
export const heroApi = {
  getByFaction: (factionId: number, heroClass?: string, heroType?: string) => {
    const params = new URLSearchParams();
    if (heroClass) params.append('heroClass', heroClass);
    if (heroType) params.append('heroType', heroType);
    
    return api.get<Hero[]>(`/faction/${factionId}/heroes?${params.toString()}`);
  },
};

// Spell API (basic endpoints for future expansion)
export const spellApi = {
  // Future implementation for spell management
};

// Media API
export interface MediaFiltersParams {
  categoryId?: number;
  mediaType?: string;
  factionId?: number;
  featuredOnly?: boolean;
  approvedOnly?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const mediaApi = {
  // Media Categories
  getCategories: (activeOnly = true) => 
    api.get<MediaCategory[]>(`/media/categories?activeOnly=${activeOnly}`),
  
  getCategory: (id: number) => 
    api.get<MediaCategory>(`/media/categories/${id}`),
  
  createCategory: (category: Partial<MediaCategory>) => 
    api.post<MediaCategory>('/media/categories', category),
  
  updateCategory: (id: number, category: Partial<MediaCategory>) => 
    api.put(`/media/categories/${id}`, category),
  
  deleteCategory: (id: number) => 
    api.delete(`/media/categories/${id}`),

  // Media Items
  getMediaItems: (filters: MediaFiltersParams = {}) => {
    const params = new URLSearchParams();
    
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters.mediaType) params.append('mediaType', filters.mediaType);
    if (filters.factionId) params.append('factionId', filters.factionId.toString());
    if (filters.featuredOnly) params.append('featuredOnly', 'true');
    if (filters.approvedOnly !== undefined) params.append('approvedOnly', filters.approvedOnly.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    return api.get<MediaItem[]>(`/media?${params.toString()}`);
  },
  
  getMediaItem: (id: number) => 
    api.get<MediaItem>(`/media/${id}`),
  
  createMediaItem: (item: Partial<MediaItem>) => 
    api.post<MediaItem>('/media', item),
  
  updateMediaItem: (id: number, item: Partial<MediaItem>) => 
    api.put(`/media/${id}`, item),
  
  deleteMediaItem: (id: number) => 
    api.delete(`/media/${id}`),

  // Media Filters
  getFilters: () => 
    api.get<MediaFilters>('/media/filters'),
};

// SWR fetcher function
export const fetcher = (url: string) => api.get(url).then(res => res.data);

export default api;