import { useSystemStatus } from '@/hooks/useSystemStatus';
import {
  ServiceStatusCard,
  ResourceUsageBar,
} from '@/components';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import clsx from 'clsx';

const quickLinks = [
  {
    label: 'Grafana',
    href: '/admin/grafana',
    icon: ExternalLink,
    color: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
  },
  {
    label: 'Prometheus',
    href: '/admin/metrics',
    icon: ExternalLink,
    color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  },
  {
    label: 'Logs',
    href: '/admin/logs',
    icon: ExternalLink,
    color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  },
  {
    label: 'Services',
    href: '/admin/services',
    icon: ExternalLink,
    color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  },
];

const statusIcons = {
  healthy: { icon: CheckCircle2, color: 'text-green-500' },
  degraded: { icon: AlertTriangle, color: 'text-yellow-500' },
  down: { icon: XCircle, color: 'text-red-500' },
};

export const Overview = () => {
  const { data: status, isLoading, refetch } = useSystemStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading system status...</p>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Failed to load system status</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[status.overall].icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
          <p className="text-gray-400">
            Last updated: {new Date(status.timestamp).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-dark-surface border border-dark-border hover:border-primary-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Status */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <StatusIcon className={clsx('w-12 h-12', statusIcons[status.overall].color)} />
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">
              System {status.overall}
            </h2>
            <p className="text-primary-100 mt-1">
              All critical services are {status.overall === 'healthy' ? 'operational' : 'experiencing issues'}
            </p>
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Resource Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResourceUsageBar
            label="CPU Usage"
            used={status.metrics.cpu.usage}
            total={status.metrics.cpu.cores * 100}
            unit="%"
            percentage={status.metrics.cpu.usage}
            icon={<Cpu className="w-5 h-5" />}
          />
          <ResourceUsageBar
            label="Memory Usage"
            used={status.metrics.memory.used}
            total={status.metrics.memory.total}
            unit="GB"
            percentage={status.metrics.memory.percentage}
            icon={<MemoryStick className="w-5 h-5" />}
          />
          <ResourceUsageBar
            label="Disk Usage"
            used={status.metrics.disk.used}
            total={status.metrics.disk.total}
            unit="GB"
            percentage={status.metrics.disk.percentage}
            icon={<HardDrive className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Service Health */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Service Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {status.services.map((service) => (
            <ServiceStatusCard key={service.name} service={service} />
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={clsx(
                'flex items-center justify-center gap-3 p-6 rounded-lg transition-colors border border-dark-border',
                link.color
              )}
            >
              <link.icon className="w-6 h-6" />
              <span className="font-semibold">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
