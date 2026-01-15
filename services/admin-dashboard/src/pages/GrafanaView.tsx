import { useState } from 'react';
import { useGrafanaDashboards } from '@/hooks/useSystemStatus';
import { GrafanaEmbed } from '@/components';
import { Clock, ChevronDown } from 'lucide-react';

const timeRanges = [
  { label: 'Last 5 minutes', value: 'from=now-5m&to=now' },
  { label: 'Last 15 minutes', value: 'from=now-15m&to=now' },
  { label: 'Last 30 minutes', value: 'from=now-30m&to=now' },
  { label: 'Last 1 hour', value: 'from=now-1h&to=now' },
  { label: 'Last 3 hours', value: 'from=now-3h&to=now' },
  { label: 'Last 6 hours', value: 'from=now-6h&to=now' },
  { label: 'Last 12 hours', value: 'from=now-12h&to=now' },
  { label: 'Last 24 hours', value: 'from=now-24h&to=now' },
  { label: 'Last 7 days', value: 'from=now-7d&to=now' },
];

export const GrafanaView = () => {
  const { data: dashboards, isLoading } = useGrafanaDashboards();
  const [selectedDashboard, setSelectedDashboard] = useState('d/system-overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[3]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading Grafana dashboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Grafana Dashboards</h1>
        <p className="text-gray-400">
          View and monitor system metrics through Grafana dashboards
        </p>
      </div>

      {/* Controls */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dashboard Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dashboard
            </label>
            <div className="relative">
              <select
                value={selectedDashboard}
                onChange={(e) => setSelectedDashboard(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg appearance-none cursor-pointer hover:border-primary-600 transition-colors"
              >
                <option value="d/system-overview">System Overview</option>
                <option value="d/api-metrics">API Metrics</option>
                <option value="d/database-metrics">Database Metrics</option>
                <option value="d/opensearch-metrics">OpenSearch Metrics</option>
                <option value="d/crawler-metrics">Crawler Metrics</option>
                {dashboards?.map((dashboard) => (
                  <option key={dashboard.uid} value={`d/${dashboard.uid}`}>
                    {dashboard.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Time Range Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Time Range
            </label>
            <div className="relative">
              <select
                value={selectedTimeRange.label}
                onChange={(e) => {
                  const range = timeRanges.find((r) => r.label === e.target.value);
                  if (range) setSelectedTimeRange(range);
                }}
                className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg appearance-none cursor-pointer hover:border-primary-600 transition-colors"
              >
                {timeRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Grafana Embed */}
      <GrafanaEmbed
        dashboardUid={`${selectedDashboard}?${selectedTimeRange.value}`}
        height="calc(100vh - 300px)"
      />

      {/* Info */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <p className="text-sm text-gray-400">
          <strong className="text-white">Note:</strong> Grafana dashboards update
          automatically every 30 seconds. You can change the refresh interval and time
          range directly in the embedded dashboard.
        </p>
      </div>
    </div>
  );
};
