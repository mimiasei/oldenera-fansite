import useSWR from 'swr';
import { newsApi } from '../services/api';
import { NewsArticle } from '../types';

// Fetcher functions for SWR
const fetchers = {
  getAllNews: async (): Promise<NewsArticle[]> => {
    const response = await newsApi.getAll();
    return response.data;
  },
  
  getNewsById: async (id: number): Promise<NewsArticle> => {
    const response = await newsApi.getById(id);
    return response.data;
  },
};

// Custom hooks using SWR
export const useNews = () => {
  const { data, error, isLoading, mutate } = useSWR('/news', fetchers.getAllNews, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 seconds
  });

  return {
    news: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
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