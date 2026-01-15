import type {
  SystemStatus,
  ServiceInfo,
  LogEntry,
  MetricData,
  GrafanaDashboard,
} from '@/types';

export const mockSystemStatus: SystemStatus = {
  overall: 'healthy',
  services: [
    {
      name: 'API Server',
      status: 'healthy',
      uptime: 86400,
      lastCheck: new Date().toISOString(),
      message: 'All endpoints responding normally',
    },
    {
      name: 'PostgreSQL',
      status: 'healthy',
      uptime: 172800,
      lastCheck: new Date().toISOString(),
      message: 'Database connections: 15/100',
    },
    {
      name: 'OpenSearch',
      status: 'healthy',
      uptime: 259200,
      lastCheck: new Date().toISOString(),
      message: 'Cluster health: green',
    },
    {
      name: 'Redis Cache',
      status: 'healthy',
      uptime: 345600,
      lastCheck: new Date().toISOString(),
      message: 'Memory usage: 45%',
    },
    {
      name: 'News Crawler',
      status: 'degraded',
      uptime: 43200,
      lastCheck: new Date().toISOString(),
      message: 'Some sources timing out',
    },
  ],
  metrics: {
    cpu: {
      usage: 35.5,
      cores: 8,
    },
    memory: {
      used: 12.3,
      total: 32,
      percentage: 38.4,
    },
    disk: {
      used: 145.2,
      total: 500,
      percentage: 29.0,
    },
  },
  timestamp: new Date().toISOString(),
};

export const mockServices: ServiceInfo[] = [
  {
    id: 'api-server',
    name: 'API Server',
    status: 'running',
    type: 'api',
    port: 8000,
    replicas: 3,
    version: '1.2.0',
    startedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'crawler-worker',
    name: 'News Crawler',
    status: 'running',
    type: 'worker',
    replicas: 2,
    version: '1.1.5',
    startedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    status: 'running',
    type: 'database',
    port: 5432,
    version: '15.2',
    startedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'opensearch',
    name: 'OpenSearch',
    status: 'running',
    type: 'database',
    port: 9200,
    version: '2.11.0',
    startedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'redis',
    name: 'Redis',
    status: 'running',
    type: 'cache',
    port: 6379,
    version: '7.2',
    startedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 'grafana',
    name: 'Grafana',
    status: 'running',
    type: 'monitoring',
    port: 3000,
    version: '10.2.0',
    startedAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

export const mockLogs: LogEntry[] = [
  {
    timestamp: new Date(Date.now() - 5000).toISOString(),
    level: 'info',
    service: 'api',
    message: 'GET /api/articles - 200 OK - 45ms',
  },
  {
    timestamp: new Date(Date.now() - 15000).toISOString(),
    level: 'info',
    service: 'crawler',
    message: 'Successfully crawled 50 articles from source: example.com',
    metadata: {
      source: 'example.com',
      articles: 50,
      duration: '2.3s',
    },
  },
  {
    timestamp: new Date(Date.now() - 25000).toISOString(),
    level: 'warn',
    service: 'crawler',
    message: 'Source timeout: news-site.com (attempt 2/3)',
    metadata: {
      source: 'news-site.com',
      attempt: 2,
      timeout: '30s',
    },
  },
  {
    timestamp: new Date(Date.now() - 35000).toISOString(),
    level: 'error',
    service: 'api',
    message: 'Database connection pool exhausted',
    metadata: {
      pool_size: 100,
      active_connections: 100,
      waiting_requests: 15,
    },
  },
  {
    timestamp: new Date(Date.now() - 45000).toISOString(),
    level: 'info',
    service: 'database',
    message: 'Query executed successfully',
    metadata: {
      query: 'SELECT * FROM articles WHERE created_at > NOW() - INTERVAL 1 DAY',
      duration: '120ms',
      rows: 1234,
    },
  },
  {
    timestamp: new Date(Date.now() - 55000).toISOString(),
    level: 'debug',
    service: 'api',
    message: 'Cache hit for key: articles:trending:latest',
  },
];

export const mockMetrics: MetricData[] = [
  {
    name: 'http_requests_total',
    value: 15234,
    unit: 'requests',
    timestamp: new Date().toISOString(),
    labels: {
      method: 'GET',
      status: '200',
    },
  },
  {
    name: 'http_request_duration_seconds',
    value: 0.045,
    unit: 's',
    timestamp: new Date().toISOString(),
    labels: {
      quantile: '0.95',
    },
  },
  {
    name: 'articles_crawled_total',
    value: 23456,
    unit: 'articles',
    timestamp: new Date().toISOString(),
  },
  {
    name: 'database_connections_active',
    value: 15,
    unit: 'connections',
    timestamp: new Date().toISOString(),
  },
  {
    name: 'cache_hit_ratio',
    value: 0.87,
    unit: 'ratio',
    timestamp: new Date().toISOString(),
  },
  {
    name: 'opensearch_index_size',
    value: 125.4,
    unit: 'GB',
    timestamp: new Date().toISOString(),
  },
];

export const mockGrafanaDashboards: GrafanaDashboard[] = [
  {
    uid: 'system-overview',
    title: 'System Overview',
    url: '/grafana/d/system-overview',
    tags: ['system', 'overview'],
  },
  {
    uid: 'api-metrics',
    title: 'API Metrics',
    url: '/grafana/d/api-metrics',
    tags: ['api', 'performance'],
  },
  {
    uid: 'database-metrics',
    title: 'Database Performance',
    url: '/grafana/d/database-metrics',
    tags: ['database', 'postgres'],
  },
  {
    uid: 'opensearch-metrics',
    title: 'OpenSearch Metrics',
    url: '/grafana/d/opensearch-metrics',
    tags: ['opensearch', 'search'],
  },
];
