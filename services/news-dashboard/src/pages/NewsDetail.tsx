import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { newsApi } from '@/api/client';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: article, isLoading, error, refetch } = useQuery({
    queryKey: ['news', id],
    queryFn: () => newsApi.getNewsById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={refetch} />;
  }

  if (!article) {
    return <ErrorMessage message="Article not found" />;
  }

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
    <div className="animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                article.category
              )}`}
            >
              {article.category}
            </span>
            {article.sentiment && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Sentiment: {article.sentiment}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {format(new Date(article.published_at), 'PPpp')}
            </div>
            {article.source && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
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
          </div>

          {article.summary && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h2 className="text-sm font-semibold text-blue-900 mb-2">Summary</h2>
              <p className="text-sm text-blue-800">{article.summary}</p>
            </div>
          )}

          <div className="prose max-w-none mb-6">
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {article.content}
            </div>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {article.entities && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {article.entities.persons && article.entities.persons.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Persons</h3>
                  <div className="space-y-2">
                    {article.entities.persons.map((person, index) => (
                      <span
                        key={index}
                        className="block text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded"
                      >
                        {person}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {article.entities.organizations && article.entities.organizations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Organizations</h3>
                  <div className="space-y-2">
                    {article.entities.organizations.map((org, index) => (
                      <span
                        key={index}
                        className="block text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded"
                      >
                        {org}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {article.entities.locations && article.entities.locations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Locations</h3>
                  <div className="space-y-2">
                    {article.entities.locations.map((location, index) => (
                      <span
                        key={index}
                        className="block text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {article.url && (
            <div className="pt-6 border-t border-gray-200">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View original article
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;
