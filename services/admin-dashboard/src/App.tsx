import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminSidebar } from '@/components';
import { Overview, GrafanaView, Metrics, Services, Logs } from '@/pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex min-h-screen bg-dark-bg">
          <AdminSidebar />
          <main className="flex-1 ml-64 p-8">
            <Routes>
              <Route path="/admin" element={<Overview />} />
              <Route path="/admin/grafana" element={<GrafanaView />} />
              <Route path="/admin/metrics" element={<Metrics />} />
              <Route path="/admin/services" element={<Services />} />
              <Route path="/admin/logs" element={<Logs />} />
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
