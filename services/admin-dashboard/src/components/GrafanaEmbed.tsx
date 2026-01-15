import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface GrafanaEmbedProps {
  dashboardUid?: string;
  height?: string;
}

export const GrafanaEmbed = ({
  dashboardUid = 'd/system-overview',
  height = '800px',
}: GrafanaEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  const grafanaUrl = `/grafana/${dashboardUid}?orgId=1&refresh=30s&kiosk=tv`;

  const handleRefresh = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-dark-border">
        <h3 className="text-white font-semibold">Grafana Dashboard</h3>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      <div className="relative" style={{ height }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-bg z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400">Loading Grafana...</p>
            </div>
          </div>
        )}
        <iframe
          key={key}
          src={grafanaUrl}
          className="w-full h-full"
          frameBorder="0"
          onLoad={() => setIsLoading(false)}
          title="Grafana Dashboard"
        />
      </div>
    </div>
  );
};
