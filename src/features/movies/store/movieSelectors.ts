import { useAppStore } from '@/store/useAppStore'

export const useTrendingMovies = () => useAppStore((state) => state.sectionMovies.trending)
export const usePopularMovies = () => useAppStore((state) => state.sectionMovies.popular)
export const useTopRatedMovies = () => useAppStore((state) => state.sectionMovies.topRated)
