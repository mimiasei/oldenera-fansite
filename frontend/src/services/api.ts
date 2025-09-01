import axios from 'axios';
import { NewsArticle } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const newsApi = {
  getAll: () => api.get<NewsArticle[]>('/news'),
  getById: (id: number) => api.get<NewsArticle>(`/news/${id}`),
  create: (article: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<NewsArticle>('/news', article),
  update: (id: number, article: Partial<NewsArticle>) => 
    api.put(`/news/${id}`, article),
  delete: (id: number) => api.delete(`/news/${id}`),
};

export default api;