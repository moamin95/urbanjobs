import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DataTable } from './components/jobs/DataTable';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable />
    </QueryClientProvider>
  )
}

export default App
