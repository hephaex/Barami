import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { NewsArticle } from '@/types';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      politics: 'bg-red-100 text-red-800',
      economy: 'bg-blue-100 text-blue-800',
      society: 'bg-green-100 text-green-800',
      technology: 'bg-purple-100 text-purple-800',
      culture: 'bg-pink-100 text-pink-800',
      international: 'bg-yellow-100 text-yellow-800',
      sports: 'bg-orange-100 text-orange-800',
    };
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Link
      to={`/news/${article.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
            article.category
          )}`}
        >
          {article.category}
        </span>
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
        {article.title}
      </h3>

      {article.summary && (
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {article.summary}
        </p>
      )}

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {article.source && (
        <div className="flex items-center text-xs text-gray-500">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          {article.source}
        </div>
      )}
    </Link>
  );
};

export default NewsCard;
