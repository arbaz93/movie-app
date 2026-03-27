import { apiClient, hasTmdbCredentials } from '@/services/apiClient'
import { ytsClient } from "@/services/ytsClient.ts";
import { mockMovies } from '@/services/mockData'
import type { Movie, MovieCategory, PaginatedResponse } from '@/types/movie'

const pageSize = 6
const placeholderPoster =
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
const placeholderBackdrop =
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1400&q=80'
const sampleVideo = 'https://www.w3schools.com/html/mov_bbb.mp4'

const endpointByCategory: Record<MovieCategory, string> = {
  trending: '/trending/movie/week',
  popular: '/movie/popular',
  topRated: '/movie/top_rated',
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mapTmdbMovie = (movie: Record<string, unknown>): Movie => ({
  id: Number(movie.id),
  title: String(movie.title ?? movie.name ?? 'Untitled'),
  description: String(movie?.description_intro ?? movie?.overview ?? 'No description available.'),
  posterUrl: movie?.medium_cover_image ? String(movie?.medium_cover_image)
      : (movie?.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : placeholderPoster),

  backdropUrl: movie?.background_image ? String(movie?.background_image)
      : (movie?.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : placeholderBackdrop),
  rating: Number(movie?.rating ?? movie?.vote_average ?? 0),
  releaseDate: String(movie?.year ?? movie?.release_date ?? '2024-01-01'),
  durationMinutes: Number(movie?.runtime ?? 120),
  categories: Array.isArray(movie?.genres) ? movie?.genres : [],
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

export const movieService = {
  async getImdbIdByTmdbId(tmdbId: number): Promise<string | null> {
    if (!hasTmdbCredentials) {
      await sleep(200)
      return null
    }

    try {
      const response = await apiClient.get(`/movie/${tmdbId}/external_ids`)
      const imdbId = response.data.imdb_id as string | null | undefined
      return imdbId ?? null
    } catch {
      return null
    }
  },

  async fetchByCategory(category: MovieCategory, page = 1): Promise<PaginatedResponse<Movie>> {
    if (!hasTmdbCredentials) {
      await sleep(400)
      const filtered = mockMovies.filter((movie) => movie.categories.includes(category))
      return paginate(filtered, page)
    }

    const endpoint = endpointByCategory[category]
    const response = await apiClient.get(endpoint, { params: { page } })
    return {
      data: (response.data.results as Record<string, unknown>[]).map(mapTmdbMovie),
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    }
  },

  async fetchMovieById(movieId: number): Promise<Movie | null> {
    if (!hasTmdbCredentials) {
      await sleep(300)
      return mockMovies.find((movie) => movie.id === movieId) ?? null
    }

    try {
      const imdb_id = await this.getImdbIdByTmdbId(movieId)
      const response = await ytsClient.get(`/movie_details.json?imdb_id=${imdb_id}`)
      // const response = await apiClient.get(`/movie/${movieId}`)
      console.log(response.data.data.movie)
      return mapTmdbMovie(response.data.data.movie as Record<string, unknown>)
    } catch {
      return null
    }
  },

  async fetchSuggested(movieId: number): Promise<Movie[]> {
    if (!hasTmdbCredentials) {
      await sleep(300)
      return mockMovies.filter((movie) => movie.id !== movieId).slice(0, 8)
    }

    const response = await apiClient.get(`/movie/${movieId}/similar`)
    return (response.data.results as Record<string, unknown>[]).map(mapTmdbMovie).slice(0, 10)
  },
}
