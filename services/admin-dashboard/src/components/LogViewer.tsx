import { useEffect, useRef } from 'react';
import { AlertCircle, Info, AlertTriangle, Bug } from 'lucide-react';
import clsx from 'clsx';
import type { LogEntry } from '@/types';

interface LogViewerProps {
  logs: LogEntry[];
  autoScroll?: boolean;
}

const levelConfig = {
  debug: {
    icon: Bug,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
  },
  info: {
    icon: Info,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  warn: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
};

export const LogViewer = ({ logs, autoScroll = true }: LogViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  return (
    <div
      ref={containerRef}
      className="bg-dark-bg border border-dark-border rounded-lg p-4 h-[600px] overflow-y-auto font-mono text-sm"
    >
      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No logs available
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, index) => {
            const config = levelConfig[log.level];
            const Icon = config.icon;

            return (
              <div
                key={index}
                className={clsx(
                  'flex items-start gap-3 p-3 rounded border',
                  config.bgColor,
                  'border-dark-border hover:border-dark-hover transition-colors'
                )}
              >
                <Icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', config.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gray-400 text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <span className={clsx('text-xs font-semibold uppercase', config.color)}>
                      {log.level}
                    </span>
                    <span className="text-primary-400 text-xs font-medium">
                      {log.service}
                    </span>
                  </div>
                  <p className="text-gray-200 break-words">{log.message}</p>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <pre className="mt-2 text-xs text-gray-400 bg-dark-surface p-2 rounded overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
