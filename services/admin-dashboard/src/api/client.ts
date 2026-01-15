import axios from 'axios';
import type {
  SystemStatus,
  ServiceInfo,
  LogEntry,
  MetricData,
  GrafanaDashboard,
} from '@/types';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // System status
  getSystemStatus: async (): Promise<SystemStatus> => {
    const { data } = await apiClient.get<SystemStatus>('/admin/status');
    return data;
  },

  // Services
  getServices: async (): Promise<ServiceInfo[]> => {
    const { data } = await apiClient.get<ServiceInfo[]>('/admin/services');
    return data;
  },

  startService: async (serviceId: string): Promise<void> => {
    await apiClient.post(`/admin/services/${serviceId}/start`);
  },

  stopService: async (serviceId: string): Promise<void> => {
    await apiClient.post(`/admin/services/${serviceId}/stop`);
  },

  restartService: async (serviceId: string): Promise<void> => {
    await apiClient.post(`/admin/services/${serviceId}/restart`);
  },

  // Logs
  getLogs: async (
    service?: string,
    level?: string,
    limit = 100
  ): Promise<LogEntry[]> => {
    const { data } = await apiClient.get<LogEntry[]>('/admin/logs', {
      params: { service, level, limit },
    });
    return data;
  },

  // Metrics
  getMetrics: async (): Promise<MetricData[]> => {
    const { data } = await apiClient.get<MetricData[]>('/admin/metrics');
    return data;
  },

  // Grafana
  getGrafanaDashboards: async (): Promise<GrafanaDashboard[]> => {
    const { data } = await apiClient.get<GrafanaDashboard[]>(
      '/admin/grafana/dashboards'
    );
    return data;
  },
};

export default apiClient;
