export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
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
  success_count: number;
  failure_count: number;
}

export interface Stats {
  today_count: number;
  total_articles: number;
  success_rate: number;
  categories_count: number;
  recent_count: number;
}

export interface Category {
  name: string;
  count: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
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
