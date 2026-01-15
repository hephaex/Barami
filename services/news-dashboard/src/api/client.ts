import axios from 'axios';
import type {
  NewsArticle,
  PaginatedResponse,
  Stats,
  DailyStatsResponse,
  CategoriesResponse,
  NewsFilters,
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const newsApi = {
  getStats: async (): Promise<Stats> => {
    const { data } = await api.get('/stats');
    return data;
  },

  getDailyStats: async (days: number = 30): Promise<DailyStatsResponse> => {
    const { data } = await api.get('/stats/daily', {
      params: { days },
    });
    return data;
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    const { data } = await api.get('/categories');
    return data;
  },

  getNews: async (filters: NewsFilters = {}): Promise<PaginatedResponse<NewsArticle>> => {
    const { data } = await api.get('/news', {
      params: {
        q: filters.search,
        category: filters.category,
        page: filters.page || 1,
        limit: filters.size || 20,
      },
    });
    return data;
  },

  getNewsById: async (id: string): Promise<NewsArticle> => {
    const { data } = await api.get(`/news/${id}`);
    return data;
  },

  getRecentNews: async (limit: number = 10): Promise<NewsArticle[]> => {
    const { data } = await api.get('/news', {
      params: { limit, page: 1 },
    });
    return data.articles || [];
  },
};

export default api;
