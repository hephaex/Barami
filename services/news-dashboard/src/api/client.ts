import axios from 'axios';
import type {
  NewsArticle,
  PaginatedResponse,
  Stats,
  DailyStats,
  Category,
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
    const { data } = await api.get('/news/stats');
    return data;
  },

  getDailyStats: async (days: number = 30): Promise<DailyStats[]> => {
    const { data } = await api.get('/news/stats/daily', {
      params: { days },
    });
    return data;
  },

  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get('/news/categories');
    return data;
  },

  getNews: async (filters: NewsFilters = {}): Promise<PaginatedResponse<NewsArticle>> => {
    const { data } = await api.get('/news', {
      params: {
        search: filters.search,
        category: filters.category,
        start_date: filters.start_date,
        end_date: filters.end_date,
        page: filters.page || 1,
        size: filters.size || 20,
      },
    });
    return data;
  },

  getNewsById: async (id: string): Promise<NewsArticle> => {
    const { data } = await api.get(`/news/${id}`);
    return data;
  },

  getRecentNews: async (limit: number = 10): Promise<NewsArticle[]> => {
    const { data } = await api.get('/news/recent', {
      params: { limit },
    });
    return data;
  },
};

export default api;
