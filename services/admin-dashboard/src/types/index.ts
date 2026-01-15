export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  lastCheck: string;
  message?: string;
}

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'down';
  services: ServiceHealth[];
  metrics: SystemMetrics;
  timestamp: string;
}

export interface ServiceInfo {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'restarting';
  type: 'api' | 'worker' | 'database' | 'cache' | 'monitoring';
  port?: number;
  replicas?: number;
  version?: string;
  startedAt?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  service: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface MetricData {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  labels?: Record<string, string>;
}

export interface GrafanaDashboard {
  uid: string;
  title: string;
  url: string;
  tags: string[];
}
