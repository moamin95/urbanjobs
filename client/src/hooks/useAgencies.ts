import { useQuery } from "@tanstack/react-query";


export type Agency = Record<string, string>
export interface Agencies {
    data: Agency[]
    isLoading: boolean;
    isError: boolean;
}

export const useAgencies = (): Agencies => {
    console.log('useAgencies hook called');

    const queryKey = ['agencies'];
    const queryFn = async () => {

        console.log('queryFn executing - fetching agencies');

        const res = await fetch('agencies');

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }

        const json = await res.json();

        console.log('json', json);

        return json;
    }

    const {data, isLoading, isError} = useQuery<Agency[]>({
        queryKey,
        queryFn
    })


    return {data: data || [], isLoading, isError};
}