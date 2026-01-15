export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  author?: string;
  source?: string;
  url?: string;
  published_at: string;
  crawled_at: string;
  summary?: string;
  tags?: string[];
  sentiment?: string;
  entities?: {
    persons?: string[];
    organizations?: string[];
    locations?: string[];
  };
}

export interface DailyStats {
  date: string;
  count: number;
}

export interface Stats {
  total_articles: number;
  total_crawled_today: number;
  success_rate: number;
  recent_stats: DailyStats[];
}

export interface Category {
  name: string;
  count: number;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export interface DailyStatsResponse {
  stats: DailyStats[];
  total_days: number;
}

export interface PaginatedResponse<T> {
  articles: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface NewsFilters {
  search?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  size?: number;
}

export interface ApiError {
  message: string;
  detail?: string;
}
