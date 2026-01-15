import { useQuery } from '@tanstack/react-query';
import { newsApi } from '@/api/client';
import StatsCard from '@/components/StatsCard';
import DailyChart from '@/components/DailyChart';
import NewsCard from '@/components/NewsCard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

const Home = () => {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['stats'],
    queryFn: newsApi.getStats,
  });

  const { data: dailyStats, isLoading: dailyLoading, error: dailyError } = useQuery({
    queryKey: ['dailyStats'],
    queryFn: () => newsApi.getDailyStats(30),
  });

  const { data: recentNews, isLoading: newsLoading, error: newsError } = useQuery({
    queryKey: ['recentNews'],
    queryFn: () => newsApi.getRecentNews(10),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: newsApi.getCategories,
  });

  if (statsLoading || dailyLoading || newsLoading) {
    return <Loading />;
  }

  if (statsError || dailyError || newsError) {
    return (
      <ErrorMessage
        message={(statsError || dailyError || newsError)?.message || 'Failed to load data'}
        onRetry={refetchStats}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of news collection and analysis</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Articles"
          value={stats?.total_crawled_today || 0}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatsCard
          title="Total Articles"
          value={stats?.total_articles.toLocaleString() || '0'}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          }
        />
        <StatsCard
          title="Success Rate"
          value={`${(stats?.success_rate || 0).toFixed(1)}%`}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatsCard
          title="Categories"
          value={categories?.total || 0}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Collection Trends</h2>
          <p className="text-sm text-gray-500 mt-1">Daily news collection over the last 30 days</p>
        </div>
        <div className="h-80">
          {dailyStats?.stats && dailyStats.stats.length > 0 ? (
            <DailyChart data={dailyStats.stats} type="area" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No data available for the selected period
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent News</h2>
          <a
            href="/news"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {recentNews && recentNews.length > 0 ? (
            recentNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500 py-8">
              No recent news available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
