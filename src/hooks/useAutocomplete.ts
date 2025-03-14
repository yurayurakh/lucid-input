import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { AutocompleteItem } from '../types/formula'

const API_URL = 'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete'

// Function to fetch data from API
const fetchAutocompleteItems = async (): Promise<AutocompleteItem[]> => {
    const { data } = await axios.get<AutocompleteItem[]>(API_URL)
    return data
}

interface UseAutocompleteOptions {
    enabled?: boolean
    staleTime?: number
}

export const useAutocomplete = (
    searchTerm: string,
    options: UseAutocompleteOptions = {}
) => {
    const { enabled = true, staleTime = 5 * 60 * 1000 } = options

    const {
        data = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ['autocomplete'],
        queryFn: fetchAutocompleteItems,
        staleTime,
        enabled
    })

    // Filter items that match the search query
    const filteredItems = searchTerm
        ? data.filter(
              (item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : []

    return {
        items: filteredItems,
        isLoading,
        error,
        allItems: data
    }
}
