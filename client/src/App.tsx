import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {JobBoard} from './components/jobs/JobBoard'
import { Nav } from './components/header/Nav'

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Nav />
      <JobBoard/>
    </QueryClientProvider>
  )
}

export default App
