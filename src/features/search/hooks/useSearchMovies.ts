import { useEffect, useState } from 'react'
import { searchService } from '@/features/search/services/searchService'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useAppStore } from '@/store/useAppStore'

export const useSearchMovies = (query: string, page: number) => {
  const debouncedQuery = useDebouncedValue(query, 350)
  const searchResults = useAppStore((state) => state.searchResults)
  const setSearchResults = useAppStore((state) => state.setSearchResults)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let active = true

    if (!debouncedQuery.trim()) {
      setSearchResults([])
      setError(null)
      setLoading(false)
      setTotalPages(1)
      return () => {
        active = false
      }
    }

    setLoading(true)
    setError(null)
    searchService
      .searchMovies(debouncedQuery, page)
      .then((response) => {
        if (!active) {
          return
        }
        setSearchResults(response.data)
        setTotalPages(response.totalPages)
      })
      .catch(() => {
        if (active) {
          setError('Search request failed. Please try again.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [debouncedQuery, page, setSearchResults])

  return { searchResults, loading, error, totalPages, debouncedQuery }
}
