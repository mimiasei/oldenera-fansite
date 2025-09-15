import useSWR from 'swr';
import {
  newsApi,
  NewsFilters,
  factionApi,
  FactionFilters,
  unitApi,
  UnitApiFilters,
  gameInfoApi,
  GameInfoFilters,
  mediaApi,
  MediaFiltersParams,
  adminApi
} from '../services/api';
import { 
  NewsArticle, 
  Faction, 
  Unit, 
  GameInfo, 
  Hero, 
  UnitFilters, 
  GameInfoCategory,
  MediaItem,
  MediaCategory,
  MediaFilters
} from '../types';

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

  // Faction fetchers
  getAllFactions: async (filters: FactionFilters = {}): Promise<Faction[]> => {
    const response = await factionApi.getAll(filters);
    return response.data;
  },
  
  getFactionById: async (id: number, filters: FactionFilters = {}): Promise<Faction> => {
    const response = await factionApi.getById(id, filters);
    return response.data;
  },
  
  getFactionUnits: async (factionId: number, tier?: number, unitType?: string): Promise<Unit[]> => {
    const response = await factionApi.getUnits(factionId, tier, unitType);
    return response.data;
  },
  
  getFactionHeroes: async (factionId: number, heroClass?: string, heroType?: string): Promise<Hero[]> => {
    const response = await factionApi.getHeroes(factionId, heroClass, heroType);
    return response.data;
  },

  // Unit fetchers
  getAllUnits: async (filters: UnitApiFilters = {}): Promise<Unit[]> => {
    const response = await unitApi.getAll(filters);
    return response.data;
  },
  
  getUnitById: async (id: number, includeUpgrades = false): Promise<Unit> => {
    const response = await unitApi.getById(id, includeUpgrades);
    return response.data;
  },
  
  getUnitFilters: async (): Promise<UnitFilters> => {
    const response = await unitApi.getFilters();
    return response.data;
  },

  // Game Info fetchers
  getAllGameInfo: async (filters: GameInfoFilters = {}): Promise<GameInfo[]> => {
    const response = await gameInfoApi.getAll(filters);
    return response.data;
  },
  
  getGameInfoById: async (id: number): Promise<GameInfo> => {
    const response = await gameInfoApi.getById(id);
    return response.data;
  },
  
  getGameInfoBySlug: async (slug: string): Promise<GameInfo> => {
    const response = await gameInfoApi.getBySlug(slug);
    return response.data;
  },
  
  getGameInfoCategories: async (): Promise<GameInfoCategory[]> => {
    const response = await gameInfoApi.getCategories();
    return response.data;
  },
  
  getFeaturedGameInfo: async (limit = 6): Promise<GameInfo[]> => {
    const response = await gameInfoApi.getFeatured(limit);
    return response.data;
  },

  // Media fetchers
  getMediaCategories: async (activeOnly = true): Promise<MediaCategory[]> => {
    const response = await mediaApi.getCategories(activeOnly);
    return response.data;
  },

  getMediaItems: async (filters: MediaFiltersParams = {}): Promise<MediaItem[]> => {
    const response = await mediaApi.getMediaItems(filters);
    return response.data;
  },

  getMediaItem: async (id: number): Promise<MediaItem> => {
    const response = await mediaApi.getMediaItem(id);
    return response.data;
  },

  getMediaFilters: async (): Promise<MediaFilters> => {
    const response = await mediaApi.getFilters();
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

// ============== GAME CONTENT HOOKS ==============

// Faction hooks
export const useFactions = (filters: FactionFilters = {}) => {
  const filtersKey = JSON.stringify(filters);
  const { data, error, isLoading, mutate } = useSWR(
    ['/factions', filtersKey], 
    () => fetchers.getAllFactions(filters), 
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute - faction data doesn't change often
    }
  );

  return {
    factions: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useFaction = (id: number, filters: FactionFilters = {}) => {
  const filtersKey = JSON.stringify(filters);
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['/faction', id, filtersKey] : null,
    () => fetchers.getFactionById(id, filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    faction: data,
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useFactionUnits = (factionId: number, tier?: number, unitType?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    factionId ? ['/faction-units', factionId, tier, unitType] : null,
    () => fetchers.getFactionUnits(factionId, tier, unitType),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  );

  return {
    units: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useFactionHeroes = (factionId: number, heroClass?: string, heroType?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    factionId ? ['/faction-heroes', factionId, heroClass, heroType] : null,
    () => fetchers.getFactionHeroes(factionId, heroClass, heroType),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  );

  return {
    heroes: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

// Unit hooks
export const useUnits = (filters: UnitApiFilters = {}) => {
  const filtersKey = JSON.stringify(filters);
  const { data, error, isLoading, mutate } = useSWR(
    ['/units', filtersKey], 
    () => fetchers.getAllUnits(filters), 
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    }
  );

  return {
    units: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useUnit = (id: number, includeUpgrades = false) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['/unit', id, includeUpgrades] : null,
    () => fetchers.getUnitById(id, includeUpgrades),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    unit: data,
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useUnitFilters = () => {
  const { data, error, isLoading } = useSWR('/unit-filters', fetchers.getUnitFilters, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 300000, // 5 minutes - filters don't change often
  });

  return {
    filters: data || { unitTypes: [], tiers: [], factions: [] },
    isLoading,
    isError: !!error,
    error,
  };
};

// Game Info hooks
export const useGameInfo = (filters: GameInfoFilters = {}) => {
  const filtersKey = JSON.stringify(filters);
  const { data, error, isLoading, mutate } = useSWR(
    ['/gameinfo', filtersKey], 
    () => fetchers.getAllGameInfo(filters), 
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  );

  return {
    gameInfo: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useGameInfoById = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/gameinfo/${id}` : null,
    () => fetchers.getGameInfoById(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    gameInfo: data,
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useGameInfoBySlug = (slug: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/gameinfo/slug/${slug}` : null,
    () => fetchers.getGameInfoBySlug(slug),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    gameInfo: data,
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useGameInfoCategories = () => {
  const { data, error, isLoading } = useSWR('/gameinfo-categories', fetchers.getGameInfoCategories, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    categories: data || [],
    isLoading,
    isError: !!error,
    error,
  };
};

export const useFeaturedGameInfo = (limit = 6) => {
  const { data, error, isLoading, mutate } = useSWR(
    ['/featured-gameinfo', limit], 
    () => fetchers.getFeaturedGameInfo(limit), 
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 120000, // 2 minutes
    }
  );

  return {
    featuredGameInfo: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

// Media SWR hooks
export const useMediaCategories = (activeOnly = true) => {
  const { data, error, isLoading, mutate } = useSWR(
    ['/media-categories', activeOnly],
    () => fetchers.getMediaCategories(activeOnly),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 120000, // 2 minutes - categories don't change often
    }
  );

  return {
    categories: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useMediaItems = (filters: MediaFiltersParams = {}) => {
  const filtersKey = JSON.stringify(filters);
  const { data, error, isLoading, mutate } = useSWR(
    ['/media-items', filtersKey],
    () => fetchers.getMediaItems(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    mediaItems: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useMediaItem = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['/media-item', id] : null,
    () => fetchers.getMediaItem(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  );

  return {
    mediaItem: data || null,
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useMediaFilters = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/media-filters',
    fetchers.getMediaFilters,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes - filter options change rarely
    }
  );

  return {
    filters: data || { categories: [], mediaTypes: [], factions: [] },
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useFeaturedMedia = (limit = 8) => {
  const { data, error, isLoading, mutate } = useSWR(
    ['/featured-media', limit],
    () => fetchers.getMediaItems({ featuredOnly: true, pageSize: limit }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 120000, // 2 minutes
    }
  );

  return {
    featuredMedia: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
};

export const useUsers = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/admin/users',
    () => adminApi.getUsers(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    users: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};