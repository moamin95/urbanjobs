import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DataTable } from './components/jobs/DataTable';
import { Header } from './components/header/Header';
import {JobBoard} from './components/jobs/JobBoard'

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Header/> */}
      {/* <DataTable /> */}
      <JobBoard/>
    </QueryClientProvider>
  )
}

export default App
