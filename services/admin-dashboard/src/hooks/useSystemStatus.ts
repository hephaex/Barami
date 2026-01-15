import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';

export const useSystemStatus = () => {
  return useQuery({
    queryKey: ['systemStatus'],
    queryFn: api.getSystemStatus,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
};

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: api.getServices,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
};

export const useServiceControl = () => {
  const queryClient = useQueryClient();

  const startService = useMutation({
    mutationFn: api.startService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
    },
  });

  const stopService = useMutation({
    mutationFn: api.stopService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
    },
  });

  const restartService = useMutation({
    mutationFn: api.restartService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
    },
  });

  return { startService, stopService, restartService };
};

export const useLogs = (service?: string, level?: string, limit = 100) => {
  return useQuery({
    queryKey: ['logs', service, level, limit],
    queryFn: () => api.getLogs(service, level, limit),
    refetchInterval: 3000, // Refresh every 3 seconds
  });
};

export const useMetrics = () => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: api.getMetrics,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
};

export const useGrafanaDashboards = () => {
  return useQuery({
    queryKey: ['grafanaDashboards'],
    queryFn: api.getGrafanaDashboards,
  });
};
