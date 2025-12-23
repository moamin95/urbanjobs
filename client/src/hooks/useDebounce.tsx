import { useEffect, useState } from 'react';

interface DebounceProps {
    delay: number,
    query: string
}

interface Debounce {
    debouncedQuery: string
}


export const useDebounce = ({ delay = 500, query }: DebounceProps): Debounce => {
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query);
        }, delay)

        return () => clearTimeout(timeout)
    }, [query, delay]);


    return { debouncedQuery };
}