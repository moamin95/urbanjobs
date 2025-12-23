import {
  useQuery,
} from '@tanstack/react-query'
import type {Job} from '../../../shared/types/job'

export interface JobsQuery {
  data: Job[],
  totalCount: number,
  isLoading: boolean,
  isError: boolean,
  isFetching: boolean
}

export interface JobsQueryProps {
  pageNumber: number
  pageSize: number
  searchQuery?: string
}

interface JobsResponse {
  jobs: Job[]
  totalCount: number
}

export const useJobsQuery = ({pageNumber = 1, pageSize = 50, searchQuery = ''}:JobsQueryProps): JobsQuery => {
  console.log(searchQuery, 'searchQuery')
  const queryKey = ['jobs', pageNumber, pageSize, searchQuery];
  const queryFn = async () => {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchQuery) {
      params.append('search', searchQuery);
    }

    const res = await fetch(`/jobs?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  }

  const { data, isLoading, isError, isFetching } = useQuery<JobsResponse>({
    queryKey,
    queryFn,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  })

  return {
    data: data?.jobs || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    isFetching
  }

}
