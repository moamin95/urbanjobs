import { useQuery } from "@tanstack/react-query";


export type Agency = Record<string, string>
export interface Agencies {
    data: Agency[]
    isLoading: boolean;
    isError: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const useAgencies = (): Agencies => {
    const queryKey = ['agencies'];
    const queryFn = async () => {
        const res = await fetch(`${API_URL}/agencies`);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }

        const json = await res.json();

        return json;
    }

    const { data, isLoading, isError } = useQuery<Agency[]>({
        queryKey,
        queryFn
    })


    return { data: data || [], isLoading, isError };
}