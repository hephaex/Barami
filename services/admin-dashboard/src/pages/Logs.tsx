import { useState } from 'react';
import { useLogs } from '@/hooks/useSystemStatus';
import { LogViewer } from '@/components';
import { ChevronDown, Download, Trash2 } from 'lucide-react';

const services = [
  { value: '', label: 'All Services' },
  { value: 'api', label: 'API Server' },
  { value: 'crawler', label: 'News Crawler' },
  { value: 'worker', label: 'Background Worker' },
  { value: 'database', label: 'Database' },
  { value: 'opensearch', label: 'OpenSearch' },
  { value: 'nginx', label: 'Nginx' },
];

const logLevels = [
  { value: '', label: 'All Levels' },
  { value: 'debug', label: 'Debug' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Warning' },
  { value: 'error', label: 'Error' },
];

const limits = [
  { value: 50, label: '50 lines' },
  { value: 100, label: '100 lines' },
  { value: 200, label: '200 lines' },
  { value: 500, label: '500 lines' },
  { value: 1000, label: '1000 lines' },
];

export const Logs = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLimit, setSelectedLimit] = useState(100);
  const [autoScroll, setAutoScroll] = useState(true);

  const { data: logs, isLoading } = useLogs(
    selectedService || undefined,
    selectedLevel || undefined,
    selectedLimit
  );

  const handleExport = () => {
    if (!logs || logs.length === 0) return;

    const content = logs
      .map(
        (log) =>
          `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.service}] ${
            log.message
          }${log.metadata ? '\n' + JSON.stringify(log.metadata, null, 2) : ''}`
      )
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barami-logs-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
        <p className="text-gray-400">
          View and filter application logs in real-time
        </p>
      </div>

      {/* Controls */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Service Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Service
            </label>
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg appearance-none cursor-pointer hover:border-primary-600 transition-colors"
              >
                {services.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Level Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Log Level
            </label>
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg appearance-none cursor-pointer hover:border-primary-600 transition-colors"
              >
                {logLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Limit Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Limit
            </label>
            <div className="relative">
              <select
                value={selectedLimit}
                onChange={(e) => setSelectedLimit(Number(e.target.value))}
                className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg appearance-none cursor-pointer hover:border-primary-600 transition-colors"
              >
                {limits.map((limit) => (
                  <option key={limit.value} value={limit.value}>
                    {limit.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Auto Scroll Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Options
            </label>
            <label className="flex items-center gap-2 bg-dark-bg border border-dark-border px-4 py-2 rounded-lg cursor-pointer hover:border-primary-600 transition-colors">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-dark-bg border-dark-border rounded focus:ring-primary-500"
              />
              <span className="text-white text-sm">Auto-scroll</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={!logs || logs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-bg disabled:text-gray-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            title="Clear log filters"
            onClick={() => {
              setSelectedService('');
              setSelectedLevel('');
              setSelectedLimit(100);
            }}
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Log Stats */}
      {logs && logs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Total Logs</p>
            <p className="text-2xl font-bold text-white">{logs.length}</p>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Errors</p>
            <p className="text-2xl font-bold text-red-500">
              {logs.filter((l) => l.level === 'error').length}
            </p>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Warnings</p>
            <p className="text-2xl font-bold text-yellow-500">
              {logs.filter((l) => l.level === 'warn').length}
            </p>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Info</p>
            <p className="text-2xl font-bold text-blue-500">
              {logs.filter((l) => l.level === 'info').length}
            </p>
          </div>
        </div>
      )}

      {/* Log Viewer */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96 bg-dark-surface border border-dark-border rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Loading logs...</p>
          </div>
        </div>
      ) : (
        <LogViewer logs={logs || []} autoScroll={autoScroll} />
      )}

      {/* Info */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <p className="text-sm text-gray-400">
          <strong className="text-white">Note:</strong> Logs are updated automatically
          every 3 seconds. Use filters above to narrow down the logs you want to view.
          Export functionality allows you to download logs for offline analysis.
        </p>
      </div>
    </div>
  );
};
