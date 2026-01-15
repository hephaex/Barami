import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { newsApi } from '@/api/client';
import NewsCard from '@/components/NewsCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import type { NewsFilters } from '@/types';

const NewsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<NewsFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    start_date: searchParams.get('start_date') || '',
    end_date: searchParams.get('end_date') || '',
    page: parseInt(searchParams.get('page') || '1'),
    size: 20,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: newsApi.getCategories,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['news', filters],
    queryFn: () => newsApi.getNews(filters),
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.start_date) params.set('start_date', filters.start_date);
    if (filters.end_date) params.set('end_date', filters.end_date);
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query, page: 1 }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  };

  const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      start_date: '',
      end_date: '',
      page: 1,
      size: 20,
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.start_date || filters.end_date;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">News</h1>
        <p className="mt-1 text-sm text-gray-500">Browse and search all collected news articles</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by title or content..."
            initialValue={filters.search}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleDateChange('start_date', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleDateChange('end_date', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {data?.total || 0} results found
              </p>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error.message} onRetry={refetch} />
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.items.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {data.pages > 1 && (
            <Pagination
              currentPage={data.page}
              totalPages={data.pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default NewsList;
