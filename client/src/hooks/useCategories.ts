import { useQuery } from "@tanstack/react-query";

export type Category = string;

export interface CategoryQuery {
    data: Category[] | undefined,
    isLoading: boolean,
    isError: boolean
}

export const useCategories = (): CategoryQuery => {

    const queryKey = ["categories"];
    const queryFn = async () => {

        const res = await fetch('/categories');
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }

        return await res.json();
    }

    const { data, isLoading, isError } = useQuery<Category[]>({
        queryKey,
        queryFn
    })

    return { data, isLoading, isError };

}   