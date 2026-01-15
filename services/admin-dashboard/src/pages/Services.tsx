import { useServices, useServiceControl } from '@/hooks/useSystemStatus';
import {
  Play,
  Square,
  RefreshCw,
  Server,
  Database,
  Activity,
  Cpu,
  HardDrive,
} from 'lucide-react';
import clsx from 'clsx';
import type { ServiceInfo } from '@/types';

const serviceTypeIcons = {
  api: Server,
  worker: Cpu,
  database: Database,
  cache: HardDrive,
  monitoring: Activity,
};

const statusColors = {
  running: 'bg-green-500/10 text-green-500 border-green-500/30',
  stopped: 'bg-red-500/10 text-red-500 border-red-500/30',
  restarting: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
};

export const Services = () => {
  const { data: services, isLoading } = useServices();
  const { startService, stopService, restartService } = useServiceControl();

  const handleStart = (serviceId: string) => {
    startService.mutate(serviceId);
  };

  const handleStop = (serviceId: string) => {
    stopService.mutate(serviceId);
  };

  const handleRestart = (serviceId: string) => {
    restartService.mutate(serviceId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  const groupedServices = services?.reduce((acc, service) => {
    if (!acc[service.type]) {
      acc[service.type] = [];
    }
    acc[service.type].push(service);
    return acc;
  }, {} as Record<string, ServiceInfo[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Service Management</h1>
        <p className="text-gray-400">Monitor and control running services</p>
      </div>

      {/* Services by Type */}
      {groupedServices &&
        Object.entries(groupedServices).map(([type, typeServices]) => {
          const Icon = serviceTypeIcons[type as keyof typeof serviceTypeIcons] || Server;

          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-semibold text-white capitalize">{type}</h2>
                <span className="text-sm text-gray-500">({typeServices.length})</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {typeServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-dark-surface border border-dark-border rounded-lg p-5 hover:border-primary-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={clsx(
                              'text-xs font-medium px-2 py-1 rounded border',
                              statusColors[service.status]
                            )}
                          >
                            {service.status}
                          </span>
                          {service.port && (
                            <span className="text-xs text-gray-400">
                              Port: {service.port}
                            </span>
                          )}
                          {service.version && (
                            <span className="text-xs text-gray-400">
                              v{service.version}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {service.replicas && (
                      <div className="mb-4 text-sm text-gray-400">
                        Replicas: {service.replicas}
                      </div>
                    )}

                    {service.startedAt && (
                      <div className="mb-4 text-sm text-gray-400">
                        Started: {new Date(service.startedAt).toLocaleString()}
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-dark-border">
                      <button
                        onClick={() => handleStart(service.id)}
                        disabled={
                          service.status === 'running' ||
                          startService.isPending
                        }
                        className={clsx(
                          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium',
                          service.status === 'running' ||
                            startService.isPending
                            ? 'bg-dark-bg text-gray-600 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        )}
                      >
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                      </button>

                      <button
                        onClick={() => handleStop(service.id)}
                        disabled={
                          service.status === 'stopped' ||
                          stopService.isPending
                        }
                        className={clsx(
                          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium',
                          service.status === 'stopped' ||
                            stopService.isPending
                            ? 'bg-dark-bg text-gray-600 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        )}
                      >
                        <Square className="w-4 h-4" />
                        <span>Stop</span>
                      </button>

                      <button
                        onClick={() => handleRestart(service.id)}
                        disabled={restartService.isPending}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium',
                          restartService.isPending
                            ? 'bg-dark-bg text-gray-600 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        )}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Restart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      {(!services || services.length === 0) && (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
          <Server className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No services found</p>
        </div>
      )}

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-sm text-yellow-200">
          <strong className="text-yellow-100">Warning:</strong> Stopping critical
          services may impact system functionality. Only perform service operations
          during maintenance windows or when necessary.
        </p>
      </div>
    </div>
  );
};
