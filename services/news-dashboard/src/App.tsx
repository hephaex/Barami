import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Home from './pages/Home';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<NewsList />} />
              <Route path="/news/:id" element={<NewsDetail />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-sm text-gray-500">
                Barami News Dashboard &copy; {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
