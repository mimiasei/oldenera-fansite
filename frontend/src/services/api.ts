import axios from 'axios';
import { NewsArticle } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;