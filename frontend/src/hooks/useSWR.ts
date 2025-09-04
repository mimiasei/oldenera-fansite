import useSWR from 'swr';
import { newsApi, NewsFilters } from '../services/api';
import { NewsArticle } from '../types';

// Fetcher functions for SWR
const fetchers = {
  getAllNews: async (filters: NewsFilters = {}): Promise<NewsArticle[]> => {
    const response = await newsApi.getAll(filters);
    return response.data;
  },
  
  getFilters: async (): Promise<{ tags: string[], authors: string[] }> => {
    const response = await newsApi.getFilters();
    return response.data;
  },
  
  getNewsById: async (id: number): Promise<NewsArticle> => {
    const response = await newsApi.getById(id);
    return response.data;
  },
};

// Custom hooks using SWR
export const useNews = (filters: NewsFilters = {}) => {
  const filtersKey = JSON.stringify(filters);
  const { data, error, isLoading, mutate } = useSWR(
    ['/news', filtersKey], 
    () => fetchers.getAllNews(filters), 
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    news: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useNewsFilters = () => {
  const { data, error, isLoading } = useSWR('/news/filters', fetchers.getFilters, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 300000, // 5 minutes - filters don't change often
  });

  return {
    filters: data || { tags: [], authors: [] },
    isLoading,
    isError: !!error,
    error,
  };
};

export const useNewsArticle = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/news/${id}` : null,
    () => fetchers.getNewsById(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    article: data,
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

// Hook for latest news (first 3 articles)
export const useLatestNews = () => {
  const { news, isLoading, isError, error, refetch } = useNews();
  
  return {
    latestNews: news.slice(0, 3),
    isLoading,
    isError,
    error,
    refetch,
  };
};