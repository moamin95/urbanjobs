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

export type SearchQuery = Record<string, string>

export interface JobsQueryProps {
  pageNumber: number
  pageSize: number
  searchQuery?: SearchQuery
  agencies?: string[]
}

interface JobsResponse {
  jobs: Job[]
  totalCount: number
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const useJobsQuery = ({pageNumber = 1, pageSize = 50, searchQuery = {}, agencies = []}:JobsQueryProps): JobsQuery => {
  const queryKey = ['jobs', pageNumber, pageSize, searchQuery, agencies];
  const queryFn = async () => {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchQuery) {
      if (searchQuery.job) {
        params.append('job', searchQuery.job)
      }
      if (searchQuery.keyWords) {
        params.append('keyWords', searchQuery.keyWords)
      }
    }

    // Add agencies to query params
    if (agencies && agencies.length > 0) {
      agencies.forEach(agency => {
        params.append('agencies', agency);
      });
    }

    const res = await fetch(`${API_URL}/jobs?${params.toString()}`);
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
