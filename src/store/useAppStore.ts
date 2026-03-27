import { create } from 'zustand'
import type { Movie, MovieCategory } from '@/types/movie'

type SectionMovies = Record<MovieCategory, Movie[]>

interface AppState {
  sectionMovies: SectionMovies
  searchResults: Movie[]
  searchQuery: string
  selectedMovieId: number | null
  favorites: number[]
  setSectionMovies: (category: MovieCategory, movies: Movie[]) => void
  setSearchResults: (movies: Movie[]) => void
  setSearchQuery: (query: string) => void
  setSelectedMovieId: (movieId: number | null) => void
  toggleFavorite: (movieId: number) => void
}

const initialSectionMovies: SectionMovies = {
  trending: [],
  popular: [],
  topRated: [],
}

export const useAppStore = create<AppState>((set) => ({
  sectionMovies: initialSectionMovies,
  searchResults: [],
  searchQuery: '',
  selectedMovieId: null,
  favorites: [],
  setSectionMovies: (category, movies) =>
    set((state) => ({
      sectionMovies: {
        ...state.sectionMovies,
        [category]: movies,
      },
    })),
  setSearchResults: (movies) => set({ searchResults: movies }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedMovieId: (movieId) => set({ selectedMovieId: movieId }),
  toggleFavorite: (movieId) =>
    set((state) => {
      const exists = state.favorites.includes(movieId)
      return {
        favorites: exists
          ? state.favorites.filter((id) => id !== movieId)
          : [...state.favorites, movieId],
      }
    }),
}))
