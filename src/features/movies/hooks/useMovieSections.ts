import { useEffect, useState } from 'react'
import { movieService } from '@/features/movies/services/movieService'
import { useAppStore } from '@/store/useAppStore'
import type { MovieCategory } from '@/types/movie'

const categories: MovieCategory[] = ['trending', 'popular', 'topRated']

export const useMovieSections = (page: number) => {
  const sectionMovies = useAppStore((state) => state.sectionMovies)
  const setSectionMovies = useAppStore((state) => state.setSectionMovies)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    Promise.all(categories.map((category) => movieService.fetchByCategory(category, page)))
      .then(([trending, popular, topRated]) => {
        if (!active) {
          return
        }
        setSectionMovies('trending', trending.data)
        setSectionMovies('popular', popular.data)
        setSectionMovies('topRated', topRated.data)
        setTotalPages(Math.max(trending.totalPages, popular.totalPages, topRated.totalPages))
      })
      .catch(() => {
        if (active) {
          setError('Failed to load movies. Please retry.')
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
  }, [page, setSectionMovies])

  return { sectionMovies, loading, error, totalPages }
}
