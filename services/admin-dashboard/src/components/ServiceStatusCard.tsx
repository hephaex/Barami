import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import type { ServiceHealth } from '@/types';

interface ServiceStatusCardProps {
  service: ServiceHealth;
}

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    label: 'Healthy',
  },
  degraded: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    label: 'Degraded',
  },
  down: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    label: 'Down',
  },
};

export const ServiceStatusCard = ({ service }: ServiceStatusCardProps) => {
  const config = statusConfig[service.status];
  const Icon = config.icon;

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-primary-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">{service.name}</h3>
          <p className="text-xs text-gray-400 mt-1">
            Last check: {new Date(service.lastCheck).toLocaleTimeString()}
          </p>
        </div>
        <div className={clsx('p-2 rounded-lg', config.bgColor)}>
          <Icon className={clsx('w-5 h-5', config.color)} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={clsx(
            'text-sm font-medium px-2 py-1 rounded',
            config.bgColor,
            config.color
          )}
        >
          {config.label}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{formatUptime(service.uptime)}</span>
        </div>
      </div>

      {service.message && (
        <p className="mt-3 text-xs text-gray-400 border-t border-dark-border pt-3">
          {service.message}
        </p>
      )}
    </div>
  );
};
