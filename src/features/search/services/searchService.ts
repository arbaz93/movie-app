import { apiClient, hasTmdbCredentials } from '@/services/apiClient'
import { mockMovies } from '@/services/mockData'
import type { Movie, PaginatedResponse } from '@/types/movie'

const pageSize = 12
const sampleVideo = 'https://www.w3schools.com/html/mov_bbb.mp4'
const placeholderPoster =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'
const placeholderBackdrop =
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mapTmdbSearchMovie = (movie: Record<string, unknown>): Movie => ({
  id: Number(movie.id),
  title: String(movie.title ?? 'Untitled'),
  description: String(movie.overview ?? 'No description available.'),
  posterUrl: movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${String(movie.poster_path)}`
    : placeholderPoster,
  backdropUrl: movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${String(movie.backdrop_path)}`
    : placeholderBackdrop,
  rating: Number(movie.vote_average ?? 0),
  releaseDate: String(movie.release_date ?? '2024-01-01'),
  durationMinutes: 120,
  categories: ['popular'],
  videoUrl: sampleVideo,
})

const paginate = <T,>(items: T[], page: number): PaginatedResponse<T> => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  return {
    data: items.slice(start, end),
    page,
    totalPages,
    totalResults: items.length,
  }
}

export const searchService = {
  async searchMovies(query: string, page = 1): Promise<PaginatedResponse<Movie>> {
    if (!query.trim()) {
      return {
        data: [],
        page: 1,
        totalPages: 1,
        totalResults: 0,
      }
    }

    if (!hasTmdbCredentials) {
      await sleep(350)
      const normalized = query.trim().toLowerCase()
      const filtered = mockMovies.filter((movie) =>
        `${movie.title} ${movie.description}`.toLowerCase().includes(normalized),
      )
      return paginate(filtered, page)
    }

    const response = await apiClient.get('/search/movie', { params: { query, page } })
    return {
      data: (response.data.results as Record<string, unknown>[]).map(mapTmdbSearchMovie),
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    }
  },
}
