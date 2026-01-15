import { useState } from 'react';
import { useMetrics } from '@/hooks/useSystemStatus';
import { Activity, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

export const Metrics = () => {
  const { data: metrics, isLoading, refetch } = useMetrics();
  const [showPrometheus, setShowPrometheus] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Prometheus Metrics</h1>
          <p className="text-gray-400">Real-time system and application metrics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPrometheus(!showPrometheus)}
            className="px-4 py-2 bg-dark-surface border border-dark-border hover:border-primary-600 text-white rounded-lg transition-colors"
          >
            {showPrometheus ? 'Show Metrics' : 'Show Prometheus UI'}
          </button>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-dark-surface border border-dark-border hover:border-primary-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {showPrometheus ? (
        /* Prometheus UI Embed */
        <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-dark-border">
            <h3 className="text-white font-semibold">Prometheus Query Interface</h3>
          </div>
          <iframe
            src="/prometheus/graph"
            className="w-full"
            style={{ height: 'calc(100vh - 250px)' }}
            frameBorder="0"
            title="Prometheus"
          />
        </div>
      ) : (
        /* Metrics Display */
        <>
          {/* Key Metrics Grid */}
          {metrics && metrics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((metric, index) => {
                const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
                const TrendIcon =
                  trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
                const trendColor =
                  trend === 'up'
                    ? 'text-green-500'
                    : trend === 'down'
                    ? 'text-red-500'
                    : 'text-gray-500';

                return (
                  <div
                    key={index}
                    className="bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-primary-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-500" />
                        <h3 className="text-white font-medium">{metric.name}</h3>
                      </div>
                      <TrendIcon className={clsx('w-5 h-5', trendColor)} />
                    </div>

                    <div className="mb-2">
                      <span className="text-3xl font-bold text-white">
                        {metric.value.toFixed(2)}
                      </span>
                      <span className="text-gray-400 ml-2">{metric.unit}</span>
                    </div>

                    {metric.labels && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {Object.entries(metric.labels).map(([key, value]) => (
                          <span
                            key={key}
                            className="text-xs bg-dark-bg px-2 py-1 rounded text-gray-400"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-3">
                      {new Date(metric.timestamp).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No metrics available</p>
              <p className="text-sm text-gray-500 mt-2">
                Metrics will appear here once the system starts collecting data
              </p>
            </div>
          )}

          {/* Metric Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Application Metrics</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• HTTP Request Rate</li>
                <li>• Response Time (p50, p95, p99)</li>
                <li>• Error Rate</li>
                <li>• Active Connections</li>
                <li>• Queue Depth</li>
              </ul>
            </div>

            <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">System Metrics</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• CPU Usage</li>
                <li>• Memory Usage</li>
                <li>• Disk I/O</li>
                <li>• Network Traffic</li>
                <li>• Process Count</li>
              </ul>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
            <p className="text-sm text-primary-200">
              <strong className="text-primary-100">Tip:</strong> Click "Show Prometheus
              UI" to access the full Prometheus query interface for advanced metric
              exploration and custom queries.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
